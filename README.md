A Node.js/Express application that manages tasks using a MySQL database (via Sequelize). It also supports **webhooks** that notify external endpoints when tasks are created or updated.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Running the App](#running-the-app)
5. [API Endpoints](#api-endpoints)
6. [Testing with cURL](#testing-with-curl)
   - [Basic GET Request](#1-basic-get-request)
   - [GET a Specific Resource](#2-get-a-specific-resource)
   - [POST (Create) with JSON Body](#3-post-create-with-json-body)
   - [PUT (Update) a Resource](#4-put-update-a-resource)
   - [DELETE a Resource](#5-delete-a-resource)
   - [Debugging Tips](#6-debugging-tips)
7. [Webhook Example](#webhook-example)

---

## Overview

This app provides a **Task Manager** API with CRUD endpoints:

- **Create** a task  
- **Read** (all tasks or by ID)  
- **Update** a task  
- **Delete** a task  

It also includes a **webhook** feature. You can **subscribe** an external URL to be notified when tasks are created/updated.

---

## Installation

1. **Clone** this repo or copy the code to your local machine.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up MySQL** on your server (A2 Hosting or local). Make sure you have a database for this project.

---

## Environment Variables

Create a `.env` file in the project root (or set variables in cPanel). For example:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_NAME=<your_db_name>

APP_PORT=3000
```

---

## Running the App

1. **Run locally**:
   ```bash
   node app.js
   ```
   or
   ```bash
   npm start
   ```
2. **On A2 Hosting**, ensure the `.htaccess` passenger config is set correctly, then **restart** your Node.js app in cPanel.

---

## API Endpoints

- **`GET /tasks`** – Retrieve all tasks.
- **`GET /tasks/:id`** – Retrieve a single task by ID.
- **`POST /tasks`** – Create a new task.
- **`PUT /tasks/:id`** – Update a task by ID.
- **`DELETE /tasks/:id`** – Delete a task by ID.
- **`GET /webhooks`** – List all webhook subscriptions.
- **`POST /webhooks`** – Subscribe to a webhook event (`task.created` or `task.updated`).
- **`DELETE /webhooks/:id`** – Remove a webhook subscription.

---

## Testing with cURL

You can **verify routes** without a GUI tool by running **cURL** commands in a terminal or SSH session.

### 1. Basic GET Request

Assume you have a route like **`GET https://cuureo.com/tasks`**:

```bash
curl -i https://cuureo.com/tasks
```

- **`-i`** shows the response headers plus the body.
- You should see something like:
  ```
  HTTP/1.1 200 OK
  Content-Type: application/json; charset=utf-8
  ...
  [ { "id": 1, "title": "Some Task", ... }, ... ]
  ```
- If your route responds with JSON, you’ll see the returned data in the terminal.

### 2. GET a Specific Resource

For something like **`GET https://cuureo.com/tasks/1`**:

```bash
curl -i https://cuureo.com/tasks/1
```

- This tests retrieving a single resource with **ID = 1**.
- If the item doesn’t exist, you might get a **404 Not Found**.

### 3. POST (Create) with JSON Body

To **create** a new resource (e.g., create a new task), you often send a **JSON** body. Example:

```bash
curl -i -X POST https://cuureo.com/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"New Task from cURL2","description":"Testing POST","status":"new"}'
```

**Explanation**:

- **`-X POST`** sets the HTTP method to **POST**.
- **`-H "Content-Type: application/json"`** indicates you’re sending JSON.
- **`-d '{...}'`** is the JSON data you’re posting.

If successful, you might see a **201 Created** response, plus the JSON of the newly created resource.

### 4. PUT (Update) a Resource

To **update** a task with **ID = 2**, for example:

```bash
curl -i -X PUT https://cuureo.com/tasks/2 \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated Task Title","status":"in-progress"}'
```

- This sends new data to **`/tasks/2`**.
- Expect a **200 OK** if the update succeeds (or **404 Not Found** if the task doesn’t exist).

### 5. DELETE a Resource

To **delete** a task by ID, e.g., **ID = 3**:

```bash
curl -i -X DELETE https://cuureo.com/tasks/3
```

- If it’s deleted, you might see:
  ```
  HTTP/1.1 200 OK
  { "message": "Task deleted" }
  ```

### 6. Debugging Tips

1. **Check Response Codes**  
   - **200 OK** or **201 Created** means success.  
   - **404 Not Found** could mean the resource or route doesn’t exist.  
   - **500 Internal Server Error** indicates a server-side issue or unhandled exception.

2. **Add `-v` for Verbose Mode**  
   ```bash
   curl -v https://cuureo.com/tasks
   ```
   Shows request/response headers and can help debug SSL or redirect issues.

3. **JSON Validation**  
   - If your API expects JSON, always include `-H "Content-Type: application/json"` when sending a body.  
   - Malformed JSON can result in a **400 Bad Request** or **500 Internal Server Error**, depending on your server code.

4. **Check Server Logs**  
   - If you get unexpected responses, see if cPanel or Passenger logs show any error messages.

**In Summary**  
Use **cURL** commands in your terminal or SSH session to hit each endpoint at your live domain. Confirm status codes and responses match what you expect. This is a quick way to verify your existing routes are set up correctly without needing a GUI tool like Postman. Once you see the expected responses (e.g., JSON output, success messages), you’ll know your Node.js/Express routes are functioning correctly in production.

---

## Webhook Example

To **subscribe** a webhook that listens for `task.created` events, you can run:

```bash
curl -X POST https://cuureo.com/webhooks \
     -H "Content-Type: application/json" \
     -d '{"url":"https://webhook.site/4d5e143c-a50a-4f0d-8d8e-73c943a2a430","eventType":"task.created"}'
```

- This registers a new webhook for **`task.created`**.
- The `url` (`https://webhook.site/...`) is where your system will send a **POST** request whenever a new task is created.
- When you **create** a task (via `POST /tasks`), your app will **POST** a payload like:
  ```json
  {
    "event": "task.created",
    "data": {
      "id": 123,
      "title": "New Task",
      "status": "new",
      ...
    }
  }
  ```
  to the specified `url`.

---
