
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/contexts/UserContext';

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  const { user } = useUser();
  
  return (
    <footer className={`py-6 mt-6 border-t border-border/50 text-center ${isMobile ? 'pb-20' : ''}`}>
      <div className="container mx-auto px-4">
        <p className="text-xs text-gray-400">
          © 2025 Voice Generator | Based on advanced voice synthesis technology
        </p>
        {user && (
          <p className="text-xs text-gray-500 mt-1">
            Logged in as: {user.username} ({user.deviceId.substring(0, 8)}...)
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
