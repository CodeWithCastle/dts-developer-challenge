import { useState, useEffect, useContext } from "react";
import { TaskContext } from './../contexts/TaskProvider';

const TaskSideview = ({ modalType, onClose, onSave, onEdit, onDelete, taskId }) => {
    const { getTask } = useContext(TaskContext);
    const [isDirty, setIsDirty] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        status: 'todo'
    });

    const formatDateForInput = (isoStr) => isoStr ? isoStr.split('T')[0] : '';

    useEffect(() => {
        // Define the async function inside
        const fetchTask = async () => {
            if (taskId) {
                const task = await getTask(taskId);
                if (task) {
                    setFormData({
                        id: task.id,
                        title: task.title || '',
                        description: task.description || '',
                        due_date: formatDateForInput(task.due_date),
                        status: task.status || 'todo'
                    });
                }
            } else {
                // Reset for "New Task" mode
                setFormData({ title: '', description: '', due_date: '', status: 'todo' });
            }
            setIsDirty(false); // Reset dirty state when a new task loads
        };

        fetchTask();
    }, [taskId, modalType, getTask]); // Added getTask as a dependency

    if (!modalType) return null;

    const displayDate = formData?.due_date 
        ? new Date(formData.due_date).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
        })
        : 'No date set';

        const handleChange = (e) => {
            const { name, value } = e.target;
            setIsDirty(true); // Mark as dirty when user types
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleCancel = () => {
            if (isDirty && !window.confirm("Discard unsaved changes?")) return;
            setFormData({
                title: '',
                description: '',
                due_date: '',
                status: 'todo'
            });
            onClose();
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <section className="task-sideview-container">
            <div className="task-sideview-fill" onClick={handleCancel} title='tap anywhere to close'></div>

            <div className="sideview-content">
                <div className="sideview-header flex-row">
                    <div></div>
                    <h3 className="title">
                        {modalType === 'form' ? (taskId ? 'Edit Task' : 'New Task') : 'Task Details'}
                    </h3>
                </div>

                <div className="sideview-body">
                    {/* --- Form View --- */}
                    <div className={`task-form-container ${modalType === 'form' ? 'show' : ''}`}>
                        <form className="gh-form" onSubmit={handleSubmit}>
                            <div className="gh-form-group">
                                <label>Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="gh-form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
                            </div>
                            <div className="gh-flex-row">
                                <div className="gh-form-group flex-1">
                                    <label>Due Date</label>
                                    <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} />
                                </div>
                                <div className="gh-form-group flex-1">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange}>
                                        <option value="todo">Todo</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="overdue">Overdue</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>
                            <div className="gh-form-actions">
                                <button type="button" className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Task</button>
                            </div>
                        </form>
                    </div>

                    {/* --- Profile View --- */}
                    <div className={`task-profile-container ${modalType === 'profile' ? 'show' : ''}`}>
                        {formData ? (
                            <div className="gh-view">
                                <div className="gh-view-header">
                                    <div className="gh-view-title-row">
                                        <h1 className="gh-view-title">{formData.title}</h1>
                                        <span className="gh-view-id">#{formData.id}</span>
                                    </div>
                                    <div className="gh-view-meta">
                                        <span className={`gh-badge ${formData.status}`}>{formData.status}</span>
                                        <span className="gh-meta-text">Due on <strong>{displayDate}</strong></span>
                                    </div>
                                </div>
                                <div className="gh-view-body">
                                    <h4 className="gh-section-label">Description</h4>
                                    <div className="gh-description-box">{formData.description || <i>No description.</i>}</div>
                                </div>
                                <div className="gh-view-footer">
                                    <button type="button" className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
                                    {formData.status !== 'done' && <button className="btn btn-outline" onClick={() => onEdit(formData.id)}>Edit Task</button>}
                                    <button className="btn btn-danger" onClick={() => onDelete(formData.id)}>Delete</button>
                                </div>
                            </div>
                        ) : (
                            <div className="gh-empty-pane">Select a task to view details</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TaskSideview;