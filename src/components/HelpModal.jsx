import React, { useState } from 'react';

export const HelpModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('shortcuts');

  const tabs = [
    { id: 'shortcuts', label: 'Keyboard Shortcuts' },
    { id: 'features', label: 'Features' },
    { id: 'ai', label: 'AI Assistant' },
    { id: 'tips', label: 'Tips & Tricks' }
  ];

  const shortcuts = [
    { key: 'Ctrl + N', description: 'Create new task' },
    { key: 'Ctrl + S', description: 'Save project' },
    { key: 'Ctrl + L', description: 'Load project' },
    { key: 'Ctrl + A', description: 'Toggle AI assistant' },
    { key: 'Escape', description: 'Close modals/cancel actions' },
    { key: 'Enter', description: 'Save task edits' },
    { key: 'Escape', description: 'Cancel task edits' }
  ];

  const features = [
    {
      title: 'Natural Language Input',
      description: 'Type tasks with deadlines like "Design homepage by Friday"',
      icon: '💬'
    },
    {
      title: 'Kanban Board',
      description: 'Drag and drop tasks between Backlog, In Progress, Review, and Done',
      icon: '📋'
    },
    {
      title: 'Gantt Timeline',
      description: 'Visual timeline view of your project with task dependencies',
      icon: '📅'
    },
    {
      title: 'AI Assistant',
      description: 'Get AI-powered planning, analysis, and task suggestions',
      icon: '🤖'
    },
    {
      title: 'Project Dashboard',
      description: 'Real-time statistics and progress tracking',
      icon: '📊'
    }
  ];

  const aiFeatures = [
    {
      title: 'Weekly Planning',
      description: 'Generate comprehensive weekly plans with daily breakdowns'
    },
    {
      title: 'Project Analysis',
      description: 'Get project health scores and identify bottlenecks'
    },
    {
      title: 'Task Suggestions',
      description: 'AI-powered recommendations for missing tasks and dependencies'
    }
  ];

  const tips = [
    'Use natural language for quick task creation',
    'Drag tasks between columns to update their status',
    'Click on tasks to edit their details',
    'Use the AI assistant for project insights',
    'Save your project regularly',
    'Check the dashboard for project overview',
    'Use keyboard shortcuts for faster workflow'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Help & Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-200">
            <nav className="p-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'shortcuts' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                        {shortcut.key}
                      </kbd>
                      <span className="text-gray-700">{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-800">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">AI Assistant Features</h3>
                <div className="space-y-4">
                  {aiFeatures.map((feature, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800">{feature.title}</h4>
                      <p className="text-sm text-purple-700">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Tips & Tricks</h3>
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 