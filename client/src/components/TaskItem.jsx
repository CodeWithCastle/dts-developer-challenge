import React, {useMemo} from 'react';

const TaskItem = ({ 
    task, 
    isSelected, 
    onCheck,
    onView, 
    onUpdate,
    onRightClick
}) => {
    const isDone = task.status === 'done';
    const taskStatusUrgency = useMemo(() => {
      if(!task.due_date) return 'inactive';

      const start = new Date(task.created_at).getTime();
      const end = new Date(task.due_date).getTime();
      const now = Date.now();

      const totalDuration = end - start;
      const timeElapsed = now - start;
      
      const isPastThreshold = timeElapsed >= (totalDuration * 0.75);
      const isHalfTime = timeElapsed >= (totalDuration * 0.5);

      if (now > end) return 'late';
      if (isPastThreshold) return 'due';
      if(isHalfTime) return 'halfpast';
      return 'ontrack';
    }, [task]);

    const categories = ['todo', 'in-progress', 'overdue', 'done'];

    return (
        <div className={`task-item ${task.status} ${isSelected ? 'selected' : ''} ${isDone ? 'is-done' : ''}`}>
            <input 
                type="checkbox" 
                name={`task-${task.id}`}
                className="task-select"
                onChange={(e) => onCheck(task.id)}
                checked={isSelected}
                disabled={isDone}
            />

            <div className="task-content">
              <h4 className={`task-content-title subject ${isDone ? 'strikethrough' : ''}`}>
                {task.title}
              </h4>
              <div className="task-content-meta">
                <div className={`task-content-meta-icon ${task.status === 'done'? 'inactive' : taskStatusUrgency}`}></div>
                {task.due_date && (
                  <span className="task-content-date">
                    Due: {(!task.due_date)? 'NA' : new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="task-description-preview">
                  {task.description || 'No description provided.'}
              </p>

              <div 
                className="task-content-fill" 
                onClick={() => onView(task.id)}
                onDoubleClick={(e) => onCheck(task.id)}
                onContextMenu={(e)=>onRightClick(e, task.id)}
              />
            </div>

            <div className="task-control">
                {!isDone ? (
                    <select 
                        className="select pill no-border" 
                        value={task.status} 
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdate(task.id, e.target.value)}
                    >
                        {categories.map(item => <option value={item} key={item}>{item}</option>)}
                    </select>
                ) : (
                    <button 
                        className="btn-view-done pill" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(task.id);
                        }}
                    >
                        View Details
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskItem;