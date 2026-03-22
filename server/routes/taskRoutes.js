const express = require('express');
const router = express.Router();
const taskService = require('../services/taskServices');


// GET ALL TASKS
router.get('/', async (req, res) => {
    try {
        const tasks = await taskService.getTasks();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// GET TASK BY ID
router.get('/:id', async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Error retrieving task" });
    }
});

// POST (add task to database)
router.post('/', async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: "Could not create task" });
    }
});

// BULK UPDATE STATUS
router.put('/bulk', async (req, res) => {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "No task IDs provided." });
    }

    try {
        await taskService.bulkUpdateTasks(ids, status);
        
        res.status(200).json({ 
            message: `Successfully updated ${ids.length} tasks to ${status}.` 
        });
    } catch (err) {
        console.error("Bulk update error:", err);
        res.status(500).json({ error: "Failed to perform bulk update." });
    }
});

// PUT (update task details, by ID)
router.put('/:id', async (req, res) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

// PUT (update task details, by ID)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const task = await taskService.updateTaskStatus(req.params.id, status);
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: "Status update failed" });
    }
});

// BULK DELETE
router.post('/bulk-delete', async (req, res) => {
    const { ids } = req.body;
    try {
        await taskService.bulkDeleteTasks(ids); 
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Bulk delete failed" });
    }
});

// SINGLE DELETE
router.delete('/:id', async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});


module.exports = router;