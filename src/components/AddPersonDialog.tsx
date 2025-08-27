import React, { useState } from 'react';
import { Dialog, DialogInput, DialogButton } from './ui/dialog';

interface AddPersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (personData: { name: string; is_strategy_team: boolean }) => void;
}

export function AddPersonDialog({ isOpen, onClose, onSubmit }: AddPersonDialogProps) {
  const [name, setName] = useState('');
  const [isStrategyTeam, setIsStrategyTeam] = useState(false);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        is_strategy_team: isStrategyTeam
      });
      setName('');
      setIsStrategyTeam(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    setIsStrategyTeam(false);
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

        {/* Strategy Team Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="strategy-team"
            checked={isStrategyTeam}
            onChange={(e) => setIsStrategyTeam(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="strategy-team" className="ml-2 block text-sm text-gray-700">
            Member of Strategy Team
          </label>
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