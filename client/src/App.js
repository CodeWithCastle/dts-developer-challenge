import { useState, useContext } from 'react';
import { TaskContext } from './contexts/TaskProvider';
import './App.css';

import AppHeader from './components/AppHeader';
import DashboardHeadboardControl from './components/DashboardHeadboardControl'
import TaskDashboard from './components/TaskDashboard'
import TaskSideview from './components/TaskSideview';

const App = () => {
  // console.log(process.env.client.REACT_APP_API_URL);

  const {
    updateList, listCategory, 
    updateTask, addTask, deleteTask,
    loading, error, taskSummary,
    searchTask, searchForTask,
    bulkUpdateStatus, bulkDeleteTasks
  } = useContext(TaskContext);

  const [isModalOpen, setModalOpen] = useState(null); // {'profile' | 'form' | null}
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // --- Handlers ---

  const closeModal = () => {
    setModalOpen(null);
    setSelectedTaskId(null);
  };

  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) return;
    if (window.confirm(`Permanently delete ${selectedTasks.length} tasks?`)) {
      bulkDeleteTasks(selectedTasks);
      setSelectedTasks([]);
      
      if (selectedTasks.includes(selectedTaskId)) closeModal(); // If the currently viewed task was deleted, close the sideview
    }
  }; 

  const handleBulkMarkDone = () => {
      if (selectedTasks.length === 0) return;
      if (window.confirm(`Mark ${selectedTasks.length} tasks as 'Done'?`)) {
          bulkUpdateStatus(selectedTasks);
          setSelectedTasks([]);
      }
  };

  const handleUpdateList = (category) => {
    updateList(category);
    setSelectedTasks([]);
  }

  const handleCheckTask = (taskId) => {
    setSelectedTasks(prev => {
      return prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...new Set([...prev, taskId])] 
    });    
  };

  // --- Task Actions (Standard Functions) ---

  const handleViewTask = (taskId) => {
    setSelectedTaskId(taskId);
    setModalType('profile');
  };

  const setModalType = (type) => {
    setModalOpen(type);
  }

  const handleSaveTask = (formData) => {
    if (selectedTaskId) {
      updateTask(selectedTaskId, formData);
    } else {
      addTask(formData);
    }
    closeModal();
  };

  const handleUpdateTask = (taskId, newStatus) => {
    updateTask(taskId, newStatus);
    if(
      newStatus === 'done'
      || (
        selectedTasks.includes(taskId)
        && listCategory !== 'active'
      )
    ) setSelectedTasks(prev => prev.filter(id => id !== taskId));
  }
  
  const handleDeleteTask = (taskId) => {
    if (window.confirm("Delete this task?")) {
      deleteTask(taskId);
      closeModal();
    }
  };

  
  // --- Guard Rails ---
  if (loading) return <div className="loading-screen">Loading your workspace...</div>;
  if (error) return <div className="error-screen">Something went wrong. Please refresh.</div>;

  return (
    <section className='app'>
      <div className='backdrop-fill'></div>
      <AppHeader />

      <div className='body'>
        <div className='content flex-col'>
          <div className='title-bar title sticky'>dts-developer-challenge</div>

          {/* Dashboard */}
          <section className='dashboard-content flex-row'>
            <div className='dashboard-content-left flex-col'>
              <DashboardHeadboardControl 
                searchTxt={searchTask}
                data={taskSummary}
                category={listCategory}
                onUpdateList={handleUpdateList} 
                onSearch={searchForTask}
                onViewModal={() => {
                  setModalOpen('form');
                  setSelectedTaskId(null);
                }}
              />

              <div className='task-dashboard pill'>
                <TaskDashboard 
                  // tasks={filtered_tasks}
                  category={listCategory}
                  selectedTasks={selectedTasks}
                  onCompleteMarked={handleBulkMarkDone}
                  onDeleteMarked={handleBulkDelete}                  
                  onCheckTask={handleCheckTask}
                  onViewTask={handleViewTask}
                  onUpdateTask={handleUpdateTask}
                />
              </div>
            </div>

            {/* Sideview */}
            <div className='dashboard-content-right sticky' style={{top:'145px'}}>
              {isModalOpen && (
                <TaskSideview
                  key={selectedTaskId}
                  modalType={isModalOpen} 
                  taskId={selectedTaskId}
                  onClose={closeModal}
                  onSave={handleSaveTask} 
                  onEdit={() => setModalOpen('form')}
                  onDelete={handleDeleteTask}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default App;