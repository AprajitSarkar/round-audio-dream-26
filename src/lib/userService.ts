
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getDeviceId } from "./deviceUtils";

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
export const createUser = async (username: string): Promise<UserData> => {
  const deviceId = await getDeviceId();
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
  
  await setDoc(doc(db, "users", deviceId), userData);
  return userData;
};

// Get user data
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const deviceId = await getDeviceId();
    const docRef = doc(db, "users", deviceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Update user credits
export const updateUserCredits = async (credits: number): Promise<void> => {
  try {
    const deviceId = await getDeviceId();
    const docRef = doc(db, "users", deviceId);
    await updateDoc(docRef, { credits });
  } catch (error) {
    console.error("Error updating user credits:", error);
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
    
    const docRef = doc(db, "users", deviceId);
    await updateDoc(docRef, { generationHistory: limitedHistory });
  } catch (error) {
    console.error("Error adding to history:", error);
  }
};

// Log ad watch and add credits
export const logAdWatch = async (
  type: 'rewarded' | 'interstitial'
): Promise<boolean> => {
  try {
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
    const deviceId = await getDeviceId();
    await deleteDoc(doc(db, "users", deviceId));
  } catch (error) {
    console.error("Error deleting user data:", error);
  }
};
