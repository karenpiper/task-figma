import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TeamMember } from '../hooks/useTasksNew';

interface TeamManagementProps {
  teamMembers: TeamMember[];
  onCreateMember: (memberData: { name: string; email?: string; avatar?: string; color?: string }) => Promise<TeamMember>;
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
    email: '',
    avatar: '',
    color: 'bg-blue-500'
  });

  const handleCreateMember = async () => {
    if (!newMemberData.name.trim()) return;
    
    try {
      await onCreateMember({
        name: newMemberData.name,
        email: newMemberData.email || undefined,
        avatar: newMemberData.avatar || newMemberData.name.substring(0, 2).toUpperCase(),
        color: newMemberData.color
      });
      setNewMemberData({ name: '', email: '', avatar: '', color: 'bg-blue-500' });
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
        email: editingMember.email,
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
        <Dialog open={isCreatingMember} onOpenChange={setIsCreatingMember}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white/95 backdrop-blur-xl border border-white/40">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="memberName">Name *</Label>
                <Input
                  id="memberName"
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name..."
                  className="bg-white/50 border-white/30"
                />
              </div>
              <div>
                <Label htmlFor="memberEmail">Email</Label>
                <Input
                  id="memberEmail"
                  type="email"
                  value={newMemberData.email}
                  onChange={(e) => setNewMemberData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address..."
                  className="bg-white/50 border-white/30"
                />
              </div>
              <div>
                <Label htmlFor="memberAvatar">Avatar</Label>
                <Input
                  id="memberAvatar"
                  value={newMemberData.avatar}
                  onChange={(e) => setNewMemberData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="Enter initials (e.g., JD)"
                  className="bg-white/50 border-white/30"
                />
              </div>
              <div>
                <Label htmlFor="memberColor">Color</Label>
                <Select value={newMemberData.color} onValueChange={(value) => setNewMemberData(prev => ({ ...prev, color: value }))}>
                  <SelectTrigger className="bg-white/50 border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleCreateMember}
                  disabled={!newMemberData.name.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                >
                  Add Member
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingMember(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
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
                  {member.email && (
                    <p className="text-xs text-slate-600">{member.email}</p>
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
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent className="bg-white/95 backdrop-blur-xl border border-white/40">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editMemberName">Name *</Label>
                <Input
                  id="editMemberName"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Enter full name..."
                  className="bg-white/50 border-white/30"
                />
              </div>
              <div>
                <Label htmlFor="editMemberEmail">Email</Label>
                <Input
                  id="editMemberEmail"
                  type="email"
                  value={editingMember.email || ''}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, email: e.target.value } : null)}
                  placeholder="Enter email address..."
                  className="bg-white/50 border-white/30"
                />
              </div>
              <div>
                <Label htmlFor="editMemberAvatar">Avatar</Label>
                <Input
                  id="editMemberAvatar"
                  value={editingMember.avatar}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, avatar: e.target.value } : null)}
                  placeholder="Enter initials (e.g., JD)"
                  className="bg-white/50 border-white/30"
                />
              </div>
              <div>
                <Label htmlFor="editMemberColor">Color</Label>
                <Select value={editingMember.color} onValueChange={(value) => setEditingMember(prev => prev ? { ...prev, color: value } : null)}>
                  <SelectTrigger className="bg-white/50 border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleUpdateMember}
                  disabled={!editingMember.name.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                >
                  Update Member
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingMember(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 