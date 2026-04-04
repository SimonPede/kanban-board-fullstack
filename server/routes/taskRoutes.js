const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

//Definition der Endpunkte (Mapping)

//GET /api/tags
router.get('/tags', taskController.getTags);

//GET /api/columns
router.get('/columns', taskController.getTasks);

//POST /api/tasks
router.post('/tasks', taskController.createNewTask);

//PUT /api/tasks/:id (Inhalt bearbeiten)
router.put('/tasks/:id', taskController.updateTask);

//PUT /api/move-task/:id (Spalte wechseln)
router.put('/move-task/:id', taskController.moveTask);

//DELETE /api/tasks/:id
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;