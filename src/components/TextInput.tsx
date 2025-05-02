
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  const [charCount, setCharCount] = useState(0);
  const [duration, setDuration] = useState('0 seconds');
  const CHARS_PER_MINUTE = 150; // Average speaking speed

  useEffect(() => {
    // Update character count
    const count = value.trim().length;
    setCharCount(count);
    
    // Calculate estimated duration
    const durationMinutes = count / CHARS_PER_MINUTE;
    let durationText;
    
    if (durationMinutes < 1/60) {
      durationText = 'less than 1 second';
    } else if (durationMinutes < 1) {
      const seconds = Math.round(durationMinutes * 60);
      durationText = `${seconds} seconds`;
    } else {
      const minutes = Math.floor(durationMinutes);
      const seconds = Math.round((durationMinutes - minutes) * 60);
      if (seconds === 0) {
        durationText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
      } else {
        durationText = `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} second${seconds > 1 ? 's' : ''}`;
      }
    }
    
    setDuration(durationText);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Generate on Ctrl+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      // This is a placeholder for your generate function
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 mr-2 text-accent"
        >
          <path d="M12 18h.01" />
          <path d="M8 21h8" />
          <path d="M12 12v6" />
          <path d="M17 3H7a2 2 0 0 0-2 2v3a9 9 0 0 0 14 0V5a2 2 0 0 0-2-2Z" />
        </svg>
        Enter Text
      </h3>
      <div className="relative">
        <Textarea
          placeholder="Enter text to convert to speech..."
          className="min-h-32 bg-muted/40 resize-y rounded-xl border-border/50 focus:border-accent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
          {charCount} characters
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3 mr-1"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Estimated duration: {duration}
        </div>
        <div className="flex items-center">
          <span>Shortcut:</span>
          <kbd className="ml-1 px-1 py-0.5 text-xs bg-muted rounded">Ctrl</kbd>
          <span className="mx-1">+</span>
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Enter</kbd>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
