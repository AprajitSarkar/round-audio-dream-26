
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { DollarSign } from 'lucide-react';

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
        
        {user && (
          <div className="flex items-center gap-2">
            <Link 
              to="/credits" 
              className="px-3 py-1.5 bg-secondary/80 hover:bg-secondary rounded-full flex items-center gap-1.5 border border-white/10 transition-all duration-300"
            >
              <DollarSign className="h-4 w-4 text-amber-400" />
              <span className="font-medium text-amber-300">{user.credits}</span>
            </Link>
            
            {!isMobile && (
              <Link 
                to="/settings" 
                className="px-4 py-1.5 rounded-full text-sm font-medium hover:bg-card/60 transition-colors border border-white/10"
              >
                Settings
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
