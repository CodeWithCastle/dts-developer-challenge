import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import TaskProvider from './contexts/TaskProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </React.StrictMode>
);