import React, { useState } from 'react';
import { Dialog, DialogInput, DialogButton } from './ui/dialog';

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: { title: string; priority: string; project?: string }) => void;
  columnId: string;
  categoryId?: string;
}

export function AddTaskDialog({ isOpen, onClose, onSubmit, columnId, categoryId }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        priority,
        project: project.trim() || undefined
      });
      setTitle('');
      setPriority('medium');
      setProject('');
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setPriority('medium');
    setProject('');
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Task">
      <div className="space-y-4">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <DialogInput
            placeholder="Enter task title..."
            value={title}
            onChange={setTitle}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Project (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project (Optional)</label>
          <DialogInput
            placeholder="Enter project name..."
            value={project}
            onChange={setProject}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <DialogButton variant="primary" onClick={handleSubmit}>
            Add Task
          </DialogButton>
          <DialogButton variant="secondary" onClick={handleCancel}>
            Cancel
          </DialogButton>
        </div>
      </div>
    </Dialog>
  );
} 