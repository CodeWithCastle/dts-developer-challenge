README.md tailored for a React (Standard) + Node/Express + PostgreSQL stack.
README.md was written by me (optimised using AI)

---

# 🏛️ HMCTS Task Management System

A simple full-stack task management application designed for administrative workflows. This project features a **React** frontend, a **Node/Express** REST API, and a **PostgreSQL** database, optimized for **bulk operations, performance, and data consistency**.

---

## 📖 Overview

This README provides a professional, comprehensive overview for developers and HMCTS stakeholders. It covers:

* Full-stack architecture
* Performance and scalability
* Setup and environment configuration
* Development approach and engineering decisions
* Future improvements and contributing guidelines

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

## 🚀 Getting Started

### 1. Prerequisites

Ensure the following are installed:

* [Node.js](https://nodejs.org/) (v16+)
* [PostgreSQL](https://www.postgresql.org/) (running on port 5432)

---

### 2. Clone the Repository

```bash
git clone https://github.com/CodeWithCastle/dts-developer-challenge.git
cd dts-developer-challenge
```

---

### 3a. macOS Setup (Homebrew)

1. Install Homebrew (if not installed):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

2. Install Node.js:

```bash
brew install node
node -v
npm -v
```

3. Install PostgreSQL:

```bash
brew install postgresql
brew services start postgresql
psql --version
```

### 3b. Windows Setup

1. Install Node.js

  - Go to [Node.js official website](https://nodejs.org/en/download/)  
  - Download the **LTS version installer** and run it.  
  - Ensure **“Add to PATH”** is checked during installation.  
  - Verify installation in **Command Prompt / PowerShell**:

```powershell
node -v
npm -v
```

2. Install PostgreSQL

Download the installer from PostgreSQL Windows download page
Run the installer:
Use default port 5432
Optional: Install pgAdmin for GUI management
Verify installation:

```powershell
psql -U postgres -h localhost
```

### 3c. Linux Setup (Ubuntu/Debian)

1. Update packages

```bash
sudo apt update
sudo apt upgrade -y
```

2. Install Node.js and npm

```bash
sudo apt install -y nodejs npm
node -v
npm -v
```

3. Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
psql --version
```

---

### 4. Create the database user

***macOS / Linux***

```bash
# Create the superuser
sudo -u postgres createuser -s hmcts_db_user
```

Notes:
* `-s` → makes hmcts_db_user a superuser
* No password is set in this method; the user will connect via the system user or default postgres authentication


***Windows***
Option 1 – Connect directly as the user (if allowed by authentication method):
Open Command Prompt / PowerShell and run:
```powershell
psql -U hmcts_db_user -h localhost
```

Option 2 – Create user and database inside psql:
```sql
-- Open psql as the default postgres user:
-- psql -U postgres -h localhost

CREATE USER hmcts_db_user;
CREATE DATABASE hmcts_tasks_db;
GRANT ALL PRIVILEGES ON DATABASE hmcts_tasks_db TO hmcts_db_user;
\q
```

Notes:
* The Windows method also creates a superuser without a password, suitable for local development.
* You can later set a password with `ALTER USER` if needed for remote connections.

---

### 5. Set Environment Variables

***macOS***

1. /server/.env:
```env
cat <<EOF > .env
NODE_ENV=development
PORT=8080
DB_HOST=localhost
DB_USER=hmcts_db_user
DB_PASSWORD=
DB_NAME=hmcts_tasks_db
DB_PORT=5432
SCHEMA_VERSION=1.0.0
EOF
```

2. /client/.env:
```env
cd ../client
cat <<EOF > .env
NODE_ENV=development
REACT_APP_API_BASE_URL=http://localhost:8080/api/tasks
APP_VERSION=1.0.0
EOF
```

***Windows / Linux***

```bash
cat <<EOF > .env
NODE_ENV=development
PORT=8080
DB_HOST=localhost
DB_USER=hmcts_db_user
DB_PASSWORD=
DB_NAME=hmcts_tasks_db
DB_PORT=5432
SCHEMA_VERSION=1.0.0
EOF
```


cd ../client
```bash
cat <<EOF > .env
NODE_ENV=development
REACT_APP_API_BASE_URL=http://localhost:8080/api/tasks
APP_VERSION=1.0.0
EOF
```

---

### 6. One-Command Installation (Dependencies & Environment)
Run the following command from the root directory (Install dependencies across all layers):

**Backend Setup:**

```bash
cd server
npm install
npm install cors dotenv pg nodemon express
```

**Frontend Setup:**

```bash
cd ../client
npm install
```

---

### 7. Running the Application

**Backend (Terminal 1):**

```bash
cd server
npm run dev
```

* Runs with **Nodemon**
* Automatically executes `db/init.js` to create tables and seed data

**Frontend (Terminal 2):**

```bash
cd client
npm start
```

---

## 🛠️ Development Approach

### Database Design

* Relational schema
* `schema_info` table tracks schema version to prevent duplicate seeding
* Automated sample data seeding for consistent dev/testing environments

### Service Layer Abstraction

* `taskService` abstracts API calls:

  * **Frontend:** Handles fetch/axios calls
  * **Backend:** Encapsulates business logic
* Promotes cleaner, maintainable code

### API Route Optimization

* Specific routes (`/bulk`) placed **before dynamic routes (`/:id`)** to prevent route shadowing

### Performance Engineering

* Eliminated **N+1 query problems**
* Bulk operations example:

```sql
UPDATE tasks SET status = 'done' WHERE id = ANY($1)
```

* React optimizations:

  * `useCallback` to memoize functions
  * `useMemo` to prevent unnecessary re-renders

### UX Enhancements

* Sideview component for task creation and inspection
* Dirty state tracking to warn before losing unsaved changes

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

## 📝 Scripts Reference

**Root / General**

* `npm install` — Install all dependencies

**Server**

* `npm run dev` — Start backend with Nodemon
* `npm run db:reset` — Drop and re-seed database (optional)

**Client**

* `npm start` — Run React development server

---

## 📌 Future Improvements

* Imoprove Front-end context, optimize TaskProvider and context usage
* Automated testing (unit + integration)
* Authentication and authorization
* Dockerized full stack
* CI/CD pipeline integration
* API documentation (Swagger/OpenAPI)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

This project is intended for **HMCTS application demonstration purposes**.

---

## 🎯 Summary

* Clean, full-stack architecture
* High-performance database interactions
* Thoughtful UX design
* Production-ready engineering practices

---

## 📂 Project Structure

```text
hmcts-task-manager/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # UI Components (TaskItem, TaskSideview, etc.)
│       ├── contexts/       # State Management (TaskProvider.js)
│       ├── services/       # API calling logic (taskService.js)
│       ├── App.jsx         # Main Layout Orchestrator
│       ├── App.css         # Global Styles & Theme
│       ├── .env            # Environment variables (REACT_APP_API_BASE_URL)
│       └── index.js        # Entry Point
├── server/                 # Node.js + Express Backend
│   ├── data/               # Seed and sample data
│   ├── controllers/        # Request handlers
│   ├── routes/             # API Endpoint definitions
│   ├── db/                 # SQL schema & initialization scripts
│   ├── services/           # Business logic & helpers
│   ├── app.js              # Express app setup
│   ├── .env                # Environment variables (DB_USER, DB_PASS)
│   └── index.js            # Server entry point
└── README.md               # Documentation
```
