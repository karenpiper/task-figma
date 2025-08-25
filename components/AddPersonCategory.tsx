import React, { useState } from 'react';
import { Plus, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AddPersonCategoryProps {
  onAddPerson: (personName: string) => void;
}

export function AddPersonCategory({ onAddPerson }: AddPersonCategoryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [personName, setPersonName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personName.trim()) {
      onAddPerson(personName.trim());
      setPersonName('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setPersonName('');
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Add Person</h4>
          </div>
          
          <div className="space-y-3 ml-2">
            <Input
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Enter person's name..."
              className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl focus:bg-white/50 focus:border-white/70 text-sm"
              autoFocus
            />
            
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl text-sm"
              >
                Add Person
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="bg-white/30 backdrop-blur-sm border border-white/50 hover:bg-white/40 text-slate-700 rounded-xl text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="mb-4">
      <Button
        onClick={() => setIsAdding(true)}
        variant="ghost"
        className="w-full h-12 border-2 border-dashed border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/15 backdrop-blur-sm text-slate-600 hover:text-slate-700 transition-all duration-300 rounded-2xl group-hover:scale-[1.01]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Person
      </Button>
    </div>
  );
}