
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomMenu from '@/components/MobileBottomMenu';
import { Button } from '@/components/ui/button';
import { showRewardedAd, showInterstitialAd } from '@/lib/adService';
import { logAdWatch } from '@/lib/userService';
import { Play, DollarSign, BadgePercent, BadgePlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const CreditsPage: React.FC = () => {
  const { user, refreshUserData } = useUser();
  const [loadingAdType, setLoadingAdType] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const handleWatchRewardedAd = async () => {
    if (!user) return;
    
    const dailyAdsWatched = user.dailyAdsWatched;
    const today = new Date().toISOString().split('T')[0];
    
    // Reset if it's a new day
    const rewardedWatched = dailyAdsWatched.date === today ? dailyAdsWatched.rewarded : 0;
    
    if (rewardedWatched >= 3) {
      toast({
        title: "Limit Reached",
        description: "You've reached the daily limit for rewarded videos. Try again tomorrow.",
      });
      return;
    }
    
    setLoadingAdType('rewarded');
    
    try {
      const adShown = await showRewardedAd();
      if (adShown) {
        await logAdWatch('rewarded');
        await refreshUserData();
        toast({
          title: "Credits Added",
          description: "You've earned 20 credits!",
        });
      }
    } catch (error) {
      console.error("Error showing rewarded ad:", error);
    } finally {
      setLoadingAdType(null);
    }
  };
  
  const handleWatchInterstitialAd = async () => {
    if (!user) return;
    
    const dailyAdsWatched = user.dailyAdsWatched;
    const today = new Date().toISOString().split('T')[0];
    
    // Reset if it's a new day
    const interstitialWatched = dailyAdsWatched.date === today ? dailyAdsWatched.interstitial : 0;
    
    if (interstitialWatched >= 5) {
      toast({
        title: "Limit Reached",
        description: "You've reached the daily limit for interstitial ads. Try again tomorrow.",
      });
      return;
    }
    
    setLoadingAdType('interstitial');
    
    try {
      const adShown = await showInterstitialAd();
      if (adShown) {
        await logAdWatch('interstitial');
        await refreshUserData();
        toast({
          title: "Credits Added",
          description: "You've earned 10 credits!",
        });
      }
    } catch (error) {
      console.error("Error showing interstitial ad:", error);
    } finally {
      setLoadingAdType(null);
    }
  };
  
  // Calculate remaining ads for today
  const calculateRemainingAds = () => {
    if (!user) return { rewarded: 0, interstitial: 0 };
    
    const dailyAdsWatched = user.dailyAdsWatched;
    const today = new Date().toISOString().split('T')[0];
    
    // If it's a new day, reset counters
    if (dailyAdsWatched.date !== today) {
      return { rewarded: 3, interstitial: 5 };
    }
    
    return {
      rewarded: Math.max(0, 3 - dailyAdsWatched.rewarded),
      interstitial: Math.max(0, 5 - dailyAdsWatched.interstitial)
    };
  };
  
  const remainingAds = calculateRemainingAds();

  return (
    <div className="min-h-screen pb-16 md:pb-6 bg-background">
      <Header />
      
      <div className="container px-4 max-w-5xl mx-auto py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Credits</h1>
        
        <div className="glass p-6 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Your Balance</h2>
              <p className="text-sm text-muted-foreground">Use credits for speech generation</p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="bg-card/50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Credits</p>
              <h3 className="text-3xl font-bold">{user?.credits || 0}</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Each generation costs 10 credits
            </p>
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Get More Credits</h2>
          
          <div className="space-y-6">
            <div className="bg-card/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Rewarded Videos</h3>
                  <p className="text-xs text-muted-foreground">Watch a full video ad to earn credits</p>
                </div>
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Play className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs">
                  <span className="text-green-500 font-semibold">+20 credits</span> • {remainingAds.rewarded} remaining today
                </p>
                <Button 
                  size="sm"
                  onClick={handleWatchRewardedAd}
                  disabled={loadingAdType !== null || remainingAds.rewarded === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loadingAdType === 'rewarded' ? 'Loading...' : 'Watch Ad'}
                </Button>
              </div>
            </div>
            
            <div className="bg-card/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Interstitial Ads</h3>
                  <p className="text-xs text-muted-foreground">Quick ads for quick credits</p>
                </div>
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <BadgePercent className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs">
                  <span className="text-blue-500 font-semibold">+10 credits</span> • {remainingAds.interstitial} remaining today
                </p>
                <Button 
                  size="sm"
                  onClick={handleWatchInterstitialAd}
                  disabled={loadingAdType !== null || remainingAds.interstitial === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loadingAdType === 'interstitial' ? 'Loading...' : 'Watch Ad'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <BadgePlus className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Tips</h2>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>New users get 30 free credits to start</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>Your first text-to-speech generation is free</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>You can watch up to 3 rewarded videos and 5 interstitial ads each day</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>Credits reset at midnight local time</span>
            </li>
          </ul>
        </div>
      </div>
      
      {isMobile && (
        <MobileBottomMenu activeTab="credits" onChangeTab={(tab) => window.location.href = `/${tab === 'generate' ? '' : tab}`} />
      )}
      
      <Footer />
    </div>
  );
};

export default CreditsPage;
