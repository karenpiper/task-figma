import React, { useState } from 'react';
import { ChevronDown, Calendar, BarChart3, Clock, GitBranch, LayoutGrid, Plus, Layers } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  count?: number;
  color?: string;
}

interface ProjectSection {
  title: string;
  items: NavItem[];
  expanded?: boolean;
}

export function Sidebar() {
  const [sections, setSections] = useState<ProjectSection[]>([
    {
      title: 'CREATE NEW WEBSITE',
      expanded: true,
      items: [
        { icon: <Layers className="w-4 h-4" />, label: 'Today', count: 12 },
        { icon: <Calendar className="w-4 h-4" />, label: 'Calendar', count: 87 },
        { icon: <BarChart3 className="w-4 h-4" />, label: 'View' },
        { icon: <Clock className="w-4 h-4" />, label: 'Timeline', color: 'text-red-500' },
        { icon: <GitBranch className="w-4 h-4" />, label: 'Gantt', color: 'text-emerald-500' },
        { icon: <LayoutGrid className="w-4 h-4" />, label: 'Table', color: 'text-cyan-500' },
      ],
    },
    {
      title: 'DESIGN NEW APP',
      expanded: true,
      items: [
        { icon: <Layers className="w-4 h-4" />, label: 'Today', count: 5 },
        { icon: <Calendar className="w-4 h-4" />, label: 'Calendar', count: 198 },
        { icon: <BarChart3 className="w-4 h-4" />, label: 'View' },
        { icon: <GitBranch className="w-4 h-4" />, label: 'Gantt', color: 'text-emerald-500' },
      ],
    },
    {
      title: 'BUILD A SYSTEM',
      expanded: true,
      items: [
        { icon: <Layers className="w-4 h-4" />, label: 'Today', count: 10 },
        { icon: <Calendar className="w-4 h-4" />, label: 'Calendar', count: 398 },
        { icon: <BarChart3 className="w-4 h-4" />, label: 'View' },
        { icon: <Clock className="w-4 h-4" />, label: 'Timeline', color: 'text-red-500' },
        { icon: <GitBranch className="w-4 h-4" />, label: 'Gantt', color: 'text-emerald-500' },
      ],
    },
  ]);

  const toggleSection = (index: number) => {
    setSections(sections.map((section, i) => 
      i === index ? { ...section, expanded: !section.expanded } : section
    ));
  };

  return (
    <div className="h-screen bg-mgmt-beige/50 border-r border-gray-200 flex">
      {/* Icon Navigation Column */}
      <div className="w-16 bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-mgmt-green to-mgmt-lime rounded-lg flex items-center justify-center text-white font-semibold shadow-sm">
            BG
          </div>
        </div>
        
        <div className="flex-1 p-3 flex flex-col gap-2">
          <button className="w-10 h-10 bg-mgmt-green/20 rounded-lg flex items-center justify-center text-mgmt-green hover:bg-mgmt-green/30 transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-mgmt-pink/20 transition-colors">
            <Layers className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-mgmt-purple/20 transition-colors">
            <Clock className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-mgmt-yellow/20 transition-colors">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-mgmt-lime/20 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Full Navigation Column */}
      <div className="w-56 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <div className="flex-1">
            <h2 className="text-gray-900">Brook Greens</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Project Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {sections.map((section, index) => (
            <div key={index} className="mb-6">
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center gap-2 text-xs text-gray-500 uppercase mb-2 w-full hover:text-gray-700"
              >
                <span className="flex-1 text-left">{section.title}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${section.expanded ? '' : '-rotate-90'}`}
                />
              </button>
              {section.expanded && (
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer group"
                    >
                      <span className={item.color || 'text-gray-600'}>{item.icon}</span>
                      <span className="flex-1 text-sm text-gray-700">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="text-xs text-gray-500">{item.count}</span>
                      )}
                      {item.label === 'View' && (
                        <Plus className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}