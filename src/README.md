# Premium Kanban Productivity Dashboard

A beautiful, inspiring productivity tool with glass morphism design, gamification features, and advanced task organization. Built to motivate daily use through stunning visuals and smooth interactions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4+-blue.svg)

## ✨ Features

### 🎯 Advanced Task Management
- **Categorized Kanban Board**: Tasks organized into categories within columns
  - Regular columns: "Standing Tasks", "Comms", "Big Tasks", "Done"
  - Blocked column: Dynamic people-based categories (e.g., "Sarah Johnson", "Mike Chen")
- **Drag & Drop**: Smooth task movement between categories and columns
- **Smart Organization**: Collapsible categories with task counts and progress indicators

### 🎨 Premium Glass Morphism Design
- **Dynamic Ambient Lighting**: Time-based color themes that change throughout the day
- **Glass Panels**: Translucent backgrounds with backdrop blur effects
- **Sophisticated Layering**: Multi-level depth with subtle shadows and glows
- **Responsive Animations**: Smooth micro-interactions and hover states

### 🏆 Gamification & Motivation
- **Achievement System**: 6 different achievements with progress tracking
- **Particle Celebrations**: 50+ colorful particles for task completions
- **Focus Zone**: Daily progress tracking with breathing animations
- **Streak Counters**: Maintain productivity momentum
- **Inspirational Quotes**: Rotating motivational content

### 🌈 Dynamic Experience
- **Time-Based Themes**: 5 ambient lighting modes (Dawn, Morning, Afternoon, Evening, Night)
- **Floating Orbs**: Animated background elements with pulse effects
- **Progress Visualization**: Circular progress rings and completion metrics
- **Real-time Stats**: Live updates on task completion and focus time

## 🛠 Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Animations**: Motion/React (Framer Motion)
- **Drag & Drop**: react-dnd with HTML5 backend
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Build Tool**: Vite (inferred from modern setup)

## 📦 Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd kanban-productivity-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗 Project Structure

```
├── App.tsx                 # Main application component
├── components/
│   ├── AchievementSystem.tsx    # Gamification achievements
│   ├── AmbientLighting.tsx      # Dynamic background themes
│   ├── FocusZone.tsx           # Progress tracking widget
│   ├── Header.tsx              # Top navigation
│   ├── KanbanBoard.tsx         # Main kanban container
│   ├── ParticleSystem.tsx      # Celebration animations
│   ├── Sidebar.tsx             # Left navigation panel
│   ├── TaskCard.tsx            # Individual task component
│   ├── TaskCategory.tsx        # Category sections within columns
│   ├── TaskColumn.tsx          # Kanban columns
│   ├── AddPersonCategory.tsx   # Add people to blocked column
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/                     # shadcn/ui components
├── styles/
│   └── globals.css             # Tailwind v4 configuration
└── guidelines/
    └── Guidelines.md           # Development guidelines
```

## 🎨 Design System

### Color Palette
- **Glass Whites**: `bg-white/20`, `bg-white/30`, `bg-white/40`
- **Blues**: `from-blue-400 to-indigo-500`
- **Purples**: `from-purple-400 to-purple-500`
- **Greens**: `from-emerald-400 to-green-500`
- **Reds**: `from-red-400 to-red-500`

### Typography
- **Base Font Size**: 14px
- **Headings**: Medium weight (500) with 1.5 line height
- **Body Text**: Normal weight (400) with 1.5 line height

### Glass Morphism Elements
- **Panels**: `backdrop-blur-xl` with `border border-white/30`
- **Hover States**: Increased opacity and border brightness
- **Shadows**: `shadow-xl` with soft glows
- **Rounded Corners**: `rounded-2xl` to `rounded-3xl`

## 🚀 Usage

### Task Organization
1. **Add Tasks**: Click "Add task" buttons within categories
2. **Move Tasks**: Drag and drop between categories and columns
3. **Complete Tasks**: Use the green complete button for celebrations
4. **Block Tasks**: Add people names in the Blocked column

### Focus & Productivity
1. **Track Progress**: Monitor daily completion in the Focus Zone
2. **Earn Achievements**: Complete milestones to unlock rewards
3. **Maintain Streaks**: Build consistent productivity habits
4. **Celebrate Wins**: Enjoy particle animations for completions

### Customization
1. **Add People**: Create custom categories in Blocked column
2. **Collapse Categories**: Hide/show sections as needed
3. **Time Themes**: Automatic ambient lighting based on time of day

## 🎯 Component Overview

### Core Components
- **KanbanBoard**: Main task management interface
- **TaskColumn**: Individual kanban columns with category support
- **TaskCategory**: Collapsible sections within columns
- **TaskCard**: Individual task items with drag/drop

### Enhancement Components
- **AchievementSystem**: Gamification and progress tracking
- **FocusZone**: Daily metrics and motivational content
- **ParticleSystem**: Celebration animations
- **AmbientLighting**: Dynamic background theming

### Utility Components
- **AddPersonCategory**: Interface for adding people to blocked tasks
- **Sidebar**: Navigation and quick stats
- **Header**: Search and user profile

## 🌟 Key Features Detail

### Categorized Task Management
Tasks are organized into categories within each column:
- **Standing Tasks**: Recurring daily activities
- **Comms**: Communication and meeting tasks
- **Big Tasks**: Major projects and initiatives
- **Done**: Completed items
- **People Categories**: In blocked column only

### Dynamic Theming
Five time-based themes:
- **Dawn** (5-7am): Orange/pink gradients
- **Morning** (7am-12pm): Blue/cyan gradients
- **Afternoon** (12-5pm): Violet/blue gradients
- **Evening** (5-9pm): Purple/indigo gradients
- **Night** (9pm-5am): Slate/indigo gradients

### Achievement System
Six unlockable achievements:
- **Streak Master**: 7-day productivity streak
- **Focus Champion**: 50 hours of focus time
- **Task Crusher**: Complete 100 tasks
- **Early Bird**: 5 days starting before 7am
- **Perfectionist**: 7 days at 100% completion
- **Productivity Legend**: 30-day streak

## 🔧 Development Guidelines

- **Glass Morphism**: Maintain translucent backgrounds with backdrop blur
- **Responsive Design**: Use flexbox and grid layouts
- **Clean Code**: Refactor and keep components modular
- **Typography**: Preserve base font settings unless explicitly changing
- **Animations**: Smooth transitions with meaningful micro-interactions

## 🚀 Future Enhancements

- **Supabase Integration**: Backend data persistence and sync
- **User Authentication**: Personal accounts and data security
- **Team Collaboration**: Shared boards and real-time updates
- **Mobile App**: React Native version for iOS/Android
- **Advanced Analytics**: Detailed productivity insights
- **Custom Themes**: User-defined color schemes
- **Calendar Integration**: Sync with external calendar apps
- **Task Templates**: Pre-defined task structures

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the guidelines in `guidelines/Guidelines.md`
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first styling approach
- **Lucide** for the comprehensive icon set
- **Motion** for smooth animations and transitions

---

Built with ❤️ for productivity enthusiasts who believe beautiful tools inspire better work.