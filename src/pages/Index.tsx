
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VoiceStyleSelector from '@/components/VoiceStyleSelector';
import TextInput from '@/components/TextInput';
import AudioPreview from '@/components/AudioPreview';
import GenerateButton from '@/components/GenerateButton';
import DownloadButton from '@/components/DownloadButton';
import StatusMessage from '@/components/StatusMessage';
import History from '@/components/History';
import FeatureList from '@/components/FeatureList';
import TipSection from '@/components/TipSection';
import Footer from '@/components/Footer';
import MobileBottomMenu from '@/components/MobileBottomMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { showInterstitialAd } from '@/lib/adService';
import { updateUserCredits, addToHistory } from '@/lib/userService';

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
  const [activeTab, setActiveTab] = useState('generate');
  const [hasGeneratedFirst, setHasGeneratedFirst] = useState(false);
  
  const isMobile = useIsMobile();
  const currentVoice = voiceOptions.find(voice => voice.id === selectedVoice) || null;
  const { user, refreshUserData } = useUser();
  const navigate = useNavigate();
  
  // Check local storage for first generation
  useEffect(() => {
    const generated = localStorage.getItem('hasGeneratedFirst') === 'true';
    setHasGeneratedFirst(generated);
    
    // Load history from localStorage on mount
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
    
    // Check if this is not the first generation and if user has enough credits
    if (hasGeneratedFirst && (user?.credits || 0) < 10) {
      toast({
        title: "Insufficient Credits",
        description: "You need 10 credits to generate audio. Go to Credits page to earn more.",
        variant: "destructive",
      });
      navigate('/credits');
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
      
      // If this is not the first generation, deduct credits
      if (hasGeneratedFirst) {
        // Deduct 10 credits from user
        if (user) {
          const newCredits = (user.credits || 0) - 10;
          await updateUserCredits(newCredits);
          await refreshUserData();
        }
      } else {
        // Mark first generation as used
        localStorage.setItem('hasGeneratedFirst', 'true');
        setHasGeneratedFirst(true);
      }
      
      // Add to user's generation history in Firebase
      await addToHistory(text, selectedVoice);
      
      showStatus('Audio generated successfully!', 'success');
      
      // Show interstitial ad occasionally (20% chance)
      if (Math.random() < 0.2) {
        try {
          await showInterstitialAd();
        } catch (error) {
          console.error("Error showing interstitial ad:", error);
        }
      }
      
      // Automatically switch to the download tab on mobile
      if (isMobile) {
        setActiveTab('download');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      showStatus(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (audioBlob) {
      const previewText = text.substring(0, 20).replace(/[^\w\u4E00-\u9FA5]/g, '');
      const fileName = `${selectedVoice}_${previewText}.mp3`;
      downloadAudio(audioBlob, fileName);
    }
  };

  const handleHistoryDownload = (id: number) => {
    const item = history.find(h => h.id === id);
    if (item && item.blob) {
      const fileName = `${item.voice}_${item.previewText.substring(0, 15).replace(/[^\w\u4E00-\u9FA5]/g, '')}.mp3`;
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

  // Handle tab changes for mobile view
  const handleChangeTab = (tab: string) => {
    if (tab === 'credits' || tab === 'settings') {
      navigate(`/${tab}`);
      return;
    }
    setActiveTab(tab);
  };

  // Render content based on active tab for mobile
  const renderMobileContent = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <div className="space-y-6">
            <div className="glass p-4 rounded-lg">
              <VoiceStyleSelector 
                options={voiceOptions}
                selected={selectedVoice}
                onSelect={setSelectedVoice}
              />
            </div>
            
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
            
            <TipSection />
            
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Credits</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => navigate("/credits")}
                >
                  Get More
                </Button>
              </div>
              
              <div className="bg-card/50 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">{user?.credits || 0}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs">
                    {hasGeneratedFirst 
                      ? "Each generation costs 10 credits" 
                      : "First generation is free!"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'download':
        return (
          <div className="space-y-6">
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
            
            <FeatureList />
          </div>
        );
      
      case 'history':
        return (
          <div className="space-y-6">
            <div className="glass p-4 rounded-lg">
              <History 
                items={history} 
                onDownload={handleHistoryDownload}
                onClearAll={handleClearHistory}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-6 bg-background">
      <Header />
      
      <div className="container px-4 max-w-5xl mx-auto">
        {isMobile ? (
          renderMobileContent()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Input */}
            <div className="space-y-6">
              {/* Voice Selection */}
              <div className="glass p-4 rounded-lg">
                <VoiceStyleSelector 
                  options={voiceOptions}
                  selected={selectedVoice}
                  onSelect={setSelectedVoice}
                />
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
              
              {/* Credit Status */}
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Credits</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => navigate("/credits")}
                  >
                    Get More
                  </Button>
                </div>
                
                <div className="bg-card/50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold text-primary">{user?.credits || 0}</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs">
                      {hasGeneratedFirst 
                        ? "Each generation costs 10 credits" 
                        : "First generation is free!"
                      }
                    </p>
                  </div>
                </div>
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
        )}
      </div>
      
      {isMobile && (
        <MobileBottomMenu activeTab={activeTab} onChangeTab={handleChangeTab} />
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
