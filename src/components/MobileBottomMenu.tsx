
import React from 'react';
import { Mic, History, Settings, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileBottomMenuProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const MobileBottomMenu: React.FC<MobileBottomMenuProps> = ({ activeTab, onChangeTab }) => {
  const menuItems = [
    { id: 'generate', icon: Mic, label: 'Generate' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'download', icon: Download, label: 'Download' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-sm border-t border-border md:hidden">
      <div className="flex justify-around items-center h-16 px-3">
        {menuItems.map(item => (
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
        ))}
      </div>
    </div>
  );
};

export default MobileBottomMenu;
