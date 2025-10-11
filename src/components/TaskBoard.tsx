import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { TaskCard } from './TaskCard';

interface Task {
  title: string;
  description: string;
  status: string;
  statusColor: string;
  userIcon: string;
  time: string;
  comments: number;
  hasGradient?: boolean;
}

interface Column {
  title: string;
  taskCount: number;
  hours: number;
  tasks: Task[];
}

export function TaskBoard() {
  const columns: Column[] = [
    {
      title: 'Concept',
      taskCount: 5,
      hours: 4,
      tasks: [
        {
          title: 'Define Goals and Objectives',
          description: 'Clearly outline the purpose of the website, its target audience, and key...',
          status: 'PROGRESS',
          statusColor: 'orange',
          userIcon: 'Urgent',
          time: '30 min',
          comments: 2,
        },
        {
          title: 'Create User Personas',
          description: 'Develop fictional representations of your target audience, considering...',
          status: 'PROGRESS',
          statusColor: 'orange',
          userIcon: 'Urgent',
          time: '30 min',
          comments: 1,
        },
        {
          title: 'Conduct Market Research',
          description: 'Analyze competitors\' websites, identify industry best practices, and...',
          status: 'DONE',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '65 min',
          comments: 3,
        },
      ],
    },
    {
      title: 'Wireframe',
      taskCount: 5,
      hours: 4,
      tasks: [
        {
          title: 'Sketch Initial Wireframes',
          description: 'Create rough sketches of page layouts and interface components...',
          status: 'PROGRESS',
          statusColor: 'orange',
          userIcon: 'High',
          time: '90 min',
          comments: 2,
        },
        {
          title: 'Review Accessibility Guidelines',
          description: 'Ensure wireframes adhere to accessibility standards, such as providing...',
          status: 'REVIEW',
          statusColor: 'purple',
          userIcon: 'High',
          time: '90 min',
          comments: 4,
        },
        {
          title: 'Gather Feedback',
          description: 'Share wireframes with stakeholders and gather feedback to refine the layout.',
          status: 'REVIEW',
          statusColor: 'purple',
          userIcon: 'Normal',
          time: '30 min',
          comments: 1,
          hasGradient: true,
        },
        {
          title: 'Create Mobile Versions',
          description: 'Adapt wireframes for mobile devices, considering responsive design principles.',
          status: 'DONE',
          statusColor: 'teal',
          userIcon: 'High',
          time: '60 min',
          comments: 3,
        },
        {
          title: 'Finalize Wireframes',
          description: 'Review and finalize wireframes before moving to the design phase, ensuring all...',
          status: 'DONE',
          statusColor: 'teal',
          userIcon: 'High',
          time: '60 min',
          comments: 1,
        },
      ],
    },
    {
      title: 'Design',
      taskCount: 5,
      hours: 6,
      tasks: [
        {
          title: 'Design Style Guide',
          description: 'Develop a comprehensive style guide that includes color palette, typography...',
          status: 'PROGRESS',
          statusColor: 'orange',
          userIcon: 'High',
          time: '90 min',
          comments: 2,
        },
        {
          title: 'Create Mood Board',
          description: 'Gather inspiration from various sources and build a specific mood for the design...',
          status: 'REVIEW',
          statusColor: 'purple',
          userIcon: 'High',
          time: '90 min',
          comments: 1,
          hasGradient: true,
        },
        {
          title: 'Iterative Design Reviews',
          description: 'Conduct regular design reviews with stakeholders to gather feedback.',
          status: 'REVIEW',
          statusColor: 'purple',
          userIcon: 'High',
          time: '90 min',
          comments: 5,
        },
        {
          title: 'Optimize for Accessibility',
          description: 'Ensure that design elements meet accessibility standards, including color...',
          status: 'DONE',
          statusColor: 'teal',
          userIcon: 'High',
          time: '90 min',
          comments: 1,
        },
        {
          title: 'Export Design Assets',
          description: 'Export design assets in various formats (PNG, SVG) for developers and web...',
          status: 'DONE',
          statusColor: 'teal',
          userIcon: 'High',
          time: '30 min',
          comments: 1,
        },
      ],
    },
    {
      title: 'Development',
      taskCount: 4,
      hours: 3,
      tasks: [
        {
          title: 'Implement Interactivity',
          description: 'Add interactive elements such as dropdown menus, sliders, and modals...',
          status: 'PROGRESS',
          statusColor: 'orange',
          userIcon: 'Urgent',
          time: '120 min',
          comments: 2,
        },
        {
          title: 'HTML/CSS Markup',
          description: 'Translate the finalized design mockups into HTML and CSS code, and ensuring...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'High',
          time: '20 min',
          comments: 6,
        },
        {
          title: 'Implement SEO Best Practices',
          description: 'Implement on-page SEO elements such as meta tags, headings, and structured...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'High',
          time: '30 min',
          comments: 1,
        },
        {
          title: 'Set Up Development Environment',
          description: 'Configure development tools and environments, including text editors, ver...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'Low',
          time: '30 min',
          comments: 3,
        },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="p-8">
        <div className="flex gap-6 min-w-max">
          {columns.map((column, index) => (
            <div key={index} className="w-80 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-gray-900">{column.title}</h2>
                  <p className="text-xs text-gray-500">
                    {column.taskCount} tasks, {column.hours} hours
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                {column.tasks.map((task, taskIndex) => (
                  <TaskCard key={taskIndex} {...task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
