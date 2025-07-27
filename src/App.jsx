import { useState, useCallback, useEffect } from 'react';
import * as chrono from 'chrono-node';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Gantt from 'frappe-gantt';
import AIAssistantPanel from './components/AIAssistantPanel';
import { useEffect, useRef } from 'react';

const initialTasks = [
  { id: '1', title: 'Design UI', status: 'Backlog', start: '2024-07-26', end: '2024-07-28' },
  { id: '2', title: 'Setup Backend', status: 'Backlog', start: '2024-07-27', end: '2024-07-29' },
  { id: '3', title: 'API Integration', status: 'In Progress', start: '2024-07-28', end: '2024-07-30' },
  { id: '4', title: 'Write Tests', status: 'Review', start: '2024-07-29', end: '2024-07-31' },
  { id: '5', title: 'Deploy', status: 'Done', start: '2024-07-30', end: '2024-08-01' },
];

const columns = [
  { id: 'Backlog', title: 'Backlog' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Review', title: 'Review' },
  { id: 'Done', title: 'Done' },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('projectData');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [showGantt, setShowGantt] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const ganttRef = useRef(null);

  useEffect(() => {
    if (showGantt && ganttRef.current) {
      // Clean up previous chart
      ganttRef.current.innerHTML = '';
      // Prepare Gantt data
      const ganttTasks = tasks.map(t => ({
        id: t.id,
        name: t.title,
        start: t.start,
        end: t.end,
        progress: t.status === 'Done' ? 100 : 50,
        custom_class: t.status.replace(/\s/g, '-').toLowerCase(),
      }));
      // eslint-disable-next-line no-new
      new Gantt(ganttRef.current, ganttTasks, { view_mode: 'Day' });
    }
  }, [showGantt, tasks]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    // Move task
    const updated = Array.from(tasks);
    const moved = updated.find(t => t.id === draggableId);
    moved.status = destination.droppableId;
    // Remove and re-insert at new position
    const filtered = updated.filter(t => t.id !== draggableId);
    filtered.splice(destination.index, 0, moved);
    setTasks(filtered);
  };

  const [inputText, setInputText] = useState('');

const parseTaskFromText = useCallback((text) => {
  const dates = chrono.parseDate(text);
  const title = text.replace(/\b(by|due)\s+.+$/, '').trim();
  
  return {
    title,
    start: dates?.start ? formatDate(dates.start) : formatDate(new Date()),
    end: dates?.end ? formatDate(dates.end) : formatDate(new Date(Date.now() + 86400000))
  };
}, []);

const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const handleTextInput = (e) => {
  if (e.key === 'Enter' && inputText.trim()) {
    const parsed = parseTaskFromText(inputText);
    const id = (tasks.length + 1).toString();
    setTasks([...tasks, {
      id,
      title: parsed.title,
      status: 'Backlog',
      start: parsed.start,
      end: parsed.end
    }]);
    setInputText('');
  }
};

const handleAddTask = () => {
    const id = (tasks.length + 1).toString();
    setTasks([
      ...tasks,
      {
        id,
        title: `New Task ${id}`,
        status: 'Backlog',
        start: '2024-08-01',
        end: '2024-08-02',
      },
    ]);
  };

  const handleSave = () => {
    localStorage.setItem('projectData', JSON.stringify(tasks));
    alert('Project saved!');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('projectData');
    if (saved) {
      setTasks(JSON.parse(saved));
      alert('Project loaded!');
    }
  };

  const handleClear = () => {
    setTasks([]);
    localStorage.removeItem('projectData');
  };
  const handlePreview = () => setShowGantt(s => !s);

  return (
    <div className="flex h-screen">
      {/* Kanban Board */}
      <div className="w-1/2 p-4 border-r flex flex-col">
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleTextInput}
            placeholder="Type task & deadline (e.g. 'Finish design by Friday')"
            className="flex-1 px-2 py-1 border rounded"
          />
          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleAddTask}>Add Task</button>
          <button className="bg-purple-500 text-white px-3 py-1 rounded" onClick={handleSave}>Save Project</button>
<button className="bg-indigo-500 text-white px-3 py-1 rounded" onClick={handleLoad}>Load Project</button>
<button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={handleClear}>Clear Board</button>
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handlePreview}>{showGantt ? 'Hide Timeline' : 'Preview Timeline'}</button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-1 gap-2 overflow-x-auto">
            {columns.map(col => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-gray-100 rounded p-2 flex-1 min-w-[180px] ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}
                  >
                    <h2 className="font-bold text-center mb-2">{col.title}</h2>
                    {tasks.filter(t => t.status === col.id).map((task, idx) => (
                      <Draggable draggableId={task.id} index={idx} key={task.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 p-2 rounded shadow bg-white border ${snapshot.isDragging ? 'bg-blue-200' : ''}`}
                          >
                            <div className="font-medium">{task.title}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
      {/* Gantt Chart */}
      <div className="w-1/2 p-4 flex flex-col">
        <h2 className="font-bold text-lg mb-2">Timeline</h2>
        {showGantt ? (
          <div ref={ganttRef} className="overflow-x-auto" style={{ minHeight: 400 }} />
        ) : (
          <div className="text-gray-400 text-center mt-20">Click "Preview Timeline" to show Gantt chart</div>
        )}
      </div>
      <AIAssistantPanel 
        tasks={tasks}
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
      />
    </div>
  );
}

export default App;