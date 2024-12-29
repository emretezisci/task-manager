const express = require('express');
const axios = require('axios');
const router = express.Router();
const Webhook = require('../models/Webhook');

// GET all webhooks
router.get('/', async (req, res) => {
  try {
    const webhooks = await Webhook.findAll();
    return res.json(webhooks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST a new webhook
router.post('/', async (req, res) => {
  try {
    const { url, eventType } = req.body;
    const newWebhook = await Webhook.create({ url, eventType });
    return res.status(201).json(newWebhook);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a webhook by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const webhook = await Webhook.findByPk(id);
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    await webhook.destroy();
    return res.json({ message: 'Webhook deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
