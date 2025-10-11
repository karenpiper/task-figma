import React from 'react';

interface MGMTBadgeProps {
  variant: 'purple' | 'pink' | 'yellow' | 'green' | 'beige' | 'lime';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function MGMTBadge({ 
  variant, 
  size = 'md', 
  children, 
  className = '' 
}: MGMTBadgeProps) {
  const variantClasses = {
    purple: 'bg-mgmt-purple text-gray-800',
    pink: 'bg-mgmt-pink text-gray-800',
    yellow: 'bg-mgmt-yellow text-gray-800',
    green: 'bg-mgmt-green text-white',
    beige: 'bg-mgmt-beige text-gray-800',
    lime: 'bg-mgmt-lime text-gray-800'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span 
      className={`mgmt-badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
