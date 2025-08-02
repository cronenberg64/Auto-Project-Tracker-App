import { useState, useEffect, useRef, useCallback } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { GanttChart } from './components/GanttChart';
import AIAssistantPanel from './components/AIAssistantPanel';
import { CreateTaskModal } from './components/CreateTaskModal';
import { ProjectDashboard } from './components/ProjectDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/Notification';
import { HelpModal } from './components/HelpModal';
import { useCommonShortcuts } from './hooks/useKeyboardShortcuts';
import { TaskProvider } from './contexts/TaskContext';
import * as chrono from 'chrono-node';
import Gantt from 'frappe-gantt';

// Initial tasks for demo
const initialTasks = [
  { id: '1', title: 'Design UI', status: 'Backlog', start: '2024-07-26', end: '2024-07-28' },
  { id: '2', title: 'Setup Backend', status: 'Backlog', start: '2024-07-27', end: '2024-07-29' },
  { id: '3', title: 'API Integration', status: 'In Progress', start: '2024-07-28', end: '2024-07-30' },
  { id: '4', title: 'Write Tests', status: 'Review', start: '2024-07-29', end: '2024-07-31' },
  { id: '5', title: 'Deploy', status: 'Done', start: '2024-07-30', end: '2024-08-01' },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('projectData');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [showGantt] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [inputText, setInputText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'dashboard', 'timeline'
  const [showHelpModal, setShowHelpModal] = useState(false);
  const ganttRef = useRef(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('projectData', JSON.stringify(tasks));
  }, [tasks]);

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
      new Gantt(ganttRef.current, ganttTasks, { view_mode: 'Day' });
    }
  }, [showGantt, tasks]);

  const parseTaskFromText = useCallback((text) => {
    const parsed = chrono.parseDate(text);
    const title = text.replace(/\b(by|due|on|at)\s+.+$/i, '').trim();
    
    return {
      title,
      start: parsed ? formatDate(parsed) : formatDate(new Date()),
      end: parsed ? formatDate(parsed) : formatDate(new Date(Date.now() + 86400000))
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
      window.showNotification?.success('Task created successfully!');
    }
  };

  const handleSave = () => {
    localStorage.setItem('projectData', JSON.stringify(tasks));
    window.showNotification?.success('Project saved successfully!');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('projectData');
    if (saved) {
      setTasks(JSON.parse(saved));
      window.showNotification?.success('Project loaded successfully!');
    } else {
      window.showNotification?.warning('No saved project found.');
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      setTasks([]);
      localStorage.removeItem('projectData');
      window.showNotification?.info('Project cleared successfully!');
    }
  };

  // Keyboard shortcuts
  useCommonShortcuts({
    createTask: () => setShowCreateModal(true),
    saveProject: handleSave,
    loadProject: handleLoad,
    toggleAI: () => setShowAIPanel(!showAIPanel),
    escape: () => {
      setShowCreateModal(false);
      setShowHelpModal(false);
    }
  });

  const renderMainContent = () => {
    return (
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">AI Project Tracker</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowHelpModal(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                title="Help & Keyboard Shortcuts"
              >
                ?
              </button>
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showAIPanel 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showAIPanel ? 'Hide AI' : 'Show AI'}
              </button>
            </div>
          </div>

          {/* Quick Input */}
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleTextInput}
              placeholder="Type task & deadline (e.g. 'Finish design by Friday')"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors" 
              onClick={() => setShowCreateModal(true)}
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div className="flex space-x-1">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'dashboard' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'kanban' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'timeline' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {viewMode === 'dashboard' && (
            <div className="p-4">
              <ProjectDashboard />
              <div className="flex gap-2 flex-wrap">
                <button 
                  className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors" 
                  onClick={handleSave}
                >
                  Save Project
                </button>
                <button 
                  className="bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors" 
                  onClick={handleLoad}
                >
                  Load Project
                </button>
                <button 
                  className="bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition-colors" 
                  onClick={handleClear}
                >
                  Clear Board
                </button>
              </div>
            </div>
          )}

          {viewMode === 'kanban' && (
            <div className="p-4">
              <KanbanBoard />
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="p-4">
              <GanttChart />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <TaskProvider>
        <NotificationProvider>
          <div className="flex h-screen">
            {/* Main Content */}
            {renderMainContent()}

            {/* AI Assistant Panel */}
            {showAIPanel && (
              <AIAssistantPanel 
                isOpen={showAIPanel}
                onClose={() => setShowAIPanel(false)}
              />
            )}

            {/* Modals */}
            <CreateTaskModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
            />
            <HelpModal
              isOpen={showHelpModal}
              onClose={() => setShowHelpModal(false)}
            />
          </div>
        </NotificationProvider>
      </TaskProvider>
    </ErrorBoundary>
  );
}

export default App;