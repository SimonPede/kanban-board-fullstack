const columnsBase = require('../data/columns.json');
const Task = require('../models/Task.js');
const tags = require('../data/tags.json');

function validateTask(task) {
    const errors = [];

    if (!task.title || typeof task.title !== "string" || task.title.trim().length === 0) {
        errors.push("Titel ist erforderlich und darf nicht leer sein.");
    } else if (task.title.length > 50) {
        errors.push("Titel darf maximal 50 Zeichen lang sein.");
    }

    const validColumnsIds = columnsBase.map(c => c.id);
    if (!task.column || typeof task.column !== "string" || !validColumnsIds.includes(task.column)) {
        errors.push("Ungültige oder fehlende Spalten-ID.");
    }

    if (task.taskTags && !Array.isArray(task.taskTags)) {
        errors.push("Tags müssen als Liste (Array) gesendet werden.");
    }

    return errors;
}

exports.getTags = async (req, res) => {
    //kann nur schiefgehen, wenn tags.json leer wäre. Kann momentan nicht passieren
    //daher kein try-catch
    res.status(200).json(tags);
};

exports.getTasks = async (req, res, next) => {
    try {
        const allTasks = await Task.find(); //alle tasks werden aus der Cloud geholt (durch id identifiziert)
        // console.log(allTasks);

        const columnsWithTasks = columnsBase.map(col => {
            return {
                ...col,
                tasks: allTasks.filter(task => String(task.columnId) === String(col.id))
            };
        });
        res.status(200).json(columnsWithTasks);
    } catch (error) {
        next(error);
    }
};

exports.createNewTask = async (req, res, next) => {
    const errors = validateTask(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ error: "Validierung fehlgeschlagen", details: errors });
    }

    const { column, title, text, taskTags } = req.body;

    try {
        const taskDoc = new Task({
            title, //kurzschreibweise nennt man "Property Shorthand"
            text,
            columnId: column,
            tags: taskTags
        });

        const savedTask = await taskDoc.save();
        res.status(201).json(savedTask);
    } catch (error) {
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    const id = req.params.id; //funktioniert wegen "/api/tasks/:id"
    let { title, text, taskTags, column } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title,
                text,
                tags: taskTags,
                columnId: column
            },
            { returnDocument: "after" } //gibt aktualisierte task zurück
        );
        if (updatedTask) {
            return res.status(200).json(updatedTask);
        }
        return res.status(404).json({ error: "Task nicht gefunden!" });
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (deletedTask) {
            return res.status(200).send("Task gelöscht");
        }
        return res.status(404).json({ error: "Task nicht gefunden!" });
    } catch (error) {
        next(error);
    }
};

exports.moveTask = async (req, res, next) => {
    const id = req.params.id;
    const { newColumnId } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { columnId: newColumnId },
            { returnDocument: "after" } //gibt aktualisierte task zurück
        );
        if (updatedTask) {
            return res.status(200).json(updatedTask);
        }
        res.status(404).json({ error: "Task nicht gefunden" });
    } catch (error) {
        next(error);
    }
};