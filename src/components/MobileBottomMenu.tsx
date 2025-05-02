
import React from 'react';
import { Mic, History, Settings, Download, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface MobileBottomMenuProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const MobileBottomMenu: React.FC<MobileBottomMenuProps> = ({ activeTab, onChangeTab }) => {
  const menuItems = [
    { id: 'generate', icon: Mic, label: 'Generate', path: '/' },
    { id: 'download', icon: Download, label: 'Download', path: null },
    { id: 'history', icon: History, label: 'History', path: null },
    { id: 'credits', icon: DollarSign, label: 'Credits', path: '/credits' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-md border-t border-border/50 md:hidden">
      <div className="flex justify-around items-center h-16 px-3">
        {menuItems.map(item => {
          const content = (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full text-xs transition-colors",
                activeTab === item.id 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onChangeTab(item.id)}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </button>
          );

          return content;
        })}
      </div>
    </div>
  );
};

export default MobileBottomMenu;
