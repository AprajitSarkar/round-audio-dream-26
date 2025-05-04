
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserData, createUser, UserData, deleteUserData, changeDeviceId as changeUserDeviceId } from '@/lib/userService';
import { getDeviceId, registerDevice, unregisterDevice, setCustomDeviceId } from '@/lib/deviceUtils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  createNewUser: (username: string, customDeviceId?: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  changeDeviceId: (newDeviceId: string) => Promise<void>;
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
        console.log("Loading user data in UserProvider...");
        const userData = await getUserData();
        if (userData) {
          console.log("User data loaded successfully:", userData);
          setUser(userData);
          registerDevice();
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data. Check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Create a new user
  const createNewUser = async (username: string, customDeviceId?: string): Promise<void> => {
    try {
      console.log("Creating new user in UserContext:", { username, customDeviceId });
      setIsLoading(true);
      
      // Check online status
      if (!navigator.onLine) {
        toast.error("You appear to be offline. Please check your internet connection.");
        setIsLoading(false);
        return;
      }
      
      const newUser = await createUser(username, customDeviceId);
      console.log("New user created:", newUser);
      setUser(newUser);
      registerDevice();
      toast.success("Welcome! Your account has been created successfully.");
    } catch (error) {
      console.error("Error creating user in UserContext:", error);
      if ((error as any)?.code === 'unavailable') {
        toast.error("Network error: Unable to connect to database. Please check your internet connection and try again.");
      } else {
        toast.error("Failed to create user account. Please try again later.");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = async (): Promise<void> => {
    try {
      console.log("Refreshing user data...");
      const userData = await getUserData();
      if (userData) {
        console.log("User data refreshed:", userData);
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
      toast.success("You have been logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
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
      toast.success("Your account has been deleted successfully.");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account.");
    } finally {
      setIsLoading(false);
    }
  };

  // Change device ID (transfer account to a new device)
  const changeDeviceId = async (newDeviceId: string) => {
    try {
      setIsLoading(true);
      console.log("Changing device ID to:", newDeviceId);
      
      if (!user) {
        toast.error("You need to be logged in to change device ID.");
        setIsLoading(false);
        return;
      }

      // Update the deviceId in the user data
      await changeUserDeviceId(newDeviceId);
      setCustomDeviceId(newDeviceId);
      toast.success("Device ID changed successfully.");
      await refreshUserData();
    } catch (error) {
      console.error("Error changing device ID:", error);
      toast.error("Failed to change device ID.");
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
        changeDeviceId,
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
