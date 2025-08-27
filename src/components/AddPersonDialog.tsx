import React, { useState } from 'react';
import { Dialog, DialogInput, DialogButton } from './ui/dialog';

interface AddPersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (personData: { name: string; email?: string }) => void;
}

export function AddPersonDialog({ isOpen, onClose, onSubmit }: AddPersonDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        email: email.trim() || undefined
      });
      setName('');
      setEmail('');
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Person">
      <div className="space-y-4">
        {/* Person Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <DialogInput
            placeholder="Enter person's name..."
            value={name}
            onChange={setName}
          />
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
          <DialogInput
            placeholder="Enter email address..."
            value={email}
            onChange={setEmail}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <DialogButton variant="primary" onClick={handleSubmit}>
            Add Person
          </DialogButton>
          <DialogButton variant="secondary" onClick={handleCancel}>
            Cancel
          </DialogButton>
        </div>
      </div>
    </Dialog>
  );
} 