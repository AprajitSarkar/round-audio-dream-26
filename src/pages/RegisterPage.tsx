
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, ChevronRight, Loader2, WifiOff } from 'lucide-react';
import { getDeviceId } from '@/lib/deviceUtils';
import { toast } from "sonner";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [customDeviceId, setCustomDeviceId] = useState<string>('');
  const [useCustomId, setUseCustomId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { createNewUser, user, isLoading } = useUser();
  const navigate = useNavigate();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You're back online!");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You're offline. Check your internet connection.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to home page");
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Get device ID on component mount
    const fetchDeviceId = async () => {
      try {
        const id = await getDeviceId();
        setDeviceId(id);
        console.log("Device ID fetched:", id);
      } catch (error) {
        console.error("Error fetching device ID:", error);
        toast.error("Could not retrieve device ID. Using fallback ID.");
      }
    };

    fetchDeviceId();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    if (!isOnline) {
      toast.error("You're offline. Please check your internet connection and try again.");
      return;
    }
    
    try {
      console.log("Starting registration process...");
      setIsSubmitting(true);
      // Use the custom device ID if selected, otherwise use the detected one
      const finalDeviceId = useCustomId && customDeviceId ? customDeviceId : deviceId;
      console.log("Using device ID for registration:", finalDeviceId);
      
      await createNewUser(username.trim(), finalDeviceId);
      console.log("Account created successfully");
      toast.success("Account created successfully!");
      
      // Add a short delay to make sure Firebase write completes
      setTimeout(() => {
        console.log("Navigating to home page...");
        navigate('/');
      }, 500);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to create account. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Loading state while UserContext is initializing
  if (isLoading && !isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="glass p-8 rounded-3xl max-w-md w-full space-y-8 flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center flex items-center justify-center z-50">
          <WifiOff className="w-4 h-4 mr-2" />
          You're offline. Please check your internet connection.
        </div>
      )}
      
      <div className="glass p-8 rounded-3xl max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-5 shadow-lg shadow-accent/20">
            <Mic className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold glow-text">Welcome to Voice Generator</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Create your account to start generating speech
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Choose a username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="input-cute h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="deviceId" className="text-sm font-medium">
                Device ID
              </label>
              <button
                type="button"
                onClick={() => setUseCustomId(!useCustomId)}
                className="text-xs text-primary hover:text-accent underline"
              >
                {useCustomId ? "Use automatic ID" : "Use custom ID"}
              </button>
            </div>
            
            {useCustomId ? (
              <Input
                id="customDeviceId"
                type="text"
                value={customDeviceId}
                onChange={(e) => setCustomDeviceId(e.target.value)}
                placeholder="Enter custom device ID"
                className="input-cute h-12"
              />
            ) : (
              <Input
                id="deviceId"
                type="text"
                value={deviceId}
                placeholder="Loading device ID..."
                className="input-cute h-12 text-muted-foreground"
                disabled
                title="This ID is automatically generated for your device"
              />
            )}
            <p className="text-xs text-muted-foreground">
              {useCustomId 
                ? "Enter a custom device ID if you want to use an existing account" 
                : "This unique ID identifies your device for authentication"}
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="cute-btn w-full h-12 text-base font-medium"
            disabled={isLoading || isSubmitting || !username.trim() || (useCustomId && !customDeviceId.trim()) || !isOnline}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </span>
          </Button>
        </form>
        
        <p className="text-xs text-center text-muted-foreground pt-4">
          By continuing, you agree to allow this app to use your device ID for account identification.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
