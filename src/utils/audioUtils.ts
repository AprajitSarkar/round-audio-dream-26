
export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface HistoryItemType {
  id: number;
  timestamp: Date;
  voice: string;
  text: string;
  previewText: string;
  blob?: Blob;
}

export const voiceOptions: VoiceOption[] = [
  { id: 'alloy', name: 'Alloy', description: '平衡中性', color: '#4F46E5' },
  { id: 'echo', name: 'Echo', description: '深沉有力', color: '#6366F1' },
  { id: 'fable', name: 'Fable', description: '温暖讲述', color: '#8B5CF6' },
  { id: 'onyx', name: 'Onyx', description: '威严庄重', color: '#333333' },
  { id: 'nova', name: 'Nova', description: '友好专业', color: '#10B981' },
  { id: 'shimmer', name: 'Shimmer', description: '轻快明亮', color: '#60A5FA' },
  { id: 'coral', name: 'Coral', description: '温柔平静', color: '#F87171' },
  { id: 'verse', name: 'Verse', description: '生动诗意', color: '#FBBF24' }
];

// Function to download an audio blob
export const downloadAudio = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Save history to localStorage
export const saveHistory = (history: HistoryItemType[]): void => {
  try {
    // We can't store blobs in localStorage, so we'll store other info
    const historyData = history.map(item => ({
      id: item.id,
      timestamp: item.timestamp.toISOString(),
      voice: item.voice,
      text: item.text,
      previewText: item.previewText
    }));
    
    localStorage.setItem('audioGeneratorHistory', JSON.stringify(historyData));
  } catch (e) {
    console.error('Error saving history to localStorage:', e);
  }
};

// Load history from localStorage
export const loadHistory = (): HistoryItemType[] => {
  try {
    const historyData = localStorage.getItem('audioGeneratorHistory');
    if (historyData) {
      const parsedHistory = JSON.parse(historyData);
      return parsedHistory.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
        blob: null // We don't store blobs in localStorage
      }));
    }
  } catch (e) {
    console.error('Error loading history from localStorage:', e);
  }
  return [];
};

// For a real API call, but for the demo, we'll simulate the generation
export const generateAudio = async (text: string, voice: string): Promise<Blob> => {
  // This is just a mock - in a real app you would make an API call
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Create a fake audio blob (1 sec silent mp3)
      const silentMp3 = new Uint8Array([
        0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);
      
      const blob = new Blob([silentMp3], { type: 'audio/mpeg' });
      resolve(blob);
      
      // In case of error:
      // reject(new Error('Failed to generate audio'));
    }, 1500);
  });
};
