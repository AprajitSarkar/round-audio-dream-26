
import React from 'react';
import { cn } from '@/lib/utils';

interface VoiceCardProps {
  id: string;
  name: string;
  description: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  id,
  name,
  description,
  color,
  isSelected,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "relative p-3 rounded-lg cursor-pointer transition-all duration-300 transform",
        isSelected ? "flowing-border scale-105 bg-muted" : "border border-border bg-card hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-1">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
          style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 12px ${color}` : 'none' }}
        >
          <span className="text-white text-lg">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default VoiceCard;
