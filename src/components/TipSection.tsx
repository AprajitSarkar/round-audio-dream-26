
import React from 'react';

const TipSection: React.FC = () => {
  return (
    <div className="bg-purple-900/20 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
      <div className="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 mr-2 text-purple-400"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <h3 className="text-sm font-medium text-purple-300">Usage Tips</h3>
      </div>
      <ul className="space-y-1.5">
        <li className="flex text-xs text-purple-200/80">
          <span className="mr-2">•</span>
          <span>Use punctuation for natural pauses and intonation changes</span>
        </li>
        <li className="flex text-xs text-purple-200/80">
          <span className="mr-2">•</span>
          <span>Different voice styles suit different scenarios - experiment to find the best one</span>
        </li>
        <li className="flex text-xs text-purple-200/80">
          <span className="mr-2">•</span>
          <span>For longer texts, divide into multiple paragraphs for better results</span>
        </li>
      </ul>
    </div>
  );
};

export default TipSection;
