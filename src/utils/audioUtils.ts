
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
  { id: 'alloy', name: 'Alloy', description: 'Balanced Neutral', color: '#4F46E5' },
  { id: 'echo', name: 'Echo', description: 'Deep and powerful', color: '#6366F1' },
  { id: 'fable', name: 'Fable', description: 'Warm narration', color: '#8B5CF6' },
  { id: 'onyx', name: 'Onyx', description: 'Majestic and solemn', color: '#333333' },
  { id: 'nova', name: 'Nova', description: 'Friendly and professional', color: '#10B981' },
  { id: 'shimmer', name: 'Shimmer', description: 'Light and bright', color: '#60A5FA' },
  { id: 'coral', name: 'Coral', description: 'Gentle and calm', color: '#F87171' },
  { id: 'verse', name: 'Verse', description: 'Vivid Poetry', color: '#FBBF24' },
  { id: 'ballad', name: 'Ballad', description: 'Lyrical and Soft', color: '#A78BFA' },
  { id: 'ash', name: 'Ash', description: 'Thinking calmly', color: '#4B5563' },
  { id: 'sage', name: 'Sage', description: 'Wisdom and sophistication', color: '#059669' },
  { id: 'amuch', name: 'Amuch', description: 'Full and natural', color: '#F59E0B' },
  { id: 'aster', name: 'Aster', description: 'Clear and direct', color: '#2563EB' },
  { id: 'brook', name: 'Brook', description: 'Smooth and comfortable', color: '#3B82F6' },
  { id: 'clover', name: 'Clover', description: 'Lively and youthful', color: '#EC4899' },
  { id: 'dan', name: 'Dan', description: 'Steady male voice', color: '#1F2937' },
  { id: 'elan', name: 'Elan', description: 'Elegant and fluent', color: '#7C3AED' }
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

// Generate audio using a real API endpoint
export const generateAudio = async (text: string, voice: string): Promise<Blob> => {
  try {
    // Add "read it" prefix to the text
    const prefixedText = `read it "${text}"`;
    
    // This endpoint URL is for demonstration
    const url = `https://text.pollinations.ai/${encodeURIComponent(prefixedText)}?model=openai-audio&voice=${voice}`;
    
    // Make the API request
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    // Get the audio blob from the response
    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('Error generating audio:', error);
    
    // If the API fails, return a fallback silent audio blob
    // This is just for demo purposes and should be handled properly in production
    const silentMp3 = new Uint8Array([
      0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    
    return new Blob([silentMp3], { type: 'audio/mpeg' });
  }
};
