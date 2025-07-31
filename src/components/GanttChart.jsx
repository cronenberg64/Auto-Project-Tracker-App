import { useEffect, useRef } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import Gantt from 'frappe-gantt';

export const GanttChart = () => {
  const { tasks } = useTaskContext();
  const ganttRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && tasks.length > 0) {
      // Clear previous chart
      svgRef.current.innerHTML = '';
      
      const formattedTasks = tasks.map(task => ({
        id: task.id,
        name: task.title,
        start: task.start,
        end: task.end,
        progress: task.status === 'Done' ? 100 : task.status === 'In Progress' ? 50 : 20,
        dependencies: '',
        custom_class: task.status.replace(/\s/g, '-').toLowerCase(),
      }));

      try {
        new Gantt(svgRef.current, formattedTasks, {
          header_height: 50,
          column_width: 30,
          step: 24,
          view_modes: ['Day', 'Week', 'Month'],
          bar_height: 20,
          bar_corner_radius: 3,
          padding: 18,
          view_mode: 'Week',
          date_format: 'YYYY-MM-DD',
          custom_popup_html: null,
          language: 'en'
        });
      } catch (error) {
        console.error('Error rendering Gantt chart:', error);
      }
    }
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Timeline</h2>
        <div className="text-gray-400 text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p>No tasks to display in timeline</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm" ref={ganttRef}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Timeline</h2>
      <svg ref={svgRef} className="w-full" />
    </div>
  );
};