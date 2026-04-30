README.md tailored for a React (Standard) + Node/Express + PostgreSQL stack.
README.md was written by me (optimised using AI)

---

# 🏛️ HMCTS Task Management System

A simple full-stack task management application designed for administrative workflows. This project features a **React** frontend, a **Node/Express** REST API, and a **PostgreSQL** database, optimized for **bulk operations, performance, and data consistency**.

---

## 📖 Overview

This README provides a professional, comprehensive overview for developers and HMCTS stakeholders. It covers:

* [Setup and configuration](#getting-started)
* [] (Application architecture)
* [] (Features)
* [] (Key engineering decisions)
* [] (Project structure)
* [] (Container Visualizations)

---

## 🚀 Getting Started

### Prerequisites
Ensure the following are installed on your device:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

### Installation & Setup
#### 1. Clone the Repository

```bash
git clone https://github.com/CodeWithCastle/dts-developer-challenge.git
cd dts-developer-challenge
```

#### 2. Spin up the environment:
Run the following command in the root directory. This will build the images and start all services (database, server, and client).

```bash
docker-compose up --build
```

#### 3. Access the application:

Frontend: [http://localhost:3000] (http://localhost:3000)
Backend API: [http://localhost:8000/api/tasks] (http://localhost:8000/api/tasks) (or your designated port)

---

### 🛠 Development Commands

| Task            | Command                                                |
| --------------- | ------------------------------------------------------ |
| Start Services  | `docker-compose up`                                    |
| Stop Services   | `docker-compose down`                                  |
| Rebuild Images  | `docker-compose up --build`                            |
| View Logs       | `docker-compose logs -f`                               |
| Remove Volumes  | `docker-compose down -v` (useful for resetting the DB) |

---

## 🏗️ Technical Architecture

### Frontend

* **Framework:** React
* **State Management:** Context API
* **Performance Hooks:** `useCallback`, `useState`, `useEffect`, `useMemo`, `useContext`
* **Design Pattern:** Service abstraction via `taskService`

### Backend

* **Runtime:** Node.js
* **Framework:** Express
* **Architecture:** RESTful API with structured route hierarchy
* **Key Consideration:** Route ordering to prevent parameter shadowing (`/bulk` vs `/:id`)

### Database

* **System:** PostgreSQL
* **Design:** Relational schema
* **Optimization:** Bulk queries using `ANY()` operator

---

## 🌟 Key Features

### Core Functionality

* **Full CRUD Lifecycle:** Create, Read, Update, and Delete tasks with real-time database synchronization.
* **Dynamic Filtering:** Instant search with category views (Todo, In-Progress, Done, Overdue).
* **Smart Sideview UI:** GitHub-inspired drawer for both task creation and detailed inspection.
* **Dirty State Protection:** Prevents accidental loss of unsaved changes.

### Performance & Scalability

* **Bulk Operations:** High-performance batch updates and deletes using PostgreSQL `ANY()`.
* **Optimized Rendering:** React performance tuning using `useCallback`, `useContext`, and `useMemo`.
* **N+1 Query Elimination:** Replaced inefficient loops with single SQL statements.

### Data Integrity

* **Schema Versioning:** Controlled database initialization using a `schema_info` table.
* **Automated Seeding:** Ensures consistent environments across development and deployment.
* **Sample Seeding:** Provides initial data for testing and QA.

---

## 🧠 Key Engineering Decisions

| Area     | Decision               | Impact                         |
| -------- | ---------------------- | ------------------------------ |
| Database | Use of `ANY()`         | Efficient bulk operations      |
| Frontend | Hooks + memoization    | Improved rendering performance |
| Backend  | Service layer pattern  | Better separation of concerns  |
| Routing  | Ordered endpoints      | Prevents shadowing bugs        |
| Seeding  | Schema version control | Reliable dev environments      |

---

## 🎯 Summary

* Clean, full-stack architecture
* High-performance database interactions
* Thoughtful UX design
* Production-ready engineering practices

---

## 📂 Project File Structure

```text
hmcts-task-manager/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   └── src/
│   │   ├── components/     # UI Components (TaskItem, TaskSideview, etc.)
│   │   ├── contexts/       # State Management (TaskProvider.js)
│   │   ├── services/       # API calling logic (taskService.js)
│   │   ├── App.jsx         # Main Layout Orchestrator
│   │   ├── App.css         # Global Styles & Theme
│   │   ├── .env            # Environment variables (REACT_APP_API_BASE_URL)
│   │   └── index.js        # Entry Point
│   ├── .dockerignore       #
│   └── Dockerfile          # Frontend container definition
│   
├── server/                 # Node.js + Express Backend
│   ├── data/               # Seed and sample data
│   ├── controllers/        # Request handlers
│   ├── routes/             # API Endpoint definitions
│   ├── db/                 # SQL schema & initialization scripts
│   ├── services/           # Business logic & helpers
│   ├── app.js              # Express app setup
│   ├── .env                # Environment variables (DB_USER, DB_PASS)
│   ├── .dockerignore       #
│   ├── Dockerfile          # Backend container definition
│   └── index.js            # Server entry point
│
├── .gitignore              # 
├── docker-compose.yml      # Orchestrates all containers
└── README.md               # Documentation
```

---

## Visualizations

```text
             USER / BROWSER
                  |
                  | (localhost:3000)
                  ▼
+----------------------------------------+
|        DOCKER COMPOSE NETWORK          |
+----------------------------------------+
|                                        |
|   +----------+           +---------+   |
|   |          |           |         |   |
|   |  CLIENT  | --------> | SERVER  |   |
|   |  (React) |   (API)   | (Node)  |   |
|   |          | --------> |         |   |
|   +----------+           +---------+   |
|                              |         |
|                              |         |
|                              ▼         |
|                       +------------+   |
|                       |            |   |
|                       |  DATABASE  |   |
|                       | (Postgres) |   |
|                       |            |   |
|                       +------------+   |
|                                        |
+-----------------------------|----------+
                              |
                              |
                              ▼
                      +------------------+
                      |  DOCKER VOLUME   |
                      |    (db-data)     |
                      +------------------+
```