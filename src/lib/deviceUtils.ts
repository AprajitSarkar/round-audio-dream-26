
import { Device } from '@capacitor/device';

// Get device ID for user identification
export const getDeviceId = async (): Promise<string> => {
  try {
    const info = await Device.getId();
    return info.identifier || 'unknown-device';
  } catch (error) {
    console.error("Error getting device ID:", error);
    
    // Generate a fallback ID and store it in localStorage for web testing
    let fallbackId = localStorage.getItem('device_id');
    if (!fallbackId) {
      fallbackId = `web-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('device_id', fallbackId);
    }
    return fallbackId;
  }
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
