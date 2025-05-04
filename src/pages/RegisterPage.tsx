
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, ChevronRight } from 'lucide-react';
import { getDeviceId } from '@/lib/deviceUtils';
import { toast } from "sonner";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createNewUser, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Get device ID on component mount
    const fetchDeviceId = async () => {
      try {
        const id = await getDeviceId();
        setDeviceId(id);
      } catch (error) {
        console.error("Error fetching device ID:", error);
        toast("Could not retrieve device ID. Using fallback ID.");
      }
    };

    fetchDeviceId();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsSubmitting(true);
    await createNewUser(username.trim());
    setIsSubmitting(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
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
            <label htmlFor="deviceId" className="text-sm font-medium">
              Device ID (automatic)
            </label>
            <Input
              id="deviceId"
              type="text"
              value={deviceId}
              placeholder="Loading device ID..."
              className="input-cute h-12 text-muted-foreground"
              disabled
              title="This ID is automatically generated for your device"
            />
            <p className="text-xs text-muted-foreground">
              This unique ID identifies your device for authentication
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="cute-btn w-full h-12 text-base font-medium"
            disabled={isLoading || isSubmitting || !username.trim()}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? 'Creating account...' : 'Get Started'}
              <ChevronRight className="ml-2 h-5 w-5" />
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
