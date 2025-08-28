import React, { useState } from 'react';
import { Dialog, DialogInput, DialogTextarea, DialogSelect, DialogButton } from './ui/dialog';

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: { 
    title: string; 
    detail?: string; 
    project?: string; 
    client?: string; 
    dueDate?: string; 
    notes?: string; 
    priority: string; 
  }) => void;
  columnId: string;
  categoryId?: string;
}

export function AddTaskDialog({ isOpen, onClose, onSubmit, columnId, categoryId }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('');
  const [client, setClient] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        detail: detail.trim() || undefined,
        priority,
        project: project.trim() || undefined,
        client: client.trim() || undefined,
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined
      });
      // Reset all fields
      setTitle('');
      setDetail('');
      setPriority('medium');
      setProject('');
      setClient('');
      setDueDate('');
      setNotes('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCancel = () => {
    // Reset all fields
    setTitle('');
    setDetail('');
    setPriority('medium');
    setProject('');
    setClient('');
    setDueDate('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Task">
      <div className="space-y-4">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
          <DialogInput
            placeholder="Enter task title..."
            value={title}
            onChange={setTitle}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Task Detail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detail</label>
          <DialogTextarea
            placeholder="Enter task description..."
            value={detail}
            onChange={setDetail}
            rows={3}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <DialogSelect
            value={priority}
            onChange={setPriority}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </DialogSelect>
        </div>

        {/* Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
          <DialogInput
            placeholder="Enter project name..."
            value={project}
            onChange={setProject}
          />
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
          <DialogInput
            placeholder="Enter client name..."
            value={client}
            onChange={setClient}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <DialogInput
            type="date"
            placeholder=""
            value={dueDate}
            onChange={setDueDate}
          />
        </div>

        {/* Notes/To Do List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes / To Do List</label>
          <DialogTextarea
            placeholder="Enter notes, checklist items, or to-do items..."
            value={notes}
            onChange={setNotes}
            rows={3}
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