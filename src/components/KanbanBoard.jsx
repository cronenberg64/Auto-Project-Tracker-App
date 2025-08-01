import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskDetailsModal } from './TaskDetailsModal';

export const KanbanBoard = () => {
  const { tasks, updateTask, deleteTask } = useTaskContext();
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [modalTask, setModalTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { id: 'Backlog', title: 'Backlog' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Review', title: 'Review' },
    { id: 'Done', title: 'Done' },
  ];

  const handleEditClick = (task) => {
    setEditingTask(task.id);
    setEditText(task.title);
  };

  const handleSaveEdit = (taskId) => {
    if (editText.trim()) {
      updateTask(taskId, { title: editText.trim() });
    }
    setEditingTask(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  const handleDeleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleKeyPress = (e, taskId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(taskId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleOpenModal = (task) => {
    setModalTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalTask(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 group cursor-pointer"
                            onClick={() => handleOpenModal(task)}
                          >
                            {editingTask === task.id ? (
                              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyDown={(e) => handleKeyPress(e, task.id)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  autoFocus
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleSaveEdit(task.id)}
                                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <h3 className="font-medium text-gray-800 pr-8">{task.title}</h3>
                                <div className="text-xs text-gray-500 mt-1">
                                  {task.start} - {task.end}
                                </div>
                                
                                {/* Action buttons - visible on hover */}
                                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(task);
                                      }}
                                      className="p-1 text-gray-400 hover:text-blue-500 text-xs"
                                      title="Quick edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task.id);
                                      }}
                                      className="p-1 text-gray-400 hover:text-red-500 text-xs"
                                      title="Delete task"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>

      <TaskDetailsModal
        task={modalTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};