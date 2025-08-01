import { createContext, useState } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Design UI', status: 'Backlog', start: '2024-07-26', end: '2024-07-28' },
    { id: '2', title: 'Setup Backend', status: 'Backlog', start: '2024-07-27', end: '2024-07-29' },
    { id: '3', title: 'API Integration', status: 'In Progress', start: '2024-07-28', end: '2024-07-30' },
    { id: '4', title: 'Write Tests', status: 'Review', start: '2024-07-29', end: '2024-07-31' },
    { id: '5', title: 'Deploy', status: 'Done', start: '2024-07-30', end: '2024-08-01' },
  ]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: (tasks.length + 1).toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const loadTasks = (savedTasks) => {
    setTasks(savedTasks);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      setTasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      moveTask, 
      clearTasks, 
      loadTasks 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext };