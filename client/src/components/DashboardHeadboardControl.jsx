import React from 'react';

const DashboardHeadboardControl = ({
    searchTxt, 
    category, 
    data, // { ongoing, done, overdue, total }
    onUpdateList, 
    onViewModal, 
    onSearch
}) => {    
    const handleClearSearch = () => onSearch('');
    const categories = ['active', 'todo', 'in-progress', 'overdue', 'done'];

    return (
        <div className='controls-bar flex-row sticky' style={{top:'145px'}}>
            <div className='controls-left-bar flex-row'>
                <select 
                    className="tasklist-selector subject pill no-border" 
                    value={category}
                    onChange={(e) => onUpdateList(e.target.value)}
                    aria-label="Filter tasks by category"
                >
                    {categories.map(item => <option value={item} key={item}>{item}</option>)}
                </select>

                {/* Stats Display */}
                <div className='stats-bar flex-row'>
                    {data.overdue > 0 && (
                        <div className='stats-bar-item flex-row overdue'>
                            <span className='stats-bar-count'>{data.overdue}</span>
                            <span className='stats-bar-name'>overdue</span>
                        </div>
                    )}

                    <div className='stats-bar-item flex-row'>
                        <span className='stats-bar-count'>{data.ongoing}</span>
                        <span className='stats-bar-name'>ongoing</span>
                    </div>

                    <div className='stats-bar-item flex-row'>
                        <span className='stats-bar-count'>{data.done}</span>
                        <span className='stats-bar-name'>completed</span>
                    </div>
                </div>
            </div>

            <div className='controls-right-bar flex-row'>
                <div className="search-wrapper">
                    <input 
                        type='text' 
                        className='tasklist-search pill' 
                        placeholder='Filter tasks...' 
                        value={searchTxt}
                        onChange={(e) => onSearch(e.target.value)}
                        aria-label="Search tasks"
                    />

                    {searchTxt && (
                        <button className="search-clear" onClick={handleClearSearch}>&times;</button>
                    )}
                </div>
                
                <button className='tasklist-add-control pill primary' onClick={onViewModal} >
                    New Task
                </button>
            </div>
        </div>
    );
};

export default DashboardHeadboardControl;