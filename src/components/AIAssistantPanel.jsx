import { useState, useEffect } from 'react';

export default function AIAssistantPanel({ tasks, isOpen, onClose }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.end === today && t.status !== 'Done');
  };

  const getOverdue = () => {
    const today = new Date();
    return tasks.filter(t => new Date(t.end) < today && t.status !== 'Done');
  };

  const generatePlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Generate weekly plan based on these tasks: ${JSON.stringify(tasks)}
            Include daily breakdown and priority alerts. Current date: ${new Date().toLocaleDateString()}»
          `
          }]
        })
      });
      const data = await response.json();
      setSuggestions(data.choices[0].message.content.split('\n'));
    } catch (error) {
      console.error('AI Error:', error);
      setSuggestions(['Failed to generate plan. Check API connection.']);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 border-l">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">AI Assistant</h2>
        <button onClick={onClose} className="text-gray-500">×</button>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Due Today ({getDueToday().length})</h3>
        <ul className="list-disc pl-4 text-sm">
          {getDueToday().map(t => <li key={t.id}>{t.title}</li>)}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2 text-red-600">Overdue ({getOverdue().length})</h3>
        <ul className="list-disc pl-4 text-sm">
          {getOverdue().map(t => <li key={t.id}>{t.title}</li>)}
        </ul>
      </div>

      <button 
        onClick={generatePlan}
        className="w-full bg-purple-500 text-white p-2 rounded disabled:bg-gray-300"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Weekly Plan'}
      </button>

      {suggestions.length > 0 && (
        <div className="mt-4 text-sm">
          <h3 className="font-medium mb-2">Suggestions:</h3>
          <ul className="space-y-1">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}