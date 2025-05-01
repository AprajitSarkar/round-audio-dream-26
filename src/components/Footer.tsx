
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className={`py-6 mt-6 border-t border-border text-center ${isMobile ? 'pb-20' : ''}`}>
      <p className="text-xs text-gray-400">
        © 2025 AI Voice Assistant | Based on advanced voice synthesis technology
      </p>
    </footer>
  );
};

export default Footer;
