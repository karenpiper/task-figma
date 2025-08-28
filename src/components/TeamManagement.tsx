import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogInput, DialogButton } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TeamMember } from '../hooks/useTasksNew';

interface TeamManagementProps {
  teamMembers: TeamMember[];
  onCreateMember: (memberData: { name: string; is_strategy_team: boolean; avatar?: string; color?: string }) => Promise<TeamMember>;
  onUpdateMember: (memberId: number, updates: Partial<TeamMember>) => Promise<TeamMember>;
  onDeleteMember: (memberId: number) => Promise<void>;
}

export function TeamManagement({ 
  teamMembers, 
  onCreateMember, 
  onUpdateMember, 
  onDeleteMember 
}: TeamManagementProps) {
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    is_strategy_team: false,
    avatar: '',
    color: 'bg-blue-500'
  });

  const handleCreateMember = async () => {
    if (!newMemberData.name.trim()) return;
    
    try {
      await onCreateMember({
        name: newMemberData.name,
        is_strategy_team: newMemberData.is_strategy_team,
        avatar: newMemberData.avatar || newMemberData.name.substring(0, 2).toUpperCase(),
        color: newMemberData.color
      });
      setNewMemberData({ name: '', is_strategy_team: false, avatar: '', color: 'bg-blue-500' });
      setIsCreatingMember(false);
    } catch (error) {
      console.error('Failed to create team member:', error);
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;
    
    try {
      await onUpdateMember(editingMember.id, {
        name: editingMember.name,
        is_strategy_team: editingMember.is_strategy_team,
        avatar: editingMember.avatar,
        color: editingMember.color
      });
      setEditingMember(null);
    } catch (error) {
      console.error('Failed to update team member:', error);
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        await onDeleteMember(memberId);
      } catch (error) {
        console.error('Failed to delete team member:', error);
      }
    }
  };

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-teal-500', label: 'Teal' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800">Team Management</h3>
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          onClick={() => setIsCreatingMember(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
        
        <Dialog isOpen={isCreatingMember} onClose={() => setIsCreatingMember(false)} title="Add New Team Member">
          <div className="space-y-4">
            <div>
              <Label htmlFor="memberName">Name *</Label>
              <DialogInput
                placeholder="Enter full name..."
                value={newMemberData.name}
                onChange={(value) => setNewMemberData(prev => ({ ...prev, name: value }))}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="strategy-team"
                checked={newMemberData.is_strategy_team}
                onChange={(e) => setNewMemberData(prev => ({ ...prev, is_strategy_team: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="strategy-team" className="ml-2">
                Member of Strategy Team
              </Label>
            </div>
            <div>
              <Label htmlFor="memberAvatar">Avatar</Label>
              <DialogInput
                placeholder="Enter initials (e.g., JD)"
                value={newMemberData.avatar}
                onChange={(value) => setNewMemberData(prev => ({ ...prev, avatar: value }))}
              />
            </div>
            <div>
              <Label htmlFor="memberColor">Color</Label>
              <Select value={newMemberData.color} onValueChange={(value) => setNewMemberData(prev => ({ ...prev, color: value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-lg">
                  {colorOptions.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <DialogButton variant="primary" onClick={handleCreateMember}>
                Add Member
              </DialogButton>
              <DialogButton variant="secondary" onClick={() => setIsCreatingMember(false)}>
                Cancel
              </DialogButton>
            </div>
          </div>
        </Dialog>
      </div>

      {/* Team Members List */}
      <div className="space-y-3">
        {teamMembers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-slate-500" />
            </div>
            <h4 className="font-medium text-slate-600 mb-2">No Team Members</h4>
            <p className="text-sm text-slate-500">Add your first team member to get started</p>
          </div>
        ) : (
          teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${member.color} flex items-center justify-center text-white font-semibold shadow-lg`}>
                  {member.avatar}
                </div>
                <div>
                  <h5 className="font-medium text-slate-800 text-sm">{member.name}</h5>
                  {member.is_strategy_team && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Strategy Team
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg hover:bg-white/40"
                  onClick={() => setEditingMember(member)}
                >
                  <Edit className="w-3 h-3 text-slate-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg hover:bg-red-100/60"
                  onClick={() => handleDeleteMember(member.id)}
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Member Dialog */}
      {editingMember && (
        <Dialog isOpen={!!editingMember} onClose={() => setEditingMember(null)} title="Edit Team Member">
          <div className="space-y-4">
            <div>
              <Label htmlFor="editMemberName">Name *</Label>
              <DialogInput
                placeholder="Enter full name..."
                value={editingMember.name}
                onChange={(value) => setEditingMember(prev => prev ? { ...prev, name: value } : null)}
              />
            </div>
            <div>
              <Label htmlFor="editMemberEmail">Email</Label>
              <DialogInput
                placeholder="Enter email address..."
                value={editingMember.email || ''}
                onChange={(value) => setEditingMember(prev => prev ? { ...prev, email: value } : null)}
              />
            </div>
            <div>
              <Label htmlFor="editMemberAvatar">Avatar</Label>
              <DialogInput
                placeholder="Enter initials (e.g., JD)"
                value={editingMember.avatar}
                onChange={(value) => setEditingMember(prev => prev ? { ...prev, avatar: value } : null)}
              />
            </div>
            <div>
              <Label htmlFor="editMemberColor">Color</Label>
              <Select value={editingMember.color} onValueChange={(value) => setEditingMember(prev => prev ? { ...prev, color: value } : null)}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-lg">
                  {colorOptions.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <DialogButton variant="primary" onClick={handleUpdateMember}>
                Update Member
              </DialogButton>
              <DialogButton variant="secondary" onClick={() => setEditingMember(null)}>
                Cancel
              </DialogButton>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
