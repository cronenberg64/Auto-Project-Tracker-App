import React, { memo } from 'react';

const TaskCard = memo(({ task, onEdit, onDelete, isDragging, dragHandleProps, draggableProps, innerRef }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className={`mb-2 p-3 rounded-lg shadow-sm bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group ${
        isDragging ? 'bg-blue-50 shadow-lg' : ''
      }`}
    >
      <div className="relative">
        <h3 className="font-medium text-gray-800 pr-8">{task.title}</h3>
        <div className="text-xs text-gray-500 mt-1">
          {task.start} - {task.end}
        </div>
        
        {/* Action buttons - visible on hover */}
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-blue-500 text-xs"
              title="Edit task"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 text-xs"
              title="Delete task"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard; 