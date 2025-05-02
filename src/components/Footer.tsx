
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className={`py-6 mt-6 border-t border-border/50 text-center ${isMobile ? 'pb-20' : ''}`}>
      <p className="text-xs text-gray-400">
        © 2025 Voice Generator | Based on advanced voice synthesis technology
      </p>
    </footer>
  );
};

export default Footer;
