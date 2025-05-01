
import React from 'react';
import HistoryItem from './HistoryItem';

interface HistoryItem {
  id: number;
  timestamp: Date;
  voice: string;
  text: string;
}

interface HistoryProps {
  items: HistoryItem[];
  onDownload: (id: number) => void;
  onClearAll: () => void;
}

const History: React.FC<HistoryProps> = ({ items, onDownload, onClearAll }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 mr-2 text-primary"
          >
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
            <path d="M12 7v5l3 3" />
          </svg>
          历史记录
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary-foreground">
            最近10条
          </span>
        </h3>
        <button
          className="text-xs text-destructive hover:text-destructive/80 flex items-center transition-colors"
          onClick={onClearAll}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3 mr-1"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          清空记录
        </button>
      </div>
      
      <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border">
        <div className="bg-yellow-500/10 border-l-2 border-yellow-500 p-2 rounded-t-lg flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-xs text-yellow-200/80">
            生成记录刷新后重置，请注意下载您需要的音频文件
          </p>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {items.length > 0 ? (
            items.map((item) => (
              <HistoryItem
                key={item.id}
                id={item.id}
                timestamp={item.timestamp}
                voice={item.voice}
                text={item.text}
                onDownload={onDownload}
              />
            ))
          ) : (
            <div className="py-6 text-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 mx-auto mb-2 text-gray-500/50"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              暂无历史记录
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
