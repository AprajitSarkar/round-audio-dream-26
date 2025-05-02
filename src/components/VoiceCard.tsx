
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
        "relative p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover-scale",
        isSelected ? "flowing-border scale-105 bg-muted" : "border border-border bg-card/60 hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-1">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
          style={{ 
            backgroundColor: color, 
            boxShadow: isSelected ? `0 0 12px ${color}` : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <span className="text-white text-lg font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="font-semibold text-sm">{name}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default VoiceCard;
