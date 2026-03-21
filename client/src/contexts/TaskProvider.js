import React, { useState, useMemo, createContext, useEffect, useCallback } from "react";
import mockData from './../data/mock-tasks.json';

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

                // Simulate network delay if needed
                // ...

                setTasks(mockData);
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

    const addTask = useCallback((task) => {
        if (!task.title || !task.title?.trim()) {
            console.warn("Attempted to add a task without a title.");
            return; 
        }
        setTasks(prev => [
            { ...task, id: Date.now(), status: task.status || 'todo' }, ...prev
        ]);
    }, []);

    const deleteTask = useCallback((id) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    }, []);

    const updateTask = useCallback((id, updates) => {
        setTasks(prev => prev.map(task => {
            if (task.id === id) {
                return typeof updates === 'string' 
                    ? { ...task, status: updates } 
                    : { ...task, ...updates };
            }
            return task;
        }));
    }, []);

    const getTask = useCallback((id) => {
        return tasks.find(item => item.id === id);
    }, [tasks]);

    const updateList = useCallback((category) => setListCategory(category), []);
    const searchForTask = useCallback((query) => setSearchQuery(query), []);

    const bulkUpdateStatus = useCallback((ids) => {
        setTasks(prev => prev.map(task => 
            ids.includes(task.id) ? { ...task, status: 'done' } : task
        ));
    }, []);

    const bulkDeleteTasks = useCallback((ids) => {
        setTasks(prev => prev.filter(task => !ids.includes(task.id)));
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