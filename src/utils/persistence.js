import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

// Create persistent storage for Zustand
export const persistentStorage = createJSONStorage(() => AsyncStorage);

// Storage keys for different stores
export const STORAGE_KEYS = {
  USER_PROFILE: 'user-profile-store',
  WORKOUT: 'workout-store', 
  LOGS: 'logs-store'
};

// Persistence configuration for user profile store
export const userProfilePersistConfig = {
  name: STORAGE_KEYS.USER_PROFILE,
  storage: persistentStorage,
  // Only persist profile data, not temporary UI state
  partialize: (state) => ({
    profile: state.profile
  }),
};

// Persistence configuration for workout store  
export const workoutPersistConfig = {
  name: STORAGE_KEYS.WORKOUT,
  storage: persistentStorage,
  // Persist workout state and history
  partialize: (state) => ({
    currentWorkout: state.currentWorkout,
    isWorkoutActive: state.isWorkoutActive,
    currentExerciseIndex: state.currentExerciseIndex,
    startTime: state.startTime,
    completedSets: state.completedSets,
    workoutHistory: state.workoutHistory
  }),
};

// Persistence configuration for logs store
export const logsPersistConfig = {
  name: STORAGE_KEYS.LOGS,
  storage: persistentStorage,
  // Persist all logs data
  partialize: (state) => ({
    workoutsByDate: state.workoutsByDate,
    mealsByDate: state.mealsByDate,
    recoveryByDate: state.recoveryByDate,
    habitsByDate: state.habitsByDate,
  }),
};

// Helper function to clear all persisted data (for development/testing)
export const clearPersistedData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROFILE,
      STORAGE_KEYS.WORKOUT,
      STORAGE_KEYS.LOGS
    ]);
    console.log('✅ All persisted data cleared');
  } catch (error) {
    console.error('❌ Error clearing persisted data:', error);
  }
};

// Helper function to get current storage usage (for debugging)
export const getStorageInfo = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => 
      Object.values(STORAGE_KEYS).includes(key)
    );
    
    console.log('📱 App storage keys:', appKeys);
    
    for (const key of appKeys) {
      const data = await AsyncStorage.getItem(key);
      console.log(`💾 ${key}:`, data ? `${data.length} chars` : 'empty');
    }
  } catch (error) {
    console.error('❌ Error getting storage info:', error);
  }
};

// Migration helper (for future use when data structure changes)
export const migrateStorageIfNeeded = async () => {
  try {
    // TODO: Check if migration is needed (version checking logic here)
    console.log('🔄 Storage migration system ready');
  } catch (error) {
    console.error('❌ Error during storage migration:', error);
  }
};