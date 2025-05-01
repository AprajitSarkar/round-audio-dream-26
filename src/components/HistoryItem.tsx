
import React from 'react';
import { Button } from "@/components/ui/button";

interface HistoryItemProps {
  id: number;
  timestamp: Date;
  voice: string;
  text: string;
  onDownload: (id: number) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  id,
  timestamp,
  voice,
  text,
  onDownload
}) => {
  // Format timestamp
  const formattedDate = `${timestamp.getFullYear()}-${(timestamp.getMonth()+1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')} ${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
  
  // Trim text if it's too long
  const previewText = text.length > 25 ? `${text.substring(0, 25)}...` : text;
  
  return (
    <div className="p-3 border-b border-border flex justify-between items-center group hover:bg-muted/30 rounded-md transition-all">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{formattedDate}</p>
        <p className="font-medium text-sm flex items-center">
          <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
          {voice}
        </p>
        <p className="text-xs text-gray-400 truncate">{previewText}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDownload(id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      </Button>
    </div>
  );
};

export default HistoryItem;
