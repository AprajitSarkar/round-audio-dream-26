
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = () => {
  const isMobile = useIsMobile();
  const { user } = useUser();
  const navigate = useNavigate();
  
  return (
    <header className="w-full text-center p-6 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-2 glow-text`}>
            Voice Generator
          </h1>
        </Link>
        
        {!isMobile && user && (
          <div className="flex items-center space-x-4">
            <Link 
              to="/credits" 
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-card/60 transition-colors"
            >
              Credits: {user.credits}
            </Link>
            <Link 
              to="/settings" 
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-card/60 transition-colors"
            >
              Settings
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
