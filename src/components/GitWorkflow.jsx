import { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

export const GitWorkflow = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskContext();
  const [currentBranch, setCurrentBranch] = useState('main');
  const [branches, setBranches] = useState(['main', 'develop', 'feature/ai-integration']);
  const [stagedTasks, setStagedTasks] = useState([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  // Git-like operations
  const checkoutBranch = (branchName) => {
    setCurrentBranch(branchName);
    // Filter tasks by branch
  };

  const createBranch = () => {
    if (newBranchName && !branches.includes(newBranchName)) {
      setBranches([...branches, newBranchName]);
      setNewBranchName('');
      setShowCreateBranch(false);
    }
  };

  const stageTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !stagedTasks.find(t => t.id === taskId)) {
      setStagedTasks([...stagedTasks, task]);
    }
  };

  const unstageTask = (taskId) => {
    setStagedTasks(stagedTasks.filter(t => t.id !== taskId));
  };

  const commitTasks = () => {
    if (stagedTasks.length === 0 || !commitMessage.trim()) return;

    // Update staged tasks with commit info
    stagedTasks.forEach(task => {
      updateTask(task.id, {
        ...task,
        committed: true,
        commitMessage: commitMessage,
        commitDate: new Date().toISOString(),
        branch: currentBranch
      });
    });

    setStagedTasks([]);
    setCommitMessage('');
  };

  const mergeBranch = (sourceBranch, targetBranch) => {
    // Simulate merging tasks from one branch to another
    const sourceTasks = tasks.filter(t => t.branch === sourceBranch);
    sourceTasks.forEach(task => {
      updateTask(task.id, { ...task, branch: targetBranch });
    });
  };

  const getTasksByBranch = (branch) => {
    return tasks.filter(task => task.branch === branch);
  };

  const getUncommittedTasks = (branch) => {
    return tasks.filter(task => 
      task.branch === branch && !task.committed
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Git Workflow</h2>
      
      {/* Branch Management */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Branch
            </label>
            <select
              value={currentBranch}
              onChange={(e) => checkoutBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {branches.map(branch => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setShowCreateBranch(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + New Branch
          </button>
        </div>

        {/* Create Branch Modal */}
        {showCreateBranch && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="branch-name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={createBranch}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateBranch(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Working Directory */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Working Directory</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="space-y-2">
            {getUncommittedTasks(currentBranch).map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="text-sm font-medium">{task.title}</span>
                  <span className="text-xs text-gray-500 ml-2">({task.path})</span>
                </div>
                <button
                  onClick={() => stageTask(task.id)}
                  className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Stage
                </button>
              </div>
            ))}
            {getUncommittedTasks(currentBranch).length === 0 && (
              <p className="text-gray-500 text-sm">No uncommitted changes</p>
            )}
          </div>
        </div>
      </div>

      {/* Staging Area */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Staging Area</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="space-y-2">
            {stagedTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="text-sm font-medium">{task.title}</span>
                  <span className="text-xs text-gray-500 ml-2">({task.path})</span>
                </div>
                <button
                  onClick={() => unstageTask(task.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Unstage
                </button>
              </div>
            ))}
            {stagedTasks.length === 0 && (
              <p className="text-gray-500 text-sm">No staged changes</p>
            )}
          </div>
        </div>
      </div>

      {/* Commit */}
      {stagedTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Commit Changes</h3>
          <div className="space-y-2">
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Enter commit message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <button
              onClick={commitTasks}
              disabled={!commitMessage.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
            >
              Commit ({stagedTasks.length} tasks)
            </button>
          </div>
        </div>
      )}

      {/* Branch History */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Branch History</h3>
        <div className="space-y-4">
          {branches.map(branch => {
            const branchTasks = getTasksByBranch(branch);
            const committedTasks = branchTasks.filter(t => t.committed);
            
            return (
              <div key={branch} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-600">{branch}</h4>
                  <span className="text-sm text-gray-500">
                    {committedTasks.length} commits
                  </span>
                </div>
                
                <div className="space-y-1">
                  {committedTasks.slice(-3).map(task => (
                    <div key={task.id} className="text-sm text-gray-600">
                      <span className="font-mono text-xs text-gray-400">
                        {task.commitDate ? new Date(task.commitDate).toLocaleDateString() : ''}
                      </span>
                      <span className="ml-2">{task.commitMessage}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Merge Operations */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Merge Operations</h3>
        <div className="space-y-2">
          {branches.filter(b => b !== currentBranch).map(branch => (
            <button
              key={branch}
              onClick={() => mergeBranch(branch, currentBranch)}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Merge {branch} into {currentBranch}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 