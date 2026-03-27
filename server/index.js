const express = require('express');
const path = require('path');

///////////////////////////
// Data initialization
///////////////////////////

//hier eine in-memory Kopie
const tags = require('./data/tags.json');
const columns = require('./data/columns.json');

let allTasks = [];
columns.forEach(col => {
    allTasks = allTasks.concat(col.tasks);
});

let taskIdCounter = (allTasks.length > 0 ? Math.max(...allTasks.map(e => parseInt(e.id.replace('t', '')))): 0) + 1;
///////////////////////////
// Server setup
///////////////////////////

const app = express();

app.use(express.json());

//nun wollen wir Backend mit Frontend verknüpfen (damit wir nicht Vite und Express Server haben)
//Statische Dateien aus dem dist-Ordner ausliefern
//__dirname: globale Variable in Node.js. Sie sagt dir immer: "In welchem Ordner auf der Festplatte liegt diese index.js gerade?
//express.static ist eingebaute Middleware: macht Server zu Dateiverwalter: "Bevor du nach einer API-Route suchst, schau erst mal in diesem Ordner nach. Wenn der User index.html oder style.css verlangt und die Datei dort liegt: Schick sie ihm einfach direkt!""
//--> Ohne diese Zeile würde  Server zwar die Daten (/api/tasks) liefern, aber man hätte keine Webseite, auf der man diese Daten sehen kann.
app.use(express.static(path.join(__dirname, '../frontend/dist')));
///////////////////////////
// CRUD operations
///////////////////////////

app.get("/api/counter", (req, res) => {
    res.status(200).json({"taskIdCounter": taskIdCounter});
});

app.get("/api/tags", (req, res) => {
    res.status(200).json(tags);
});

app.get("/api/columns", (req, res) => {
    res.status(200).json(columns);
});

app.post("/api/tasks", (req, res) => {
    let {column, title, text, taskTags} = req.body;

    let newId = "t" + taskIdCounter;
    let newTask = {
        id: newId,
        title: title,
        text: text,
        tags: taskTags
    };

    const targetColumn = columns.find(c => c.id === column);

    if (targetColumn) {
        targetColumn.tasks.push(newTask);
        taskIdCounter++;

        res.status(201).json({"id": newId});
    }

    return res.status(404).json({error: "Spalte nicht gefunden!"});
});

app.put("/api/tasks/:id", (req, res) => {

    const id = req.params.id; //funtkioniert wegen "/api/tasks/:id"
    let {title, text, taskTags} = req.body;

    //nun müssen wir richtige Task finden
    let foundTask = null;
    columns.forEach((col) => {
        let task = col.tasks.find(e => e.id === id);
        if (task) {
            foundTask = task;
        }
    });

    if (foundTask) {
        foundTask.title = title;
        foundTask.text = text;
        foundTask.tags = taskTags;
        return res.status(200).send("Task aktualisiert");
    }

    return res.status(404).json({error: "Task nicht gefunden!"});
});

app.delete("/api/tasks/:id", (req, res) => {

    const id = req.params.id; //funtkioniert wegen "/api/tasks/:id"
    let deleted = false;

    columns.forEach(col => {
        const index = col.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            col.tasks.splice(index, 1);
            deleted = true;
        }
    });

    if (deleted) {
        return res.status(200).send("Task gelöscht");
    }

    return res.status(404).json({error: "Task nicht gefunden!"});
});

app.put("/api/move-task/:id", (req, res) => {

    const id = req.params.id; //funtkioniert wegen "/api/tasks/:id"
    const { newColumnId } = req.body;
    
    let taskToMove = null;

    columns.forEach(col => {
        const index = col.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            taskToMove = col.tasks.splice(index, 1)[0];
        }
    });

    const targetColumn = columns.find(c => c.id === newColumnId);

    if (taskToMove && targetColumn) {
        targetColumn.tasks.push(taskToMove);
        return res.status(200).send("Task verschoben");
    }

    return res.status(404).json({error: "Task nicht gefunden!"});
});

//Server starten
app.listen(3000, () => {
    console.log('Kanban-Server läuft auf http://localhost:3000');
});