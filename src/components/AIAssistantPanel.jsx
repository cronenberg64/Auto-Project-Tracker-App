import { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

export default function AIAssistantPanel({ isOpen, onClose }) {
  const { tasks } = useTaskContext();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiMode, setAiMode] = useState('plan'); // 'plan', 'analyze', 'suggest'

  const getDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.end === today && t.status !== 'Done');
  };

  const getOverdue = () => {
    const today = new Date();
    return tasks.filter(t => new Date(t.end) < today && t.status !== 'Done');
  };

  const getUpcoming = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks.filter(t => {
      const taskDate = new Date(t.end);
      return taskDate >= today && taskDate <= nextWeek && t.status !== 'Done';
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const backlog = tasks.filter(t => t.status === 'Backlog').length;
    const review = tasks.filter(t => t.status === 'Review').length;
    
    return { total, completed, inProgress, backlog, review };
  };

  const callGeminiAPI = async (prompt) => {
    const apiKey = 'AIzaSyBeuqjUTdpVoTWzoU7Hqmy8_0K54BxGMkg';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  };

  const generateWeeklyPlan = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const stats = getTaskStats();
      const overdue = getOverdue();
      const dueToday = getDueToday();
      const upcoming = getUpcoming();

      const prompt = `As a project management AI assistant, analyze this project data and provide a comprehensive weekly plan:

PROJECT STATISTICS:
- Total tasks: ${stats.total}
- Completed: ${stats.completed}
- In Progress: ${stats.inProgress}
- Backlog: ${stats.backlog}
- In Review: ${stats.review}
- Overdue tasks: ${overdue.length}
- Due today: ${dueToday.length}
- Upcoming this week: ${upcoming.length}

TASKS DATA:
${JSON.stringify(tasks, null, 2)}

CURRENT DATE: ${new Date().toLocaleDateString()}

Please provide:
1. **Priority Analysis**: Which tasks should be prioritized this week?
2. **Daily Breakdown**: Specific tasks for each day of the week
3. **Risk Assessment**: Potential blockers or dependencies
4. **Time Management**: Suggested time allocation for different task types
5. **Action Items**: 3-5 specific actions to take today

Format as a clear, actionable plan with bullet points and sections.`;

      const result = await callGeminiAPI(prompt);
      setSuggestions(result.split('\n').filter(line => line.trim()));
    } catch (error) {
      console.error('AI Error:', error);
      setError(`Failed to generate plan: ${error.message}`);
    }
    setIsLoading(false);
  };

  const analyzeProject = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const stats = getTaskStats();
      const overdue = getOverdue();
      const dueToday = getDueToday();

      const prompt = `Analyze this project's health and provide insights:

PROJECT DATA:
${JSON.stringify(tasks, null, 2)}

STATISTICS:
- Total tasks: ${stats.total}
- Completion rate: ${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
- Overdue tasks: ${overdue.length}
- Due today: ${dueToday.length}

Please provide:
1. **Project Health Score**: Rate the project health (1-10) with reasoning
2. **Bottleneck Analysis**: Identify workflow bottlenecks
3. **Resource Allocation**: Assess if resources are properly distributed
4. **Timeline Risk**: Evaluate timeline risks and delays
5. **Recommendations**: 3-5 specific recommendations to improve project flow

Format as a structured analysis with clear sections.`;

      const result = await callGeminiAPI(prompt);
      setSuggestions(result.split('\n').filter(line => line.trim()));
    } catch (error) {
      console.error('AI Error:', error);
      setError(`Failed to analyze project: ${error.message}`);
    }
    setIsLoading(false);
  };

  const generateTaskSuggestions = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const prompt = `Based on these existing tasks, suggest 3-5 additional tasks that would complement the project:

EXISTING TASKS:
${JSON.stringify(tasks, null, 2)}

Please suggest:
1. **Missing Tasks**: Tasks that seem to be missing from the workflow
2. **Dependencies**: Tasks that might be needed as prerequisites
3. **Quality Assurance**: Testing or review tasks
4. **Documentation**: Documentation tasks that might be needed
5. **Optimization**: Tasks to improve the project

For each suggestion, provide:
- Task title
- Suggested deadline (relative to current date)
- Priority level (High/Medium/Low)
- Brief reasoning

Format as a structured list with clear task descriptions.`;

      const result = await callGeminiAPI(prompt);
      setSuggestions(result.split('\n').filter(line => line.trim()));
    } catch (error) {
      console.error('AI Error:', error);
      setError(`Failed to generate suggestions: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleAiAction = () => {
    switch (aiMode) {
      case 'plan':
        generateWeeklyPlan();
        break;
      case 'analyze':
        analyzeProject();
        break;
      case 'suggest':
        generateTaskSuggestions();
        break;
      default:
        generateWeeklyPlan();
    }
  };

  if (!isOpen) return null;

  const stats = getTaskStats();

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 border-l border-gray-200 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">AI Assistant (Gemini)</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Project Stats */}
      <div className="mb-6 p-3 bg-blue-50 rounded-lg">
        <h3 className="font-medium mb-2 text-blue-800">Project Overview</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-blue-600">Total: {stats.total}</div>
          <div className="text-green-600">Done: {stats.completed}</div>
          <div className="text-yellow-600">In Progress: {stats.inProgress}</div>
          <div className="text-gray-600">Backlog: {stats.backlog}</div>
        </div>
        {stats.total > 0 && (
          <div className="mt-2 text-xs text-blue-600">
            Completion: {Math.round((stats.completed / stats.total) * 100)}%
          </div>
        )}
      </div>
      
      {/* Task Alerts */}
      <div className="mb-6 space-y-3">
        <div>
          <h3 className="font-medium mb-2 text-gray-700">Due Today ({getDueToday().length})</h3>
          {getDueToday().length > 0 ? (
            <ul className="list-disc pl-4 text-sm space-y-1">
              {getDueToday().map(t => (
                <li key={t.id} className="text-gray-600">{t.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No tasks due today</p>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2 text-red-600">Overdue ({getOverdue().length})</h3>
          {getOverdue().length > 0 ? (
            <ul className="list-disc pl-4 text-sm space-y-1">
              {getOverdue().map(t => (
                <li key={t.id} className="text-red-600">{t.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No overdue tasks</p>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2 text-blue-600">Upcoming This Week ({getUpcoming().length})</h3>
          {getUpcoming().length > 0 ? (
            <ul className="list-disc pl-4 text-sm space-y-1">
              {getUpcoming().map(t => (
                <li key={t.id} className="text-blue-600">{t.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No upcoming tasks</p>
          )}
        </div>
      </div>

      {/* AI Mode Selector */}
      <div className="mb-4">
        <h3 className="font-medium mb-2 text-gray-700">AI Analysis Mode</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setAiMode('plan')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              aiMode === 'plan' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Weekly Plan
          </button>
          <button
            onClick={() => setAiMode('analyze')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              aiMode === 'analyze' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Project Analysis
          </button>
          <button
            onClick={() => setAiMode('suggest')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              aiMode === 'suggest' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Task Suggestions
          </button>
        </div>
      </div>

      <button 
        onClick={handleAiAction}
        className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : `Generate ${aiMode === 'plan' ? 'Weekly Plan' : aiMode === 'analyze' ? 'Project Analysis' : 'Task Suggestions'}`}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-3 text-gray-700">
            AI {aiMode === 'plan' ? 'Weekly Plan' : aiMode === 'analyze' ? 'Analysis' : 'Suggestions'}:
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg max-h-96 overflow-y-auto">
            <ul className="space-y-2 text-sm">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="text-gray-700 leading-relaxed">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}