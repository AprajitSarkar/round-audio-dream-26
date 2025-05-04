
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomMenu from '@/components/MobileBottomMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateUsername, changeDeviceId as updateDeviceId } from '@/lib/userService';
import { setCustomDeviceId } from '@/lib/deviceUtils';
import { User, LogOut, Trash2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const SettingsPage: React.FC = () => {
  const { user, logoutUser, deleteAccount, refreshUserData, changeDeviceId } = useUser();
  const [username, setUsername] = useState(user?.username || '');
  const [newDeviceId, setNewDeviceId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingDeviceId, setIsChangingDeviceId] = useState(false);
  const isMobile = useIsMobile();
  
  const handleUpdateUsername = async () => {
    if (!username.trim() || !user) return;
    
    setIsUpdating(true);
    
    try {
      await updateUsername(username.trim());
      await refreshUserData();
      toast("Your username has been updated successfully.");
    } catch (error) {
      console.error("Error updating username:", error);
      toast("Failed to update username.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeDeviceId = async () => {
    if (!newDeviceId.trim() || !user) return;
    
    setIsChangingDeviceId(true);
    
    try {
      await updateDeviceId(newDeviceId.trim());
      setCustomDeviceId(newDeviceId.trim());
      await refreshUserData();
      toast("Device ID changed successfully. You're now using this account on the new device ID.");
      setNewDeviceId('');
    } catch (error) {
      console.error("Error changing device ID:", error);
      toast("Failed to change device ID.");
    } finally {
      setIsChangingDeviceId(false);
    }
  };
  
  return (
    <div className="min-h-screen pb-16 md:pb-6 bg-background">
      <Header />
      
      <div className="container px-4 max-w-5xl mx-auto py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
        
        <div className="glass p-6 rounded-xl mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Account Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium block">
                Username
              </label>
              <div className="flex space-x-2">
                <Input
                  id="username"
                  className="bg-card/50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
                <Button 
                  onClick={handleUpdateUsername}
                  disabled={isUpdating || !username.trim() || username === user?.username}
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold">Device Management</h2>
              </div>
              
              <div className="bg-card/50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Current Device ID</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is your unique device identifier
                    </p>
                  </div>
                  <p className="text-xs bg-muted/40 p-2 rounded font-mono">
                    {user?.deviceId || 'Not available'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <label htmlFor="newDeviceId" className="text-sm font-medium block">
                  Change Device ID
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="newDeviceId"
                    className="bg-card/50"
                    value={newDeviceId}
                    onChange={(e) => setNewDeviceId(e.target.value)}
                    placeholder="Enter new device ID"
                  />
                  <Button 
                    onClick={handleChangeDeviceId}
                    disabled={isChangingDeviceId || !newDeviceId.trim() || newDeviceId === user?.deviceId}
                  >
                    {isChangingDeviceId ? 'Changing...' : 'Change'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this to transfer your account to another device. Enter the device ID of the other device.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl mb-6 space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <LogOut className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Account Actions</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border-l-2 border-yellow-500 rounded-lg">
              <p className="text-sm mb-2">
                <span className="font-medium">Logout Device</span>
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                This will log you out from this device. Your data will be preserved and you can log back in using this device.
              </p>
              <Button
                variant="outline"
                className="border-yellow-500/50 text-yellow-500 hover:text-yellow-600"
                onClick={logoutUser}
              >
                Logout Device
              </Button>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="p-4 bg-red-500/10 border-l-2 border-red-500 rounded-lg cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Delete Account</span>
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        This will permanently delete all your data associated with this device ID. This action cannot be undone.
                      </p>
                    </div>
                    <Trash2 className="h-5 w-5 text-red-500 flex-shrink-0" />
                  </div>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Account Permanently
                  </Button>
                </div>
              </AlertDialogTrigger>
              
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={deleteAccount}
                  >
                    Yes, Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      
      {isMobile && (
        <MobileBottomMenu activeTab="settings" onChangeTab={(tab) => window.location.href = `/${tab === 'generate' ? '' : tab}`} />
      )}
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
