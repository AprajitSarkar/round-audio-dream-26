
import React from 'react';
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-opacity text-white w-full"
    >
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
      Download Audio File
    </Button>
  );
};

export default DownloadButton;
