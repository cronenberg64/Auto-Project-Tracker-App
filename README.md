# AI-Powered Project Tracker App

A React-based project management application with natural language task input, Kanban board, Gantt chart timeline, and AI-powered planning assistance.

## Features

### ✅ Implemented
- **Natural Language Task Input**: Type tasks with deadlines like "Finish design by Friday"
- **Kanban Board**: Drag & drop task management with 4 columns (Backlog, In Progress, Review, Done)
- **Gantt Chart Timeline**: Visual project timeline with task dependencies
- **localStorage Persistence**: Automatic save/load of project data
- **AI Assistant Panel**: Advanced AI-powered planning and analysis
- **Project Dashboard**: Real-time statistics and progress tracking
- **Task Management**: Edit, delete, and create tasks with detailed forms
- **Multiple View Modes**: Dashboard, Kanban Board, and Timeline views
- **Responsive Design**: Works on desktop and mobile devices

### 🔧 Core Technologies
- React 18 with Hooks
- Tailwind CSS for styling
- react-beautiful-dnd for drag & drop
- frappe-gantt for timeline visualization
- chrono-node for natural language date parsing
- OpenAI API for AI planning assistance

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup OpenAI API (Optional)
For AI assistant features, create a `.env` file in the root directory:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### Adding Tasks
1. **Natural Language Input**: Type tasks with deadlines in the header input field
   - "Design homepage by Friday"
   - "Setup database next Monday"
   - "Review code by end of week"

2. **Create Task Modal**: Click "+ Add Task" for advanced task creation
   - Natural language parsing
   - Manual form entry
   - Status and date selection

### Managing Tasks
- **Drag & Drop**: Move tasks between columns on the Kanban board
- **Quick Edit**: Click the edit icon (✏️) for inline editing
- **Detailed Edit**: Click on any task to open the detailed edit modal
- **Delete Tasks**: Click the delete icon (🗑️) to remove tasks

### View Modes
- **Dashboard**: Project statistics, progress tracking, and alerts
- **Kanban Board**: Traditional drag & drop task management
- **Timeline**: Gantt chart visualization of project timeline

### AI Assistant Features
- **Weekly Planning**: Generate comprehensive weekly plans
- **Project Analysis**: Get project health scores and insights
- **Task Suggestions**: AI-powered task recommendations
- **Real-time Alerts**: Due today, overdue, and upcoming tasks

## Project Structure

```
src/
├── components/
│   ├── AIAssistantPanel.jsx    # Enhanced AI planning assistant
│   ├── CreateTaskModal.jsx      # Advanced task creation modal
│   ├── GanttChart.jsx          # Timeline visualization
│   ├── KanbanBoard.jsx         # Drag & drop board with editing
│   ├── ProjectDashboard.jsx    # Project statistics dashboard
│   └── TaskDetailsModal.jsx    # Detailed task editing modal
├── contexts/
│   └── TaskContext.jsx         # Task state management
├── hooks/
│   └── useTaskContext.js       # Custom hook for tasks
└── App.jsx                     # Main application component
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Key Components

#### Enhanced AI Assistant
Three analysis modes:
- **Weekly Plan**: Daily breakdown, priorities, risk assessment
- **Project Analysis**: Health scoring, bottleneck identification
- **Task Suggestions**: Missing tasks, dependencies, QA tasks

#### Task Management
- **Inline Editing**: Quick title changes with keyboard shortcuts
- **Modal Editing**: Full task details with date pickers
- **Natural Language**: Advanced date parsing with chrono-node
- **Bulk Operations**: Save/load entire projects

#### Project Dashboard
- **Real-time Stats**: Completion rates, task distribution
- **Progress Tracking**: Visual progress bars and metrics
- **Alert System**: Overdue and due today notifications
- **Quick Actions**: One-click access to key metrics

## AI Integration Features

### Advanced Prompts
The AI assistant uses sophisticated prompts for:
- **Contextual Analysis**: Project statistics and task relationships
- **Risk Assessment**: Timeline risks and dependency analysis
- **Resource Optimization**: Time allocation and priority recommendations
- **Actionable Insights**: Specific, implementable recommendations

### Error Handling
- **API Key Validation**: Clear error messages for missing keys
- **Network Resilience**: Graceful handling of API failures
- **User Feedback**: Loading states and error notifications
- **Fallback Options**: Manual task creation when AI is unavailable

## Future Enhancements

- [ ] Task categories and labels
- [ ] Team collaboration features
- [ ] Advanced Gantt dependencies
- [ ] Export to PDF/CSV
- [ ] Dark mode theme
- [ ] Mobile app version
- [ ] Real-time collaboration
- [ ] Advanced reporting

## Troubleshooting

### Common Issues

1. **AI Assistant not working**
   - Check if `.env` file exists with `VITE_OPENAI_API_KEY`
   - Verify API key is valid and has credits
   - Check browser console for network errors

2. **Gantt chart not rendering**
   - Ensure tasks have valid start/end dates
   - Check browser console for errors
   - Try refreshing the page

3. **Drag & drop not working**
   - Ensure you're using a modern browser
   - Check if JavaScript is enabled
   - Try clicking and dragging from the task title

4. **Task editing issues**
   - Use Enter to save, Escape to cancel
   - Click outside the edit area to cancel
   - Check that task titles are not empty

### Performance Tips

- Large projects (>100 tasks) may slow down the Gantt chart
- Consider using task categories to organize large projects
- The AI assistant works best with 10-50 tasks
- Use the dashboard view for project overview

### API Usage

The AI features use OpenAI's GPT-3.5-turbo model:
- **Weekly Plan**: ~800 tokens per request
- **Project Analysis**: ~600 tokens per request  
- **Task Suggestions**: ~500 tokens per request

Estimated cost: $0.002-0.005 per analysis session

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code quality
5. Submit a pull request

## License

MIT License - see LICENSE file for details
