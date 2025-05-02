
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createNewUser, isLoading } = useUser();
  const navigate = useNavigate();

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
      <div className="glass p-6 rounded-xl max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Mic className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold glow-text">Welcome to Voice Generator</h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
              className="bg-muted/40"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full relative overflow-hidden bg-transparent border-transparent before:absolute before:inset-0 before:bg-glow-btn before:bg-size-200 before:animate-border-flow before:duration-1000 text-white"
            disabled={isLoading || isSubmitting || !username.trim()}
          >
            <span className="relative z-10">
              {isSubmitting ? 'Creating account...' : 'Get Started'}
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
