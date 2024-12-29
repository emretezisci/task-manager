const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Webhook = sequelize.define('Webhook', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // e.g. "task.created", "task.updated"
  eventType: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Webhook;
