import React, { useState } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { TaskColumn } from './TaskColumn';
import { Button } from './ui/button';

interface KanbanBoardProps {
  onTaskComplete?: () => void;
}

export function KanbanBoard({ onTaskComplete }: KanbanBoardProps) {
  const [columns] = useState([
    {
      id: 'uncategorized',
      title: 'Uncategorized',
      count: 6,
      color: 'from-slate-400 to-slate-500',
      tasks: [
        {
          id: '1',
          title: 'Quick email check',
          description: 'Review and respond to urgent emails',
          priority: 'medium',
          status: 'STANDING TASKS',
          category: 'Standing Tasks',
          labels: ['Email']
        },
        {
          id: '2',
          title: 'Weekly team sync',
          description: 'Discuss progress and blockers with team',
          priority: 'high',
          status: 'COMMS',
          category: 'Comms',
          labels: ['Meeting', 'Team']
        },
        {
          id: '3',
          title: 'Review quarterly goals',
          description: 'Analyze Q1 performance and set Q2 objectives',
          priority: 'high',
          status: 'BIG TASKS',
          category: 'Big Tasks',
          labels: ['Strategic', 'Planning']
        },
        {
          id: '4',
          title: 'Update project documentation',
          description: 'Refresh README and API docs',
          priority: 'low',
          status: 'STANDING TASKS',
          category: 'Standing Tasks',
          labels: ['Documentation']
        },
        {
          id: '5',
          title: 'Client presentation prep',
          description: 'Prepare slides for quarterly business review',
          priority: 'high',
          status: 'BIG TASKS',
          category: 'Big Tasks',
          labels: ['Presentation', 'Client']
        },
        {
          id: '6',
          title: 'Schedule 1:1s',
          description: 'Book monthly 1:1 meetings with direct reports',
          priority: 'medium',
          status: 'COMMS',
          category: 'Comms',
          labels: ['Meeting', 'Management']
        }
      ]
    },
    {
      id: 'today',
      title: 'Friday (Today)',
      count: 4,
      color: 'from-blue-400 to-indigo-500',
      tasks: [
        {
          id: '7',
          title: 'Daily standup',
          description: 'Share updates and discuss blockers',
          priority: 'medium',
          status: 'STANDING TASKS',
          category: 'Standing Tasks',
          labels: ['Meeting', 'Daily']
        },
        {
          id: '8',
          title: 'Code review',
          description: 'Review PR for new feature implementation',
          priority: 'high',
          status: 'BIG TASKS',
          category: 'Big Tasks',
          labels: ['Development', 'Review']
        },
        {
          id: '9',
          title: 'Send project update',
          description: 'Email stakeholders with weekly progress',
          priority: 'medium',
          status: 'COMMS',
          category: 'Comms',
          labels: ['Email', 'Update']
        },
        {
          id: '10',
          title: 'Deploy to staging',
          description: 'Push latest changes to staging environment',
          priority: 'high',
          status: 'BIG TASKS',
          category: 'Big Tasks',
          labels: ['Development', 'Deploy']
        }
      ]
    },
    {
      id: 'blocked',
      title: 'Blocked',
      count: 3,
      color: 'from-red-400 to-red-500',
      tasks: [
        {
          id: '11',
          title: 'Design system updates',
          description: 'Waiting for design team approval on component updates',
          priority: 'medium',
          status: 'BLOCKED',
          category: 'Sarah Johnson',
          labels: ['Design', 'Components'],
          assignees: [
            { name: 'Sarah Johnson', avatar: 'SJ', color: 'bg-blue-500' }
          ]
        },
        {
          id: '12',
          title: 'API integration',
          description: 'Need backend endpoint implementation',
          priority: 'high',
          status: 'BLOCKED',
          category: 'Mike Chen',
          labels: ['API', 'Backend'],
          assignees: [
            { name: 'Mike Chen', avatar: 'MC', color: 'bg-green-500' }
          ]
        },
        {
          id: '13',
          title: 'Security audit',
          description: 'Waiting for security team review',
          priority: 'high',
          status: 'BLOCKED',
          category: 'Alex Rivera',
          labels: ['Security', 'Audit'],
          assignees: [
            { name: 'Alex Rivera', avatar: 'AR', color: 'bg-purple-500' }
          ]
        }
      ]
    },
    {
      id: 'later',
      title: 'Later',
      count: 5,
      color: 'from-purple-400 to-purple-500',
      tasks: [
        {
          id: '14',
          title: 'Backup system check',
          description: 'Verify all backup systems are functioning',
          priority: 'low',
          status: 'STANDING TASKS',
          category: 'Standing Tasks',
          labels: ['Maintenance', 'Systems']
        },
        {
          id: '15',
          title: 'Team building event',
          description: 'Plan and organize quarterly team event',
          priority: 'medium',
          status: 'COMMS',
          category: 'Comms',
          labels: ['Team', 'Event']
        },
        {
          id: '16',
          title: 'Performance optimization',
          description: 'Analyze and improve application performance',
          priority: 'medium',
          status: 'BIG TASKS',
          category: 'Big Tasks',
          labels: ['Performance', 'Optimization']
        },
        {
          id: '17',
          title: 'Research new tools',
          description: 'Evaluate productivity and collaboration tools',
          priority: 'low',
          status: 'BIG TASKS',
          category: 'Big Tasks',
          labels: ['Research', 'Tools']
        },
        {
          id: '18',
          title: 'Update team handbook',
          description: 'Refresh company policies and procedures',
          priority: 'low',
          status: 'COMMS',
          category: 'Comms',
          labels: ['Documentation', 'Policy']
        }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      count: 4,
      color: 'from-emerald-400 to-green-500',
      tasks: [
        {
          id: '19',
          title: 'Monthly report',
          description: 'Completed and sent to stakeholders',
          priority: 'high',
          status: 'DONE',
          category: 'Done',
          labels: ['Report', 'Monthly']
        },
        {
          id: '20',
          title: 'Team feedback session',
          description: 'Gathered and processed team feedback',
          priority: 'medium',
          status: 'DONE',
          category: 'Done',
          labels: ['Feedback', 'Team']
        },
        {
          id: '21',
          title: 'Bug fixes',
          description: 'Resolved critical issues from last sprint',
          priority: 'high',
          status: 'DONE',
          category: 'Done',
          labels: ['Bugs', 'Development']
        },
        {
          id: '22',
          title: 'Onboarding materials',
          description: 'Updated new hire documentation',
          priority: 'medium',
          status: 'DONE',
          category: 'Done',
          labels: ['Onboarding', 'HR']
        }
      ]
    }
  ]);

  return (
    <div className="flex-1 p-8 overflow-x-auto">
      {/* Glass background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      
      <div className="relative z-10 flex gap-6 min-w-max pb-8">
        {columns.map((column) => (
          <TaskColumn key={column.id} column={column} onTaskComplete={onTaskComplete} />
        ))}
        
        {/* Add Column Button */}
        <div className="w-80 flex-shrink-0">
          <div className="h-full min-h-[600px] rounded-3xl border-2 border-dashed border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center group cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-200">
                <Plus className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-medium text-slate-600 mb-2">Add Column</h3>
              <p className="text-sm text-slate-500">Create a new task column</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}