import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTaskContext } from '../hooks/useTaskContext';

export const KanbanBoard = () => {
  const { tasks } = useTaskContext();

  const columns = [
    { id: 'Backlog', title: 'Backlog' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Review', title: 'Review' },
    { id: 'Done', title: 'Done' },
  ];

  return (
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
                          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                        >
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
                          <div className="text-xs text-gray-500 mt-1">
                            {task.start} - {task.end}
                          </div>
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
  );
};