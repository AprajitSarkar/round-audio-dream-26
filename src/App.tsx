
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProvider, useUser, AuthLoadingScreen } from "./contexts/UserContext";
import { initializeAdMob } from "./lib/adService";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import SplashScreen from "./pages/SplashScreen";
import CreditsPage from "./pages/CreditsPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <AuthLoadingScreen />;
  }
  
  return user ? element : <Navigate to="/register" />;
};

// App initialization component
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Initialize AdMob
    initializeAdMob().catch(console.error);
    
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showSplash) {
    return <SplashScreen />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInitializer>
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute element={<Index />} />} />
              <Route path="/credits" element={<ProtectedRoute element={<CreditsPage />} />} />
              <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppInitializer>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
