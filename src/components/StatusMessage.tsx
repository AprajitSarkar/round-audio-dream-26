
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusMessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type, visible }) => {
  const typeStyles = {
    success: "bg-green-500/10 border-green-500 text-green-500",
    error: "bg-red-500/10 border-red-500 text-red-500",
    info: "bg-blue-500/10 border-blue-500 text-blue-500"
  };
  
  const icons = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 mr-2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 mr-2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 mr-2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )
  };
  
  return (
    <div 
      className={cn(
        "border-l-4 p-3 rounded animate-fade-in flex items-center",
        typeStyles[type],
        visible ? "opacity-100" : "opacity-0 hidden"
      )}
    >
      {icons[type]}
      {message}
    </div>
  );
};

export default StatusMessage;
