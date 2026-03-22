import React, { useMemo, useState, useContext } from 'react'; // Added useMemo import
import TaskItem from './TaskItem';
import { TaskContext } from '../contexts/TaskProvider';


const TaskDashboard = ({
    tasks, 
    category, 
    selectedTasks, 
    onCompleteMarked, 
    onDeleteMarked, 
    onCheckTask, 
    onViewTask, 
    onUpdateTask,
}) => {

    const {filtered_tasks} = useContext(TaskContext);

    const [menuData, setMenuData] = useState({ visible: false, x: 0, y: 0 });
    const handleContextMenu = (e, id) => {
        e.preventDefault();

        // const x = e.clientX;
        // const y = e.clientY;

        setMenuData({
            visible: true,
            x: e.clientX,
            y: e.clientY
        });
    };

    // Memoize the selection state for performance
    const selectedCount = selectedTasks.length;
    const isMultiSelected = useMemo(() => selectedCount > 0, [selectedCount]);

    // 
    const ItemMenu = () => {
        return (
            <div className={`itemMenu-container ${menuData.visible? 'show':''}`}></div>
        )
    };

    return (
        <>
            <div className='task-dashboard-head subtitle flex-row sticky' style={{top:'208px'}}>
                <div className='task-dashboard-head-left flex-row'>
                    <div className='pill task-dashboard-head-icon'></div>
                    <span className="category-label">{category}</span>
                    {/* Senior Touch: Show how many are currently filtered */}
                    <span className="task-count-badge">{filtered_tasks.length}</span>
                </div>
                
                <div className='task-dashboard-head-right'>
                    <div className={`multi-select-action flex-row ${isMultiSelected ? 'show' : ''}`}>
                        {/* Show count in the bulk action bar */}
                        {/* <span className="selection-count">{selectedCount}</span> */}
                        
                        <button 
                            className='multi-select-done-control pill' 
                            onClick={onCompleteMarked}
                        >
                            Mark Done
                        </button>
                        <button 
                            className='multi-select-delete-control pill' 
                            onClick={onDeleteMarked}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <div className='task-dashboard-body'>
                {filtered_tasks.length > 0 ? (
                    filtered_tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            // Check if this specific task is in the selected list
                            isSelected={selectedTasks.includes(task.id)}
                            
                            // Passing functions directly
                            onCheck={onCheckTask}
                            onView={onViewTask}
                            onUpdate={onUpdateTask}
                            onRightClick={handleContextMenu}
                            // onDoubleClick={onCheckTask}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No tasks found in <strong>{category}</strong>.</p>
                    </div>
                )}

                <ItemMenu />
            </div>
        </>
    );
};

export default TaskDashboard;