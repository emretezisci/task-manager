const express = require('express');
const axios = require('axios');
const router = express.Router();
const Task = require('../models/Task');
const Webhook = require('../models/Webhook'); // to look up all relevant webhooks

// CREATE a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const newTask = await Task.create({ title, description, status, dueDate });

    // Fire "task.created" webhooks
    const webhooks = await Webhook.findAll({ where: { eventType: 'task.created' } });
    for (const hook of webhooks) {
      try {
        await axios.post(hook.url, {
          event: 'task.created',
          data: newTask
        });
      } catch (err) {
        console.error(`Webhook error [${hook.url}]:`, err.message);
      }
    }

    return res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// READ all tasks (GET)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// READ a single task by ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a task by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({ title, description, status, dueDate });

    // Fire "task.updated" webhooks
    const webhooks = await Webhook.findAll({ where: { eventType: 'task.updated' } });
    for (const hook of webhooks) {
      try {
        await axios.post(hook.url, {
          event: 'task.updated',
          data: task
        });
      } catch (err) {
        console.error(`Webhook error [${hook.url}]:`, err.message);
      }
    }

    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a task by ID (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    return res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
