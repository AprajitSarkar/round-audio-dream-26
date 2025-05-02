
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserData, createUser, UserData, deleteUserData } from '@/lib/userService';
import { getDeviceId, registerDevice, unregisterDevice } from '@/lib/deviceUtils';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  createNewUser: (username: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user data on startup
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
          registerDevice();
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Create a new user
  const createNewUser = async (username: string) => {
    try {
      setIsLoading(true);
      const newUser = await createUser(username);
      setUser(newUser);
      registerDevice();
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      setIsLoading(true);
      unregisterDevice();
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteUserData();
      unregisterDevice();
      setUser(null);
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        createNewUser,
        logoutUser,
        deleteAccount,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Loading component for auth state
export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="glass p-8 rounded-xl flex flex-col items-center space-y-4 max-w-md w-full">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <h2 className="text-xl font-semibold text-center">Loading your account...</h2>
        <p className="text-sm text-muted-foreground text-center">
          Please wait while we retrieve your data
        </p>
      </div>
    </div>
  );
};
