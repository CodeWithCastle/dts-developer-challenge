const getEnvVariable = (key, defaultValue) => {
    const value = process.env[key];
    if (value === undefined) {
        console.warn(`Environment variable ${key} is not set. Using default: ${defaultValue}`);
        return defaultValue;
    }
    return value;
};

const getUrl = () => {
    const baseUrl = getEnvVariable('API_BASE_URL', 'http://localhost:8080');
    const endpoint = getEnvVariable('API_ENDPOINT_URL', '/api/tasks');
    return `${baseUrl}${endpoint}`;
};

const API_URL = getUrl();

console.log(`API_URL set to: ${API_URL} (based on NODE_ENV: ${getEnvVariable('NODE_ENV', 'development')})`);


const taskService = {
    // GET all tasks
    getAllTasks: async () => {
        // console.log('REACT_APP_API_URL:', API_URL);

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks from server');
        return await response.json();
    },

    // GET a single task
    getTaskById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Task not found');
        return await response.json();
    },

    // POST a new task
    createTask: async (taskData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Failed to create task');
        return await response.json();
    },

    // PUT (Full Update)
    updateTask: async (id, updates) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update task');
        return await response.json();
    },

    // PUT (Status Only)
    updateTaskStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update status');
        return await response.json();
    },

    // DELETE
    deleteTask: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return true;
    },

    // BULK UPDATE TASKS AS 'done'
    bulkUpdateStatus: async (ids, status) => {
        const payload = {
            ids: Array.isArray(ids) ? ids : ids.ids, 
            status
        };

        const response = await fetch(`${API_URL}/bulk`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Bulk update failed');
        return await response.json();
    },

    // BULK DELETE TASKS
    bulkDeleteTasks: async (ids) => {
        const response = await fetch(`${API_URL}/bulk-delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        });
        if (!response.ok) throw new Error('Bulk delete failed');
        return await response.json();
    },
};

export default taskService;