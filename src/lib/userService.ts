import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getDeviceId, setCustomDeviceId } from "./deviceUtils";

export interface UserData {
  deviceId: string;
  username: string;
  credits: number;
  dailyAdsWatched: {
    date: string;
    rewarded: number;
    interstitial: number;
  };
  generationHistory: Array<{
    id: number;
    text: string;
    voice: string;
    timestamp: string;
  }>;
}

// Create new user
export const createUser = async (username: string, customDeviceId?: string): Promise<UserData> => {
  try {
    // Check online status first
    if (!navigator.onLine) {
      throw new Error("Network error: You appear to be offline");
    }

    const deviceId = customDeviceId || await getDeviceId();
    console.log("Creating user with deviceId:", deviceId);
    
    // If using custom device ID, set it in local storage
    if (customDeviceId) {
      setCustomDeviceId(customDeviceId);
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const userData: UserData = {
      deviceId,
      username,
      credits: 30, // Initial credits for new users
      dailyAdsWatched: {
        date: today,
        rewarded: 0,
        interstitial: 0
      },
      generationHistory: []
    };
    
    console.log("Preparing to write user data to Firestore:", userData);
    
    // Check if the document already exists
    try {
      const docRef = doc(db, "users", deviceId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log("User with this device ID already exists, updating...");
        await updateDoc(docRef, userData);
      } else {
        console.log("Creating new user document in Firestore");
        await setDoc(docRef, userData);
      }
      
      console.log("User created/updated successfully in Firebase");
      return userData;
    } catch (firestoreError) {
      console.error("Firestore operation failed:", firestoreError);
      
      // Create a local fallback for offline mode
      localStorage.setItem(`user_${deviceId}`, JSON.stringify(userData));
      console.log("Saved user data locally as fallback");
      
      // Still throw the error for proper handling upstream
      throw firestoreError;
    }
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

// Get user data
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const deviceId = await getDeviceId();
    console.log("Getting user data for device ID:", deviceId);
    
    // Try to get from Firestore first
    if (navigator.onLine) {
      try {
        const docRef = doc(db, "users", deviceId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log("User data found in Firestore:", docSnap.data());
          return docSnap.data() as UserData;
        }
      } catch (firestoreError) {
        console.error("Error accessing Firestore:", firestoreError);
      }
    }
    
    // If we're offline or Firestore failed, try to get from local storage
    const localData = localStorage.getItem(`user_${deviceId}`);
    if (localData) {
      console.log("Retrieved user data from local storage");
      return JSON.parse(localData) as UserData;
    }
    
    console.log("No user data found for device ID:", deviceId);
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// The rest of your functions remain the same, just logging if we're offline
// Update user credits
export const updateUserCredits = async (credits: number): Promise<void> => {
  try {
    const deviceId = await getDeviceId();
    const docRef = doc(db, "users", deviceId);
    await updateDoc(docRef, { credits });
  } catch (error) {
    console.error("Error updating user credits:", error);
    if (!navigator.onLine) {
      console.warn("You're offline. Changes will be saved when you're back online.");
    }
  }
};

// Update username
export const updateUsername = async (username: string): Promise<void> => {
  try {
    const deviceId = await getDeviceId();
    const docRef = doc(db, "users", deviceId);
    await updateDoc(docRef, { username });
  } catch (error) {
    console.error("Error updating username:", error);
    if (!navigator.onLine) {
      console.warn("You're offline. Changes will be saved when you're back online.");
    }
  }
};

// Change device ID (transfer account)
export const changeDeviceId = async (newDeviceId: string): Promise<void> => {
  try {
    if (!navigator.onLine) {
      throw new Error("You need to be online to change device ID");
    }
    
    const currentDeviceId = await getDeviceId();
    
    // Get current user data
    const docRef = doc(db, "users", currentDeviceId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("User data not found");
    }
    
    // Create new document with the same data but new device ID
    const userData = docSnap.data() as UserData;
    userData.deviceId = newDeviceId;
    
    // Create new document
    await setDoc(doc(db, "users", newDeviceId), userData);
    
    // Delete old document (optional - you might want to keep it as backup)
    // await deleteDoc(docRef);
  } catch (error) {
    console.error("Error changing device ID:", error);
    throw error;
  }
};

// Add generation to history
export const addToHistory = async (
  text: string, 
  voice: string
): Promise<void> => {
  try {
    const deviceId = await getDeviceId();
    const userData = await getUserData();
    
    if (!userData) return;
    
    const history = [...userData.generationHistory];
    history.unshift({
      id: Date.now(),
      text,
      voice,
      timestamp: new Date().toISOString()
    });
    
    // Limit history to 50 items
    const limitedHistory = history.slice(0, 50);
    
    if (navigator.onLine) {
      const docRef = doc(db, "users", deviceId);
      await updateDoc(docRef, { generationHistory: limitedHistory });
    } else {
      // Update local storage if offline
      userData.generationHistory = limitedHistory;
      localStorage.setItem(`user_${deviceId}`, JSON.stringify(userData));
    }
  } catch (error) {
    console.error("Error adding to history:", error);
  }
};

// Log ad watch and add credits
export const logAdWatch = async (
  type: 'rewarded' | 'interstitial'
): Promise<boolean> => {
  try {
    if (!navigator.onLine) {
      console.warn("You're offline. Ad rewards can't be processed.");
      return false;
    }
    
    const deviceId = await getDeviceId();
    const userData = await getUserData();
    
    if (!userData) return false;
    
    const today = new Date().toISOString().split('T')[0];
    let dailyAdsWatched = userData.dailyAdsWatched;
    
    // Reset counters if it's a new day
    if (dailyAdsWatched.date !== today) {
      dailyAdsWatched = {
        date: today,
        rewarded: 0,
        interstitial: 0
      };
    }
    
    let canWatchAd = false;
    let creditsToAdd = 0;
    
    if (type === 'rewarded' && dailyAdsWatched.rewarded < 3) {
      canWatchAd = true;
      creditsToAdd = 20;
      dailyAdsWatched.rewarded += 1;
    } else if (type === 'interstitial' && dailyAdsWatched.interstitial < 5) {
      canWatchAd = true;
      creditsToAdd = 10;
      dailyAdsWatched.interstitial += 1;
    }
    
    if (canWatchAd) {
      const docRef = doc(db, "users", deviceId);
      await updateDoc(docRef, { 
        dailyAdsWatched,
        credits: userData.credits + creditsToAdd 
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error logging ${type} ad watch:`, error);
    return false;
  }
};

// Delete user data
export const deleteUserData = async (): Promise<void> => {
  try {
    if (!navigator.onLine) {
      throw new Error("You need to be online to delete your account");
    }
    
    const deviceId = await getDeviceId();
    await deleteDoc(doc(db, "users", deviceId));
    
    // Also clear local storage
    localStorage.removeItem(`user_${deviceId}`);
    localStorage.removeItem(`device_${deviceId}_registered`);
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
};
