
import { AdMob } from '@admob-plus/capacitor';
import { toast } from '@/hooks/use-toast';

const REWARDED_AD_UNIT = 'ca-app-pub-3279473081670891/7308583729';
const INTERSTITIAL_AD_UNIT = 'ca-app-pub-3279473081670891/5078157857';
const APP_OPEN_AD_UNIT = 'ca-app-pub-3940256099942544/9257395921';

// Initialize AdMob when app starts
export const initializeAdMob = async (): Promise<void> => {
  try {
    await AdMob.start({
      requestTrackingAuthorization: true,
    });
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('Error initializing AdMob:', error);
  }
};

// Show rewarded video ad
export const showRewardedAd = async (): Promise<boolean> => {
  return new Promise(async (resolve) => {
    try {
      // Create reward ad options
      const options = {
        adId: REWARDED_AD_UNIT,
      };

      // Set up event listeners
      const rewardedAdRewardHandler = AdMob.addListener(
        'rewarded_video_reward',
        () => {
          console.log('User earned reward');
          rewardedAdRewardHandler.remove();
          resolve(true);
        }
      );

      const rewardedAdCloseHandler = AdMob.addListener(
        'rewarded_video_close',
        () => {
          console.log('Rewarded ad closed');
          rewardedAdCloseHandler.remove();
        }
      );

      const rewardedAdFailHandler = AdMob.addListener(
        'rewarded_video_load_fail',
        (info) => {
          console.error('Failed to load rewarded ad:', info);
          toast({
            title: "Ad Error",
            description: "Failed to load reward ad. Please try again later.",
            variant: "destructive",
          });
          rewardedAdFailHandler.remove();
          resolve(false);
        }
      );

      // Load and show the ad
      const rewarded = await AdMob.createRewardedAd(options);
      await rewarded.load();
      await rewarded.show();
      
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      toast({
        title: "Ad Error",
        description: "Something went wrong when showing the ad.",
        variant: "destructive",
      });
      resolve(false);
    }
  });
};

// Show interstitial ad
export const showInterstitialAd = async (): Promise<boolean> => {
  return new Promise(async (resolve) => {
    try {
      // Create interstitial ad options
      const options = {
        adId: INTERSTITIAL_AD_UNIT,
      };

      // Set up event listeners
      const interstitialAdCloseHandler = AdMob.addListener(
        'interstitial_dismiss',
        () => {
          console.log('Interstitial ad closed');
          interstitialAdCloseHandler.remove();
          resolve(true);
        }
      );

      const interstitialAdFailHandler = AdMob.addListener(
        'interstitial_load_fail',
        (info) => {
          console.error('Failed to load interstitial ad:', info);
          toast({
            title: "Ad Error",
            description: "Failed to load ad. Please try again later.",
            variant: "destructive",
          });
          interstitialAdFailHandler.remove();
          resolve(false);
        }
      );

      // Load and show the ad
      const interstitial = await AdMob.createInterstitialAd(options);
      await interstitial.load();
      await interstitial.show();
      
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      toast({
        title: "Ad Error",
        description: "Something went wrong when showing the ad.",
        variant: "destructive",
      });
      resolve(false);
    }
  });
};
