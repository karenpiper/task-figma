import React, { useState } from 'react';
import { X, Plus, Calendar, User, Tag } from 'lucide-react';
import { MGMTCard } from './MGMTCard';
import { MGMTBadge } from './MGMTBadge';

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    status: string;
    statusColor: string;
    userIcon: string;
    time: string;
    comments: number;
  }) => void;
  columnTitle?: string;
  subCategoryTitle?: string;
}

export function AddTaskDialog({ 
  isOpen, 
  onClose, 
  onAddTask, 
  columnTitle,
  subCategoryTitle 
}: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('MEDIUM');
  const [statusColor, setStatusColor] = useState('yellow');
  const [time, setTime] = useState('30 min');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: 'LOW', label: 'Low', color: 'lime' },
    { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
    { value: 'HIGH', label: 'High', color: 'pink' },
    { value: 'URGENT', label: 'Urgent', color: 'purple' },
  ];

  const timeOptions = [
    '15 min',
    '30 min',
    '1 hour',
    '2 hours',
    '4 hours',
    '1 day',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎯 AddTaskDialog handleSubmit called');
    
    if (!title.trim()) {
      console.log('❌ Title is empty, not submitting');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      statusColor,
      userIcon: 'Normal',
      time,
      comments: 0,
    };
    
    console.log('✅ Submitting task data:', taskData);
    onAddTask(taskData);

    // Reset form
    setTitle('');
    setDescription('');
    setStatus('MEDIUM');
    setStatusColor('yellow');
    setTime('30 min');
    setShowAdvanced(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <MGMTCard 
          backgroundColor="#ffffff"
          size="lg"
          blob={{
            color: '#c7b3e5',
            variant: 1,
            position: 'top-right'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-900 font-semibold">Add New Task</h2>
              {columnTitle && (
                <p className="text-sm text-gray-500">
                  {subCategoryTitle ? `${columnTitle} → ${subCategoryTitle}` : columnTitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-mgmt-pink/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="mgmt-input w-full px-4 py-3 bg-gray-50 border-gray-200 focus:border-mgmt-green"
                required
                autoFocus
              />
            </div>

            {/* Description - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="mgmt-input w-full px-4 py-3 bg-gray-50 border-gray-200 focus:border-mgmt-green resize-none"
              />
            </div>

            {/* Advanced Options Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-mgmt-purple hover:text-mgmt-purple/80 transition-colors"
            >
              <Tag className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} additional details
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatus(option.value);
                          setStatusColor(option.color);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          status === option.value
                            ? `bg-mgmt-${option.color} text-gray-800`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Estimate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Estimate
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {timeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTime(option)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          time === option
                            ? 'bg-mgmt-green text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 mgmt-button bg-mgmt-green text-white hover:bg-mgmt-sage disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </form>
        </MGMTCard>
      </div>
    </div>
  );
}