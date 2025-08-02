# AI Project Tracker

License: MIT React 18 Vite 4 Tailwind CSS Gemini API

**Live Demo:** [Coming Soon]

An AI-powered project management application that transforms natural language into actionable tasks, featuring a Kanban board, Gantt timeline, and intelligent planning assistance. Perfect for rapid project prototyping and team collaboration.

---

## Features

* **Natural Language Task Input**: Describe tasks in plain English with deadlines
* **Intelligent Kanban Board**: Drag & drop task management with smart status tracking
* **Gantt Timeline Visualization**: Visual project timeline with task dependencies
* **AI-Powered Planning**: Gemini AI assistant for weekly planning and project analysis
* **Real-time Dashboard**: Live statistics, progress tracking, and alerts
* **Advanced Task Management**: Edit, delete, and create tasks with detailed forms
* **Multiple View Modes**: Dashboard, Kanban Board, and Timeline views
* **Smart Notifications**: User feedback and status updates
* **Keyboard Shortcuts**: Quick access to common actions
* **Responsive Design**: Mobile-first design with touch support

## Tech Stack

* **Frontend**: React 18, Vite 4, TypeScript, Tailwind CSS
* **AI Integration**: Google Gemini API for intelligent planning
* **State Management**: React Context API with custom hooks
* **Drag & Drop**: react-beautiful-dnd for Kanban functionality
* **Timeline**: frappe-gantt for Gantt chart visualization
* **Date Parsing**: chrono-node for natural language date interpretation
* **Persistence**: localStorage for data persistence
* **Error Handling**: React Error Boundaries for graceful recovery

---

## Setup Instructions

### Prerequisites

* Node.js 18+
* npm 9+
* Google AI Studio API key

### Frontend Setup

```bash
git clone https://github.com/yourusername/Auto-Project-Tracker-App.git
cd Auto-Project-Tracker-App
npm install
cp .env.example .env
npm run dev
```

### Environment Variables

Set your environment variables in `.env`:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

For deployment (e.g., Netlify, Vercel), set these in your site environment variables.

---

## Usage

1. **Open the web interface** at `http://localhost:5173`
2. **Create tasks using natural language**:  
   ```
   "Design homepage by Friday"
   "Setup database next Monday"
   "Review code by end of week"
   ```
3. **Manage tasks** on the Kanban board with drag & drop
4. **View project timeline** in the Gantt chart
5. **Get AI insights** from the AI assistant panel

### Example Prompts

* "Design user interface by next Friday"
* "Setup authentication system by end of month"
* "Review pull requests by tomorrow"
* "Deploy to production by next Monday"

### AI Assistant Features

* **Weekly Planning**: Generate comprehensive weekly plans with daily breakdowns
* **Project Analysis**: Get project health scores and identify bottlenecks
* **Task Suggestions**: AI-powered recommendations for missing tasks
* **Real-time Alerts**: Due today, overdue, and upcoming tasks

---

## Project Structure

```
Auto-Project-Tracker-App/
├── src/
│   ├── components/           # React components
│   │   ├── AIAssistantPanel.jsx    # AI planning assistant
│   │   ├── CreateTaskModal.jsx      # Task creation modal
│   │   ├── ErrorBoundary.jsx        # Error handling
│   │   ├── GanttChart.jsx           # Timeline visualization
│   │   ├── HelpModal.jsx            # Help system
│   │   ├── KanbanBoard.jsx          # Drag & drop board
│   │   ├── LoadingSpinner.jsx       # Loading indicators
│   │   ├── Notification.jsx         # Notification system
│   │   ├── ProjectDashboard.jsx     # Statistics dashboard
│   │   ├── ResponsiveLayout.jsx     # Mobile optimization
│   │   ├── TaskCard.jsx             # Individual task cards
│   │   └── TaskDetailsModal.jsx     # Task editing modal
│   ├── contexts/            # React Context
│   │   └── TaskContext.jsx          # Global state management
│   ├── hooks/               # Custom React hooks
│   │   ├── useKeyboardShortcuts.js  # Keyboard shortcuts
│   │   └── useTaskContext.js        # Context consumer
│   ├── utils/               # Utility functions
│   │   └── testUtils.js             # Testing utilities
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
└── docs/                    # Documentation
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

* Follow React best practices and hooks patterns
* Write comprehensive tests for new features
* Update documentation for new features
* Ensure mobile responsiveness
* Maintain accessibility standards

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgements

* **React** - JavaScript library for building user interfaces
* **Vite** - Next generation frontend tooling
* **Tailwind CSS** - Utility-first CSS framework
* **Google Gemini** - Natural language processing
* **react-beautiful-dnd** - Drag and drop for React
* **frappe-gantt** - Gantt chart library
* **chrono-node** - Natural language date parsing

---

## Deploying to Production

This project supports deployment on various platforms.

### Netlify Deployment

1. **Push your code to GitHub**
2. **Create a new site on Netlify**
3. **Connect your repository**
4. **Set the build command:**
   ```
   npm run build
   ```
5. **Set the publish directory:**
   ```
   dist
   ```
6. **Add your environment variables** in the Netlify dashboard
7. **Deploy!**

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```
2. **Deploy:**
   ```bash
   vercel
   ```

### GitHub Pages

1. **Add to package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
2. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## About

AI-powered project management tool that transforms natural language into actionable tasks with intelligent planning assistance.

### Resources

* [React Documentation](https://react.dev/)
* [Vite Documentation](https://vitejs.dev/)
* [Tailwind CSS Documentation](https://tailwindcss.com/)
* [Google AI Studio](https://makersuite.google.com/)

---

## Roadmap

* [ ] **Real-time Collaboration**: Multi-user editing and commenting
* [ ] **Advanced AI Features**: Task prioritization and time estimation
* [ ] **Integration APIs**: Connect with external project management tools
* [ ] **Mobile App**: Native iOS and Android applications
* [ ] **Offline Support**: PWA capabilities for offline usage
* [ ] **Advanced Analytics**: Detailed project insights and reporting
* [ ] **Custom Workflows**: User-defined task status and workflows
* [ ] **API Backend**: RESTful API for data persistence
* [ ] **Webhooks**: Real-time notifications and integrations
* [ ] **Multi-language Support**: Internationalization (i18n)

---

## Support

* **Issues**: [GitHub Issues](https://github.com/yourusername/Auto-Project-Tracker-App/issues)
* **Discussions**: [GitHub Discussions](https://github.com/yourusername/Auto-Project-Tracker-App/discussions)
* **Documentation**: [Wiki](https://github.com/yourusername/Auto-Project-Tracker-App/wiki)

---

## Changelog

### v1.0.0 (Current)
* ✅ Natural language task input
* ✅ Kanban board with drag & drop
* ✅ Gantt timeline visualization
* ✅ AI-powered planning assistant
* ✅ Real-time dashboard
* ✅ Mobile-responsive design
* ✅ Keyboard shortcuts
* ✅ Error boundaries and notifications
* ✅ Local storage persistence
* ✅ Help system and documentation
