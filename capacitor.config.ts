
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b96599e42dee48b0a5e5725d0f3fc740',
  appName: 'round-audio-dream',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://b96599e4-2dee-48b0-a5e5-725d0f3fc740.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    AdMob: {
      appId: {
        android: 'ca-app-pub-3279473081670891~1431437217',
        ios: 'ca-app-pub-3279473081670891~1431437217',
      },
    }
  }
};

export default config;
