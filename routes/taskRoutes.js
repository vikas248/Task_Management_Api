const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');

// Middleware to authenticate JWT for protected routes
router.use(authenticateJWT);


// Get all tasks (only for admins)
router.get('/getAll', authorizeRole('listTasks'), async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a task
router.post('/create', authorizeRole('addTask'), async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a task
router.patch('/update/:id',  authorizeRole('updateTask'),getTask, async (req, res) => {
  if (req.body.title != null) {
    res.task.title = req.body.title;
  }
  if (req.body.description != null) {
    res.task.description = req.body.description;
  }
  if (req.body.completed != null) {
    res.task.completed = req.body.completed;
  }
  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete a Task
router.delete('/delete/:id', authorizeRole('deleteTask'), getTask, async (req, res) => {
  try {
    const taskToDelete = await Task.findById(req.params.id);
    if (!taskToDelete) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await Task.findByIdAndDelete(req.params.id); // Delete the task directly
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single task
router.get('/:id', (req, res) => {
  res.json(res.task);
});

async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.task = task;
  next();
}

module.exports = router;
