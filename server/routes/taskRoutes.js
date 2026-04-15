const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get("/tags", taskController.getTags);

router.get("/columns", taskController.getTasks);

router.post("/tasks", taskController.createNewTask);

router.put("/tasks/:id", taskController.updateTask);

router.put("/move-task/:id", taskController.moveTask);

router.delete("/tasks/:id", taskController.deleteTask);

module.exports = router;