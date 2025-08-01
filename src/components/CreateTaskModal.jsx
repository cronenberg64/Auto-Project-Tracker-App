import { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import * as chrono from 'chrono-node';

export const CreateTaskModal = ({ isOpen, onClose }) => {
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    status: 'Backlog',
    start: '',
    end: ''
  });
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [parseError, setParseError] = useState('');

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const parseNaturalLanguage = (text) => {
    try {
      const parsed = chrono.parseDate(text);
      const title = text.replace(/\b(by|due|on|at)\s+.+$/i, '').trim();
      
      if (!title) {
        throw new Error('Could not extract task title');
      }

      return {
        title,
        start: parsed ? formatDate(parsed) : formatDate(new Date()),
        end: parsed ? formatDate(parsed) : formatDate(new Date(Date.now() + 86400000))
      };
    } catch (error) {
      throw new Error('Could not parse date from text');
    }
  };

  const handleNaturalLanguageSubmit = (e) => {
    e.preventDefault();
    setParseError('');

    if (!naturalLanguageInput.trim()) {
      setParseError('Please enter a task description');
      return;
    }

    try {
      const parsed = parseNaturalLanguage(naturalLanguageInput);
      addTask({
        ...parsed,
        status: 'Backlog'
      });
      setNaturalLanguageInput('');
      onClose();
    } catch (error) {
      setParseError(error.message);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setParseError('Please enter a task title');
      return;
    }

    if (!formData.start || !formData.end) {
      setParseError('Please select start and end dates');
      return;
    }

    addTask(formData);
    setFormData({
      title: '',
      status: 'Backlog',
      start: '',
      end: ''
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Natural Language Input */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Add (Natural Language)</h3>
          <form onSubmit={handleNaturalLanguageSubmit} className="space-y-2">
            <input
              type="text"
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              placeholder="e.g., 'Design homepage by Friday' or 'Setup database next Monday'"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Create Task
            </button>
          </form>
        </div>

        <div className="text-center mb-4">
          <span className="text-gray-500 text-sm">or</span>
        </div>

        {/* Manual Input */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Manual Entry</h3>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {parseError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{parseError}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Natural Language Examples:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• "Design homepage by Friday"</li>
            <li>• "Setup database next Monday"</li>
            <li>• "Review code by end of week"</li>
            <li>• "Deploy app tomorrow"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 