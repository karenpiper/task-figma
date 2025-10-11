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
      title: 'Uncategorized',
      taskCount: 3,
      hours: 2,
      tasks: [
        {
          title: 'Review project requirements',
          description: 'Go through the project brief and identify key deliverables and deadlines...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'Normal',
          time: '30 min',
          comments: 1,
        },
        {
          title: 'Set up development environment',
          description: 'Install necessary tools and configure the workspace for the project...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'High',
          time: '45 min',
          comments: 2,
        },
        {
          title: 'Create project timeline',
          description: 'Break down the project into phases and create a realistic timeline...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'Urgent',
          time: '60 min',
          comments: 0,
        },
      ],
    },
    {
      title: 'Today',
      taskCount: 4,
      hours: 3,
      tasks: [
        {
          title: 'Complete user research',
          description: 'Conduct interviews with target users to understand their needs and pain points...',
          status: 'PROGRESS',
          statusColor: 'orange',
          userIcon: 'High',
          time: '90 min',
          comments: 3,
        },
        {
          title: 'Design wireframes',
          description: 'Create low-fidelity wireframes for the main user flows...',
          status: 'PROGRESS',
          statusColor: 'orange',
          userIcon: 'Urgent',
          time: '120 min',
          comments: 1,
        },
        {
          title: 'Review competitor analysis',
          description: 'Analyze similar products in the market and identify opportunities...',
          status: 'DONE',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '60 min',
          comments: 2,
        },
        {
          title: 'Update project documentation',
          description: 'Document findings and decisions made during the research phase...',
          status: 'DONE',
          statusColor: 'teal',
          userIcon: 'High',
          time: '30 min',
          comments: 1,
        },
      ],
    },
    {
      title: 'Personal',
      taskCount: 2,
      hours: 1,
      tasks: [
        {
          title: 'Update personal portfolio',
          description: 'Add recent projects and update skills section on personal website...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'Normal',
          time: '45 min',
          comments: 0,
        },
        {
          title: 'Learn new design tool',
          description: 'Complete online course for the latest design software features...',
          status: 'PROGRESS',
          statusColor: 'orange',
          userIcon: 'High',
          time: '60 min',
          comments: 1,
        },
      ],
    },
    {
      title: 'Follow-Up',
      taskCount: 3,
      hours: 2,
      tasks: [
        {
          title: 'Follow up with client feedback',
          description: 'Send revised mockups to client and schedule feedback session...',
          status: 'REVIEW',
          statusColor: 'purple',
          userIcon: 'Urgent',
          time: '30 min',
          comments: 4,
        },
        {
          title: 'Check in with team members',
          description: 'Schedule one-on-one meetings with team members to discuss progress...',
          status: 'REVIEW',
          statusColor: 'purple',
          userIcon: 'High',
          time: '45 min',
          comments: 2,
        },
        {
          title: 'Review budget allocation',
          description: 'Analyze current spending and adjust budget for remaining phases...',
          status: 'DONE',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '30 min',
          comments: 1,
        },
      ],
    },
    {
      title: 'Later',
      taskCount: 2,
      hours: 1,
      tasks: [
        {
          title: 'Plan team building activity',
          description: 'Research and organize a team building event for next quarter...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'Normal',
          time: '60 min',
          comments: 0,
        },
        {
          title: 'Update company handbook',
          description: 'Review and update internal documentation and processes...',
          status: 'TO DO',
          statusColor: 'gray',
          userIcon: 'High',
          time: '90 min',
          comments: 1,
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