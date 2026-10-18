const columnsBase = require("../data/columns.json");
const Task = require("../models/Task.js");
const tags = require("../data/tags.json");

/**
 * Validates incoming task payloads before database mutation.
 * @param {Object} task - The task object from req.body
 * @returns {Array<string>} - List of validation error messages
 */
function validateTask(task) {
    const errors = [];

    if (!task.title || typeof task.title !== "string" || task.title.trim().length === 0) {
        errors.push("Title is necessary and cannot be empty. And I mean: for actually tracking and in the end doing a task, you need a title!");
    } else if (task.title.length > 50) {
        errors.push("Title cannot exceed 50 characters.");
    }

    const validColumnsIds = columnsBase.map(c => c.id);
    if (!task.columnId || typeof task.columnId !== "string" || !validColumnsIds.includes(task.columnId)) {
        errors.push("Invalid target column provided.");
    }

    if (task.tags && !Array.isArray(task.tags)) {
        errors.push("Tags must be provided as an array of strings.");
    }

    return errors;
}

/**
 * GET /api/tags
 * Returns predefined list of available task tags
 */
exports.getTags = async (req, res, next) => {
    try {
        res.status(200).json(tags);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/columns
 * Fetches all tasks from MongoDB and structures them inside column objects
 */
exports.getTasks = async (req, res, next) => {
    try {
        const allTasks = await Task.find();

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

/**
 * POST /api/tasks
 * Creates a new task in MongoDB after payload validation
 */
exports.createNewTask = async (req, res, next) => {
    try {
        const validationErrors = validateTask(req.body);

        if (validationErrors.length > 0) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Task validation failed",
                details: validationErrors
            });
        }

        const newTask = await Task.create({
                    title: req.body.title,
                    text: req.body.text,
                    columnId: req.body.columnId,
                    tags: req.body.tags || []
        });

        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/tasks/:id
 * Updates an existing task document by ID
 */
exports.updateTask = async (req, res, next) => {
    const { id } = req.params;

    try {
        const validationErrors = validateTask(req.body);

        if (validationErrors.length > 0) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Task validation failed",
                details: validationErrors
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                text: req.body.text,
                columnId: req.body.columnId,
                tags: req.body.tags || []
            },
            { new: true, runValidators: true } //returns updated document & triggers Schema checks
        );

        if (!updatedTask) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "Task not found"
            });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/move-task/:id
 * Updates only the columnId of a task
 */
exports.moveTask = async (req, res, next) => {
    const id = req.params.id;
    const { columnId } = req.body;

    try {
        const validColumnIds = columnsBase.map(c => c.id);
        if (!columnId || !validColumnIds.includes(columnId)) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Invalid target column provided."
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { columnId },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "Task not found"
            });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/tasks/:id
 * Deletes a task document by ID
 */
exports.deleteTask = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "Task not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Task deleted successfully",
            id
        });
    } catch (error) {
        next(error);
    }
};