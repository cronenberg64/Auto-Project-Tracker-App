import { useTaskContext } from '../hooks/useTaskContext';

export const ProjectDashboard = () => {
  const { tasks } = useTaskContext();

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const backlog = tasks.filter(t => t.status === 'Backlog').length;
    const review = tasks.filter(t => t.status === 'Review').length;
    
    const today = new Date().toISOString().split('T')[0];
    const dueToday = tasks.filter(t => t.end === today && t.status !== 'Done').length;
    const overdue = tasks.filter(t => new Date(t.end) < new Date() && t.status !== 'Done').length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      inProgress,
      backlog,
      review,
      dueToday,
      overdue,
      completionRate
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'text-green-600';
      case 'In Progress': return 'text-yellow-600';
      case 'Review': return 'text-blue-600';
      case 'Backlog': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-yellow-500';
    if (rate >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const stats = getStats();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Total Tasks</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-green-800">Completed</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          <div className="text-sm text-yellow-800">In Progress</div>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-red-800">Overdue</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Completion Rate</span>
          <span className="text-sm font-medium text-gray-700">{stats.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(stats.completionRate)}`}
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Task Status</h3>
          <div className="space-y-2">
            {[
              { status: 'Done', count: stats.completed, color: 'bg-green-100' },
              { status: 'In Progress', count: stats.inProgress, color: 'bg-yellow-100' },
              { status: 'Review', count: stats.review, color: 'bg-blue-100' },
              { status: 'Backlog', count: stats.backlog, color: 'bg-gray-100' }
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between p-2 rounded">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-700">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Due Today</div>
              <div className="text-lg font-bold text-blue-600">{stats.dueToday} tasks</div>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-sm font-medium text-orange-800">Overdue</div>
              <div className="text-lg font-bold text-orange-600">{stats.overdue} tasks</div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-800">In Review</div>
              <div className="text-lg font-bold text-purple-600">{stats.review} tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(stats.overdue > 0 || stats.dueToday > 0) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Attention Needed</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {stats.overdue > 0 && (
              <li>• {stats.overdue} task{stats.overdue > 1 ? 's' : ''} overdue</li>
            )}
            {stats.dueToday > 0 && (
              <li>• {stats.dueToday} task{stats.dueToday > 1 ? 's' : ''} due today</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}; 