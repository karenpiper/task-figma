import React, { useState, useEffect } from 'react';
import { Users, FileText, Upload, Send, Calendar, Clock, CheckCircle, AlertCircle, MessageSquare, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Task, TeamMember } from '../hooks/useTasksNew';

interface OneOnOneModeProps {
  teamMembers: TeamMember[];
  tasks: Task[];
  onClose: () => void;
}

interface MeetingNote {
  id: string;
  timestamp: Date;
  content: string;
  type: 'note' | 'action-item' | 'follow-up';
}

export function OneOnOneMode({ teamMembers, tasks, onClose }: OneOnOneModeProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteType, setNoteType] = useState<'note' | 'action-item' | 'follow-up'>('note');
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('09:00');
  const [meetingDuration, setMeetingDuration] = useState('30');

  // Filter tasks for selected person
  const personTasks = selectedPerson 
    ? tasks.filter(task => task.project === selectedPerson || task.title.toLowerCase().includes(selectedPerson.toLowerCase()))
    : [];

  const selectedMember = teamMembers.find(member => member.name === selectedPerson);

  const handleAddNote = () => {
    if (!currentNote.trim()) return;

    const newNote: MeetingNote = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: currentNote,
      type: noteType
    };

    setMeetingNotes(prev => [newNote, ...prev]);
    setCurrentNote('');
  };

  const handleTranscriptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      setTranscriptFile(file);
      // Here you could parse the transcript and extract key points
    }
  };

  const handleExportNotes = () => {
    const notesText = meetingNotes
      .map(note => `[${note.timestamp.toLocaleTimeString()}] ${note.type.toUpperCase()}: ${note.content}`)
      .join('\n');
    
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `1on1-${selectedPerson}-${meetingDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'action-item':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'follow-up':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'action-item':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'follow-up':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">1:1 Meeting Mode</h1>
              <p className="text-gray-600">Run your one-on-one meeting</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportNotes} disabled={meetingNotes.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export Notes
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Meeting Setup */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Person</label>
              <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className={`text-xs ${member.color}`}>
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <Input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <Input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
              <Select value={meetingDuration} onValueChange={setMeetingDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="45">45</SelectItem>
                  <SelectItem value="60">60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* Left Side - Tasks */}
          <div className="w-1/2 flex flex-col">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Tasks & Discussion Points
                  {selectedPerson && (
                    <Badge variant="secondary" className="ml-2">
                      {personTasks.length} tasks
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {!selectedPerson ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a team member to view their tasks</p>
                  </div>
                ) : personTasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks found for {selectedPerson}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {personTasks.map((task) => (
                      <div key={task.id} className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              task.priority === 'high' ? 'border-red-200 text-red-700 bg-red-50' :
                              task.priority === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                              'border-green-200 text-green-700 bg-green-50'
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        {task.project && (
                          <p className="text-sm text-gray-600 mb-2">Project: {task.project}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Notes & Transcript */}
          <div className="w-1/2 flex flex-col gap-6">
            {/* Notes Section */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Meeting Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Note Form */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="action-item">Action Item</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddNote} disabled={!currentNote.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Enter your meeting notes, action items, or follow-ups..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    className="min-h-[100px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.metaKey) {
                        handleAddNote();
                      }
                    }}
                  />
                </div>

                {/* Notes List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {meetingNotes.map((note) => (
                    <div key={note.id} className={`p-3 rounded-lg border ${getNoteTypeColor(note.type)}`}>
                      <div className="flex items-start gap-2">
                        {getNoteTypeIcon(note.type)}
                        <div className="flex-1">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {note.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transcript Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Transcript Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload meeting transcript (TXT format)
                    </p>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleTranscriptUpload}
                      className="hidden"
                      id="transcript-upload"
                    />
                    <label htmlFor="transcript-upload">
                      <Button variant="outline" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </div>
                  
                  {transcriptFile && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">{transcriptFile.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(transcriptFile.size / 1024)}KB
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 