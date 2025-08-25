
  # Premium Kanban Productivity Tool

  A beautiful, modern Kanban board application with database persistence, built with React, TypeScript, and SQLite.

  ## Features

  - **Minimal Task Cards**: Clean design showing only title, priority color, and project tag
  - **Drag & Drop**: Full drag and drop functionality between columns
  - **Database Storage**: SQLite database with Express backend for persistent task storage
  - **Collapsible Stats**: Right sidebar with focus tracking and achievements that can be collapsed
  - **Modern UI**: Glass morphism design with smooth animations
  - **Responsive**: Works on desktop and mobile devices

  ## Database Schema

  ### Tasks Table
  - `id`: Unique identifier (auto-increment)
  - `title`: Task title (required)
  - `priority`: Priority level (low/medium/high)
  - `project`: Project name (optional)
  - `column_id`: Which column the task belongs to
  - `created_at`: Creation timestamp
  - `updated_at`: Last update timestamp

  ### Columns Table
  - `id`: Column identifier
  - `title`: Column display name
  - `color`: Tailwind CSS gradient classes
  - `order_index`: Column ordering

  ## Setup Instructions

  ### Prerequisites
  - Node.js (v16 or higher)
  - npm or yarn

  ### Installation

  1. **Clone the repository**
     ```bash
     git clone <repository-url>
     cd task-figma-1
     ```

  2. **Install dependencies**
     ```bash
     npm install
     # or
     yarn install
     ```

  3. **Start the development server**
     ```bash
     npm run dev
     # or
     yarn dev
     ```

  This will start both the backend server (port 3001) and frontend (port 5173) concurrently.

  ### Database

  The SQLite database (`kanban.db`) will be automatically created in the `server/` directory when you first run the application. It comes pre-populated with:

  - 5 default columns (Uncategorized, Today, Blocked, Later, Completed)
  - Sample tasks to get you started

  ## API Endpoints

  ### Tasks
  - `GET /api/tasks` - Get all tasks
  - `POST /api/tasks` - Create new task
  - `PUT /api/tasks/:id` - Update task
  - `PATCH /api/tasks/:id/move` - Move task to different column
  - `DELETE /api/tasks/:id` - Delete task

  ### Columns
  - `GET /api/columns` - Get all columns
  - `GET /api/columns/:id/tasks` - Get tasks for specific column

  ### Board
  - `GET /api/board` - Get complete board data (columns with tasks)

  ## Usage

  ### Creating Tasks
  1. Click the "Add task" button in any column
  2. Fill in the task title (required)
  3. Select priority level
  4. Optionally add a project name
  5. Click "Create Task"

  ### Moving Tasks
  - Drag and drop tasks between columns
  - Tasks automatically update in the database
  - Visual feedback during drag operations

  ### Managing Tasks
  - Tasks are automatically saved to the database
  - All changes persist between sessions
  - Real-time updates across the interface

  ## Project Structure

  ```
  src/
  ├── components/          # React components
  │   ├── KanbanBoard.tsx # Main board component
  │   ├── TaskColumn.tsx  # Individual column
  │   ├── TaskCard.tsx    # Individual task card
  │   └── ui/             # Reusable UI components
  ├── hooks/              # Custom React hooks
  │   └── useTasks.ts     # Task management hook
  └── App.tsx             # Main application component

  server/
  ├── index.js            # Express server with SQLite
  └── kanban.db          # SQLite database (auto-created)
  ```

  ## Development

  ### Running Backend Only
  ```bash
  npm run server
  ```

  ### Running Frontend Only
  ```bash
  npm run client
  ```

  ### Building for Production
  ```bash
  npm run build
  ```

  ## Technologies Used

  - **Frontend**: React 18, TypeScript, Tailwind CSS
  - **Backend**: Express.js, SQLite3
  - **Database**: SQLite
  - **Drag & Drop**: React DnD
  - **UI Components**: Radix UI primitives
  - **Build Tool**: Vite

  ## Contributing

  1. Fork the repository
  2. Create a feature branch
  3. Make your changes
  4. Test thoroughly
  5. Submit a pull request

  ## License

  This project is licensed under the MIT License.
  