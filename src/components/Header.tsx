
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full text-center p-6 relative">
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-2 glow-text`}>
        Voice Generator
      </h1>
    </header>
  );
};

export default Header;
