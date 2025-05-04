
import { Device } from '@capacitor/device';

// Default device ID stored in localStorage
let storedDeviceId: string | null = null;

// Get device ID for user identification
export const getDeviceId = async (): Promise<string> => {
  // First check if we have a manually stored device ID
  if (storedDeviceId) {
    return storedDeviceId;
  }
  
  // Then check localStorage
  const savedId = localStorage.getItem('device_id');
  if (savedId) {
    storedDeviceId = savedId;
    return savedId;
  }
  
  try {
    // Try to get the native device ID
    const info = await Device.getId();
    if (info.identifier) {
      // Save the native device ID to localStorage
      localStorage.setItem('device_id', info.identifier);
      storedDeviceId = info.identifier;
      return info.identifier;
    }
    
    // If we couldn't get a native ID, generate a fallback one
    const fallbackId = `web-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('device_id', fallbackId);
    storedDeviceId = fallbackId;
    return fallbackId;
  } catch (error) {
    console.error("Error getting device ID:", error);
    
    // Generate a fallback ID and store it in localStorage for web testing
    let fallbackId = localStorage.getItem('device_id');
    if (!fallbackId) {
      fallbackId = `web-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('device_id', fallbackId);
    }
    storedDeviceId = fallbackId;
    return fallbackId;
  }
};

// Set a custom device ID
export const setCustomDeviceId = (deviceId: string): void => {
  localStorage.setItem('device_id', deviceId);
  storedDeviceId = deviceId;
};

// Check if device is registered
export const isDeviceRegistered = async (): Promise<boolean> => {
  const deviceId = await getDeviceId();
  return localStorage.getItem(`device_${deviceId}_registered`) === 'true';
};

// Register device
export const registerDevice = async (): Promise<void> => {
  const deviceId = await getDeviceId();
  localStorage.setItem(`device_${deviceId}_registered`, 'true');
};

// Unregister device
export const unregisterDevice = async (): Promise<void> => {
  const deviceId = await getDeviceId();
  localStorage.removeItem(`device_${deviceId}_registered`);
};
