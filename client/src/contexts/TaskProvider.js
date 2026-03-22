import React, { useState, useMemo, createContext, useEffect, useCallback } from "react";
import mockData from './../data/mock-tasks.json';
import taskService from '../services/TaskService';

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [listCategory, setListCategory] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial Data Load
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);

                // USE WITH NO BACKEND
                // setTasks(mockData);

                // USE WITH BACKEND
                const data = await taskService.getAllTasks() || mockData;
                setTasks(data);
            } catch (err) {
                setError("Failed to load tasks.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // --- Actions ---

    const addTask = useCallback(async (task) => {
        if (!task.title || !task.title?.trim()) {
            console.warn("Attempted to add a task without a title.");
            return; 
        }

        if(task.due_date === '') task.due_date = null;

        try {
            const newTaskFromDB = await taskService.createTask(task);
            setTasks(prev => [newTaskFromDB, ...prev]);
        } catch (err) {
            console.error("Failed to add task to database:", err);
            // Optional: Trigger a UI notification here
        }
    }, []);

    const deleteTask = useCallback(async (id) => {
        try {
            await taskService.deleteTask(id);
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            console.error("Failed to delete task from database:", err);
            // setError("Could not delete task. Please try again.");
        }
    }, []);

    const updateTask = useCallback(async (id, updates) => {
        if(updates?.due_date === '') updates.due_date = null;

        try {
            const updatedTask = typeof updates === 'string' 
                ? await taskService.updateTaskStatus(id, updates)
                : await taskService.updateTask(id, updates);

            setTasks(prev => prev.map(task => (task.id === id ? updatedTask : task)));
        } catch (err) {
            console.error("Update failed in Database:", err);
        }
    }, []);

    const getTask = useCallback(async (id) => {
        const localTask = tasks.find(item => item.id === parseInt(id));
        if (localTask) return localTask;

        try {
            return await taskService.getTaskById(id);
        } catch (err) {
            console.error("Task not found in DB:", err);
            return null;
        }
    }, [tasks]);

    const updateList = useCallback((category) => setListCategory(category), []);
    const searchForTask = useCallback((query) => setSearchQuery(query), []);

    const bulkUpdateStatus = useCallback(async (ids) => {
        try {
            await taskService.bulkUpdateStatus(ids, 'done');

            setTasks(prev => prev.map(task => 
                ids.includes(task.id) ? { ...task, status: 'done' } : task
            ));
        } catch (err) {
            console.error("Bulk update failed:", err);
        }
    }, []);

    const bulkDeleteTasks = useCallback(async (ids) => {
        try {
            await taskService.bulkDeleteTasks(ids); // Call the server!
            setTasks(prev => prev.filter(task => !ids.includes(task.id)));
        } catch (err) {
            console.error("Bulk delete failed:", err);
        }
    }, []);

    // --- Derived State ---

    const taskSummary = useMemo(() => {
        const stats = tasks.reduce((acc, task) => {
            acc.total++;
            acc[task.status] = (acc[task.status] || 0) + 1;
            if (task.status !== 'done') acc.ongoing++;
            return acc;
        }, { total: 0, ongoing: 0, todo: 0, 'in-progress': 0, overdue: 0, done: 0 });

        const rate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
        return { ...stats, completionRate: `${rate}%` };
    }, [tasks]);

    const filtered_tasks = useMemo(() => {
        const query = (searchQuery || "").toLowerCase();
        
        return tasks.filter(task => {
            const matchesCategory = listCategory === 'active' 
                ? task.status !== 'done' 
                : task.status === listCategory;
            
            const title = (task.title || "").toLowerCase();
            const description = (task.description || "").toLowerCase();

            return matchesCategory && (title.includes(query) || description.includes(query));
        });
    }, [tasks, listCategory, searchQuery]);

    const actions = useMemo(() => ({
        addTask,
        deleteTask,
        updateTask,
        updateList,
        getTask,
        searchForTask,
        bulkUpdateStatus,
        bulkDeleteTasks
    }), [addTask, deleteTask, updateTask, updateList, getTask, searchForTask, bulkUpdateStatus, bulkDeleteTasks]);


    // Final Context Value
    const contextValue = useMemo(() => ({
        filtered_tasks,
        listCategory,
        loading,
        error,
        taskSummary,
        searchQuery,
        ...actions
    }), [
        loading, error,
        listCategory, taskSummary, searchQuery, filtered_tasks,
        actions
    ]);

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;