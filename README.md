# AI-Powered Project Tracker App

A React-based project management application with natural language task input, Kanban board, Gantt chart timeline, and AI-powered planning assistance.

## Features

### ✅ Implemented
- **Natural Language Task Input**: Type tasks with deadlines like "Finish design by Friday"
- **Kanban Board**: Drag & drop task management with 4 columns (Backlog, In Progress, Review, Done)
- **Gantt Chart Timeline**: Visual project timeline with task dependencies
- **localStorage Persistence**: Automatic save/load of project data
- **AI Assistant Panel**: Weekly planning suggestions and task analysis
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
1. **Natural Language Input**: Type tasks with deadlines in the input field
   - "Design homepage by Friday"
   - "Setup database next Monday"
   - "Review code by end of week"

2. **Quick Add**: Click "Add Task" for a basic task

### Managing Tasks
- **Drag & Drop**: Move tasks between columns on the Kanban board
- **Timeline View**: Click "Preview Timeline" to see Gantt chart
- **Save/Load**: Use Save Project and Load Project buttons

### AI Assistant
- **Due Today**: Shows tasks due today
- **Overdue**: Highlights overdue tasks
- **Upcoming**: Shows tasks due this week
- **Weekly Plan**: Generate AI-powered planning suggestions

## Project Structure

```
src/
├── components/
│   ├── AIAssistantPanel.jsx    # AI planning assistant
│   ├── GanttChart.jsx          # Timeline visualization
│   └── KanbanBoard.jsx         # Drag & drop board
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

#### TaskContext
Manages global task state with functions for:
- `addTask(task)` - Add new task
- `updateTask(id, updates)` - Update existing task
- `moveTask(id, status)` - Move task between columns
- `deleteTask(id)` - Remove task
- `clearTasks()` - Clear all tasks

#### Natural Language Parsing
Uses `chrono-node` to parse dates from text:
- "by Friday" → Next Friday
- "next Monday" → Next Monday
- "end of week" → End of current week

#### AI Integration
OpenAI GPT-3.5-turbo for:
- Weekly planning suggestions
- Task prioritization
- Time management advice

## Future Enhancements

- [ ] Task editing and deletion
- [ ] Task categories and labels
- [ ] Team collaboration features
- [ ] Advanced Gantt dependencies
- [ ] Export to PDF/CSV
- [ ] Dark mode theme
- [ ] Mobile app version

## Troubleshooting

### Common Issues

1. **AI Assistant not working**
   - Check if `.env` file exists with `VITE_OPENAI_API_KEY`
   - Verify API key is valid and has credits

2. **Gantt chart not rendering**
   - Ensure tasks have valid start/end dates
   - Check browser console for errors

3. **Drag & drop not working**
   - Ensure you're using a modern browser
   - Check if JavaScript is enabled

### Performance Tips

- Large projects (>100 tasks) may slow down the Gantt chart
- Consider using task categories to organize large projects
- The AI assistant works best with 10-50 tasks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code quality
5. Submit a pull request

## License

MIT License - see LICENSE file for details
