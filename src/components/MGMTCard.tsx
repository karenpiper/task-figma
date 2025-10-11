import React from 'react';

interface MGMTCardProps {
  backgroundColor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  blob?: {
    color: string;
    variant: 1 | 2 | 3;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  children: React.ReactNode;
}

export function MGMTCard({ 
  backgroundColor = '#ffffff', 
  className = '', 
  size = 'md',
  blob,
  children 
}: MGMTCardProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const blobVariants = {
    1: 'blob-shape',
    2: 'blob-shape-2', 
    3: 'blob-shape-3'
  };

  const blobPositions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  };

  return (
    <div 
      className={`mgmt-card relative overflow-hidden ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor }}
    >
      {blob && (
        <div 
          className={`absolute w-16 h-16 opacity-20 ${blobVariants[blob.variant]} ${blobPositions[blob.position]}`}
          style={{ backgroundColor: blob.color }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
