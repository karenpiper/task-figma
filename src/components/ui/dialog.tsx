import React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog Card */}
      <div className="relative bg-white rounded-3xl shadow-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        
        {/* Content */}
        <div className="mb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface DialogInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function DialogInput({ placeholder, value, onChange }: DialogInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
    />
  );
}

interface DialogButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function DialogButton({ variant, onClick, children }: DialogButtonProps) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200";
  
  if (variant === 'primary') {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} bg-red-500 text-white hover:bg-red-600 active:bg-red-700`}
      >
        {children}
      </button>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100`}
    >
      {children}
    </button>
  );
}
