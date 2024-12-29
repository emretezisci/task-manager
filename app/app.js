/**
 * app.js
 * 
 * Main entry point for the Node.js application (Task Manager + Webhooks + OpenAPI).
 * This file sets up the Express app, initializes the DB with Sequelize,
 * configures EJS for views, loads OpenAPI docs, and more.
 */

// Load environment variables from a .env file (if present)
require('dotenv').config();

// Import core modules and your local modules
const express = require('express');
const sequelize = require('./config/database');  // Sequelize instance/config
const Task = require('./models/Task');           // To fetch tasks in the home route
const taskRoutes = require('./routes/tasks');    // Task CRUD routes

// Create the Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// ***** EJS Setup *****
// Set the view engine to 'ejs' so Express looks for .ejs files in /views folder
app.set('view engine', 'ejs');

// (Optional) If you want a custom views folder name, uncomment and adjust:
// app.set('views', './yourCustomViewsFolder');

// Mount the /tasks router (CRUD endpoints for tasks)
app.use('/tasks', taskRoutes);

// Home route: fetch tasks from DB and render them in "index.ejs"
app.get('/', async (req, res) => {
  try {
    // Grab all tasks from the DB using the Task model
    const tasks = await Task.findAll();
    // Render "index.ejs" template and pass the tasks
    res.render('index', { tasks });
  } catch (error) {
    console.error(error);
    // Return a 500 status if an error occurs
    res.status(500).send('Error fetching tasks');
  }
});

// Sync database: creates tables if they do not exist
// force: false -> won't drop tables every restart
sequelize
  .sync({ force: false })
  .then(() => console.log('Database synced successfully'))
  .catch((err) => console.error('Failed to sync DB:', err));

// Choose a port (from .env or fallback to 3000)
// Passenger often ignores manual port in production but it's harmless to keep
const PORT = process.env.APP_PORT || 3000;

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * Serve the OpenAPI spec from a YAML file
 */
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');

// Read the YAML file containing the OpenAPI spec
const openapiPath = path.join(__dirname, 'openapi.yaml');
const fileContents = fs.readFileSync(openapiPath, 'utf8');
const openapiDoc = YAML.parse(fileContents);

// Serve the Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

/**
 * Webhooks
 * These routes handle registering, listing, and deleting webhooks.
 * When tasks are created/updated, these webhooks can be triggered.
 */
const webhookRoutes = require('./routes/webhooks');
app.use('/webhooks', webhookRoutes);

// Export the Express 'app' object for Passenger or testing
module.exports = app;
