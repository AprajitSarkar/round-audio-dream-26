
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VoiceCard from '@/components/VoiceCard';
import TextInput from '@/components/TextInput';
import AudioPreview from '@/components/AudioPreview';
import GenerateButton from '@/components/GenerateButton';
import DownloadButton from '@/components/DownloadButton';
import StatusMessage from '@/components/StatusMessage';
import History from '@/components/History';
import FeatureList from '@/components/FeatureList';
import TipSection from '@/components/TipSection';
import Footer from '@/components/Footer';
import { 
  voiceOptions, 
  VoiceOption, 
  HistoryItemType, 
  downloadAudio, 
  saveHistory, 
  loadHistory,
  generateAudio
} from '@/utils/audioUtils';

const MAX_HISTORY_ITEMS = 10;

const Index = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>(voiceOptions[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: 'info' as 'success' | 'error' | 'info', visible: false });

  const currentVoice = voiceOptions.find(voice => voice.id === selectedVoice) || null;

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = loadHistory();
    if (savedHistory && savedHistory.length > 0) {
      setHistory(savedHistory.slice(0, MAX_HISTORY_ITEMS));
    }
  }, []);

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      showStatus('Please enter some text', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Generate audio from text
      const blob = await generateAudio(text, selectedVoice);
      
      // Create URL for audio player
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioBlob(blob);
      
      // Add to history
      const previewText = text.length > 20 ? `${text.substring(0, 20)}...` : text;
      const historyItem: HistoryItemType = {
        id: Date.now(),
        timestamp: new Date(),
        voice: selectedVoice,
        text,
        previewText,
        blob
      };
      
      // Add to beginning of history and limit to MAX_HISTORY_ITEMS
      const newHistory = [historyItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      setHistory(newHistory);
      saveHistory(newHistory);
      
      showStatus('Audio generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating audio:', error);
      showStatus(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (audioBlob) {
      const previewText = text.substring(0, 20).replace(/[^\w\u4e00-\u9fa5]/g, '');
      const fileName = `${selectedVoice}_${previewText}.mp3`;
      downloadAudio(audioBlob, fileName);
    }
  };

  const handleHistoryDownload = (id: number) => {
    const item = history.find(h => h.id === id);
    if (item && item.blob) {
      const fileName = `${item.voice}_${item.previewText.substring(0, 15).replace(/[^\w\u4e00-\u9fa5]/g, '')}.mp3`;
      downloadAudio(item.blob, fileName);
    } else {
      showStatus('Audio file not available', 'error');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem('audioGeneratorHistory');
      showStatus('History cleared', 'success');
    }
  };

  const showStatus = (text: string, type: 'success' | 'error' | 'info') => {
    setStatusMessage({ text, type, visible: true });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setStatusMessage(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  return (
    <div className="min-h-screen pb-6 bg-background">
      <Header />
      
      <div className="container px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Input */}
          <div className="space-y-6">
            {/* Voice Selection */}
            <div className="glass p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-2 text-secondary"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                Select Voice Style
              </h3>
              <p className="text-xs text-gray-400 mb-3">Each style has its unique tone and expressiveness. Choose the one that best fits your content</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {voiceOptions.map((voice) => (
                  <VoiceCard
                    key={voice.id}
                    id={voice.id}
                    name={voice.name}
                    description={voice.description}
                    color={voice.color}
                    isSelected={selectedVoice === voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                  />
                ))}
              </div>
            </div>
            
            {/* Text Input */}
            <div className="glass p-4 rounded-lg">
              <TextInput value={text} onChange={setText} />
              <div className="mt-4">
                <GenerateButton onClick={handleGenerateAudio} isLoading={isLoading} />
              </div>
              {statusMessage.visible && (
                <div className="mt-4">
                  <StatusMessage 
                    message={statusMessage.text} 
                    type={statusMessage.type} 
                    visible={statusMessage.visible} 
                  />
                </div>
              )}
            </div>
            
            {/* Tips */}
            <TipSection />
          </div>
          
          {/* Right column - Output */}
          <div className="space-y-6">
            {/* Audio Preview */}
            <div className="glass p-4 rounded-lg">
              <AudioPreview 
                audioUrl={audioUrl}
                currentVoice={currentVoice}
              />
              
              {audioBlob && (
                <div className="mt-4">
                  <DownloadButton onClick={handleDownload} />
                </div>
              )}
            </div>
            
            {/* History */}
            <div className="glass p-4 rounded-lg">
              <History 
                items={history} 
                onDownload={handleHistoryDownload}
                onClearAll={handleClearHistory}
              />
            </div>
            
            {/* Features */}
            <FeatureList />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
