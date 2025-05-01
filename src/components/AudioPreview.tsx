
import React from 'react';

interface AudioPreviewProps {
  audioUrl: string | null;
  currentVoice: {
    name: string;
    description: string;
    color: string;
  } | null;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioUrl, currentVoice }) => {
  return (
    <div className="w-full rounded-lg p-4 glass min-h-[200px] flex flex-col">
      <div className="flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 mr-2 text-accent"
        >
          <path d="M12 22v-5" />
          <path d="M9 8l3-6 3 6" />
          <path d="M8 12h8" />
          <path d="M18 18.5a3 3 0 1 1-6 0v-1a5 5 0 0 0-10 0" />
        </svg>
        <h3 className="text-sm font-medium">Audio Preview</h3>
      </div>

      {currentVoice && (
        <div className="bg-muted/30 p-2 rounded-lg mb-4 flex items-center">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
            style={{ backgroundColor: currentVoice.color }}
          >
            <span className="text-white text-sm">{currentVoice.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium">{currentVoice.name}</p>
            <p className="text-xs text-gray-400">{currentVoice.description}</p>
          </div>
        </div>
      )}
      
      {audioUrl ? (
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-muted/30 p-3 rounded-lg">
            <audio 
              controls 
              className="w-full" 
              src={audioUrl}
            />
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="h-8 flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 bg-accent/80 rounded-full animate-wave-${i+1}`}
                  style={{height: '100%'}}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-gray-500 mb-2"
          >
            <path d="M4.5 12.5h15" />
            <path d="M9 9l3-3 3 3" />
            <path d="M9 16l3 3 3-3" />
          </svg>
          <p className="text-sm text-gray-400">No audio generated yet</p>
        </div>
      )}
    </div>
  );
};

export default AudioPreview;
