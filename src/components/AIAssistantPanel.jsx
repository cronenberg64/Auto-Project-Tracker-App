import { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

export default function AIAssistantPanel({ isOpen, onClose }) {
  const { tasks } = useTaskContext();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const generatePlan = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        setError('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Generate a weekly project plan based on these tasks: ${JSON.stringify(tasks)}
            
            Current date: ${new Date().toLocaleDateString()}
            
            Please provide:
            1. Daily breakdown for the next 7 days
            2. Priority recommendations
            3. Potential blockers or dependencies
            4. Time management suggestions
            
            Format as a clear, actionable list.`
          }],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setSuggestions(data.choices[0].message.content.split('\n').filter(line => line.trim()));
      } else {
        setError('Invalid response from AI service');
      }
    } catch (error) {
      console.error('AI Error:', error);
      setError(`Failed to generate plan: ${error.message}`);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 border-l border-gray-200 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">AI Assistant</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>
      
      <div className="mb-6">
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

      <div className="mb-6">
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

      <div className="mb-6">
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

      <button 
        onClick={generatePlan}
        className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Weekly Plan'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-3 text-gray-700">AI Suggestions:</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
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