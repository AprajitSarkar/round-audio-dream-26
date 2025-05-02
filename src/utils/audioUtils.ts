
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
export const generateAudio = async (text: string, voiceId: string): Promise<Blob> => {
  // This would be a real API call to generate speech
  // For this demo, we'll simulate the API call with a delay and return a dummy audio blob
  
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(async () => {
      try {
        // For demonstration purposes, we'll use a static audio file
        // In a real app, this would be an API call to a TTS service
        
        // Using a dummy audio blob
        const response = await fetch('/dummy-audio.mp3');
        if (!response.ok) {
          throw new Error('Failed to fetch audio');
        }
        const blob = await response.blob();
        resolve(blob);
        
        // If there's no dummy audio, create a silent audio blob
        // This is just for demo purposes
        if (!response.ok) {
          const ctx = new AudioContext();
          const oscillator = ctx.createOscillator();
          const dst = ctx.createMediaStreamDestination();
          oscillator.connect(dst);
          oscillator.start();
          setTimeout(() => {
            oscillator.stop();
            
            // Create a media recorder
            const recorder = new MediaRecorder(dst.stream);
            const chunks: BlobPart[] = [];
            
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
              const blob = new Blob(chunks, { type: 'audio/mp3' });
              resolve(blob);
            };
            
            recorder.start();
            setTimeout(() => recorder.stop(), 1000);
          }, 100);
        }
      } catch (error) {
        reject(new Error('Failed to generate audio: ' + error));
      }
    }, 2000); // Simulate 2-second API delay
  });
};
