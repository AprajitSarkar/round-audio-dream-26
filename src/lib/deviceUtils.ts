
import { Device } from '@capacitor/device';

// Default device ID stored in localStorage
let storedDeviceId: string | null = null;

// Get device ID for user identification
export const getDeviceId = async (): Promise<string> => {
  // First check if we have a manually stored device ID
  if (storedDeviceId) {
    console.log("Using cached device ID:", storedDeviceId);
    return storedDeviceId;
  }
  
  // Then check localStorage
  const savedId = localStorage.getItem('device_id');
  if (savedId) {
    console.log("Using device ID from localStorage:", savedId);
    storedDeviceId = savedId;
    return savedId;
  }
  
  try {
    console.log("Attempting to get native device ID");
    // Try to get the native device ID
    const info = await Device.getId();
    if (info.identifier) {
      console.log("Got native device ID:", info.identifier);
      // Save the native device ID to localStorage
      localStorage.setItem('device_id', info.identifier);
      storedDeviceId = info.identifier;
      return info.identifier;
    }
    
    console.log("No native ID available, generating fallback");
    // If we couldn't get a native ID, generate a fallback one
    const fallbackId = `web-${Math.random().toString(36).substring(2, 15)}`;
    console.log("Generated fallback ID:", fallbackId);
    localStorage.setItem('device_id', fallbackId);
    storedDeviceId = fallbackId;
    return fallbackId;
  } catch (error) {
    console.error("Error getting device ID:", error);
    
    // Generate a fallback ID and store it in localStorage for web testing
    let fallbackId = localStorage.getItem('device_id');
    if (!fallbackId) {
      fallbackId = `web-${Math.random().toString(36).substring(2, 15)}`;
      console.log("Generated error fallback ID:", fallbackId);
      localStorage.setItem('device_id', fallbackId);
    } else {
      console.log("Using existing fallback ID:", fallbackId);
    }
    storedDeviceId = fallbackId;
    return fallbackId;
  }
};

// Set a custom device ID
export const setCustomDeviceId = (deviceId: string): void => {
  console.log("Setting custom device ID:", deviceId);
  localStorage.setItem('device_id', deviceId);
  storedDeviceId = deviceId;
};

// Check if device is registered
export const isDeviceRegistered = async (): Promise<boolean> => {
  const deviceId = await getDeviceId();
  const isRegistered = localStorage.getItem(`device_${deviceId}_registered`) === 'true';
  console.log("Device registration status:", isRegistered);
  return isRegistered;
};

// Register device
export const registerDevice = async (): Promise<void> => {
  const deviceId = await getDeviceId();
  console.log("Registering device:", deviceId);
  localStorage.setItem(`device_${deviceId}_registered`, 'true');
};

// Unregister device
export const unregisterDevice = async (): Promise<void> => {
  const deviceId = await getDeviceId();
  console.log("Unregistering device:", deviceId);
  localStorage.removeItem(`device_${deviceId}_registered`);
};
