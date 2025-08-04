import { useState, useEffect } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

export const GitIntegration = () => {
  const { tasks, addTask, updateTask } = useTaskContext();
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoStructure, setRepoStructure] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // GitHub API integration
  const connectToGitHub = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // This would integrate with GitHub API
      // For now, we'll simulate repository structure
      const mockRepos = [
        {
          id: 1,
          name: 'auto-project-tracker-app',
          full_name: 'cronenberg64/auto-project-tracker-app',
          description: 'AI-powered project tracker',
          default_branch: 'main',
          html_url: 'https://github.com/cronenberg64/auto-project-tracker-app'
        }
      ];
      
      setRepositories(mockRepos);
    } catch (error) {
      setError('Failed to connect to GitHub: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get repository structure (directories and files)
  const getRepoStructure = async (repoName) => {
    setIsLoading(true);
    
    try {
      // Simulate fetching repository structure
      const structure = {
        'src/': {
          type: 'directory',
          children: {
            'components/': {
              type: 'directory',
              children: {
                'App.jsx': { type: 'file', path: 'src/components/App.jsx' },
                'KanbanBoard.jsx': { type: 'file', path: 'src/components/KanbanBoard.jsx' },
                'GanttChart.jsx': { type: 'file', path: 'src/components/GanttChart.jsx' }
              }
            },
            'contexts/': {
              type: 'directory',
              children: {
                'TaskContext.jsx': { type: 'file', path: 'src/contexts/TaskContext.jsx' }
              }
            },
            'hooks/': {
              type: 'directory',
              children: {
                'useTaskContext.js': { type: 'file', path: 'src/hooks/useTaskContext.js' }
              }
            },
            'App.jsx': { type: 'file', path: 'src/App.jsx' },
            'main.jsx': { type: 'file', path: 'src/main.jsx' }
          }
        },
        'public/': {
          type: 'directory',
          children: {
            'index.html': { type: 'file', path: 'public/index.html' }
          }
        },
        'package.json': { type: 'file', path: 'package.json' },
        'README.md': { type: 'file', path: 'README.md' }
      };
      
      setRepoStructure(structure);
      setSelectedRepo(repoName);
    } catch (error) {
      setError('Failed to fetch repository structure: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create task for specific file/directory
  const createTaskForPath = (path, taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      path: path,
      repository: selectedRepo,
      branch: 'main', // Default branch
      status: 'Backlog'
    };
    
    addTask(newTask);
  };

  // Render directory tree
  const renderDirectoryTree = (structure, level = 0) => {
    return Object.entries(structure).map(([name, item]) => {
      const indent = '  '.repeat(level);
      const isDirectory = item.type === 'directory';
      
      return (
        <div key={name} className="ml-4">
          <div 
            className={`flex items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer ${
              isDirectory ? 'font-medium text-blue-600' : 'text-gray-700'
            }`}
            onClick={() => {
              if (isDirectory) {
                // Expand/collapse directory
              } else {
                // Create task for this file
                createTaskForPath(item.path, {
                  title: `Work on ${name}`,
                  start: new Date().toISOString().split('T')[0],
                  end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                });
              }
            }}
          >
            <span className="mr-2">
              {isDirectory ? '📁' : '📄'}
            </span>
            <span>{indent}{name}</span>
            {!isDirectory && (
              <button 
                className="ml-auto px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  createTaskForPath(item.path, {
                    title: `Review ${name}`,
                    start: new Date().toISOString().split('T')[0],
                    end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  });
                }}
              >
                + Task
              </button>
            )}
          </div>
          {isDirectory && item.children && (
            <div className="ml-4">
              {renderDirectoryTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Filter tasks by repository and path
  const getTasksForPath = (path) => {
    return tasks.filter(task => 
      task.repository === selectedRepo && 
      task.path === path
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Git Repository Integration</h2>
      
      {/* GitHub Connection */}
      <div className="mb-6">
        <button
          onClick={connectToGitHub}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Connecting...' : 'Connect to GitHub'}
        </button>
      </div>

      {/* Repository Selection */}
      {repositories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Repository</h3>
          <select
            value={selectedRepo || ''}
            onChange={(e) => getRepoStructure(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a repository...</option>
            {repositories.map(repo => (
              <option key={repo.id} value={repo.name}>
                {repo.full_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Repository Structure */}
      {selectedRepo && Object.keys(repoStructure).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Repository Structure</h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
            {renderDirectoryTree(repoStructure)}
          </div>
        </div>
      )}

      {/* Tasks by Path */}
      {selectedRepo && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Tasks by File/Directory</h3>
          <div className="space-y-4">
            {Object.entries(repoStructure).map(([name, item]) => {
              const pathTasks = getTasksForPath(item.path);
              if (pathTasks.length === 0) return null;
              
              return (
                <div key={name} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-600 mb-2">
                    📄 {name}
                  </h4>
                  <div className="space-y-2">
                    {pathTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm">{task.title}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          task.status === 'Done' ? 'bg-green-100 text-green-800' :
                          task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}; 