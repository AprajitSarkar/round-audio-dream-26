
import React from 'react';
import { Mic } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center space-y-6">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
          <Mic className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold glow-text">Voice Generator</h1>
        <p className="text-sm text-muted-foreground text-center">Convert text to natural speech</p>
      </div>
    </div>
  );
};

export default SplashScreen;
