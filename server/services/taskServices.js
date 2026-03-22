const { query } = require('../db');


// CREATE TASK
const createTask = async ({ title, description, due_date, status }) => {
    const { rows } = await query(
        `INSERT 
        INTO tasks (title, description, due_date, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, 
        [title, description, due_date, status || 'todo']
    );
    return rows[0];
}

// READ (one)
const getTaskById = async (id) => {
    const  { rows } = await query(
        `SELECT * 
        FROM tasks 
        WHERE id = $1`,
        [id]
    );
    return rows[0];
}

// READ (all)
const getTasks = async () => {
    const  { rows } = await query(
        `SELECT * 
        FROM tasks 
        ORDER BY created_at DESC, title ASC`
    );
    return rows;
}

// UPDATE (full)
const updateTask = async (id, { title, description, due_date, status }) => {
    const  { rows } = await query(
        `UPDATE tasks
        SET title = $2, description = $3, due_date = $4, status = $5
        WHERE id = $1
        RETURNING *`,
        [id, title, description, due_date, status]
    );
    return rows[0];
}


// UPDATE (status)
const updateTaskStatus = async (id, status) => {
    const  { rows } = await query(
        `UPDATE tasks
        SET status = $2
        WHERE id = $1
        RETURNING *`,
        [id, status]
    );
    return rows[0];
}

// DELETE
const deleteTask = async (id) => {
    await query(
        `DELETE 
        FROM tasks 
        WHERE id = $1`,
        [id]
    );
    return true;
}


// 
const bulkUpdateTasks = async (ids, status = 'done') => {
    if (!ids || ids.length === 0) return [];

    const { rows } = await query(
        `UPDATE tasks
         SET status = $2
         WHERE id = ANY($1)
         RETURNING *`,
        [ids, status]
    );
    return rows;
};


// 
const bulkDeleteTasks = async (ids) => {
    if (!ids || ids.length === 0) {
        console.warn("Bulk delete called with no IDs.");
        return { rowCount: 0 };
    }

    try {
        const result = await query(
            `DELETE FROM tasks 
             WHERE id = ANY($1) 
             RETURNING id`, 
            [ids]
        );

        console.log(`🗑️ Successfully deleted ${result.rowCount} tasks from the database.`);
        return result.rows; 
    } catch (err) {
        console.error('❌ Bulk delete operation failed:', err);
        throw err; 
    }
};



module.exports = {
    createTask,
    getTaskById,
    getTasks,
    updateTask,
    updateTaskStatus,
    deleteTask,
    bulkUpdateTasks,
    bulkDeleteTasks
}