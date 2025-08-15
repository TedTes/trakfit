import { create } from 'zustand';

// Default user profile based on your AI Input → Output Mapping schema
const defaultProfile = {
  personalProfile: {
    age: 28,
    sex: 'male',
    height: 175, // cm
    weight: 70, // kg
    bodyComposition: 'average', // lean, average, athletic
    injuryHistory: [], // array of injury descriptions
    activityLevel: 'moderately_active' // sedentary, lightly_active, moderately_active, very_active
  },
  fitnessGoals: {
    primary: 'strength', // strength, fat_loss, endurance, mobility
    secondary: 'muscle_gain',
    timeline: '3_months' // 1_month, 3_months, 6_months, 1_year
  },
  dietaryPreferences: {
    cuisines: ['american', 'mediterranean'], // array of preferred cuisines
    allergies: [], // array of allergens
    dietType: 'omnivore', // omnivore, vegetarian, vegan, pescatarian
    macroTargets: {
      protein: 120, // grams
      carbs: 200,
      fats: 65,
      calories: 1800
    }
  },
  equipmentAvailability: {
    homeGym: false,
    commercialGym: true,
    noEquipment: true // bodyweight exercises
  },
  lifestyleAssessment: {
    sleepPatterns: {
      averageHours: 7,
      quality: 'good', // poor, fair, good, excellent
      bedtime: '23:00',
      wakeTime: '07:00'
    },
    stressLevel: 'moderate', // low, moderate, high
    timeAvailable: 45, // minutes per day for fitness
    recoveryHabits: {
      stretching: 'sometimes', // never, sometimes, regularly
      hydration: 'good', // poor, fair, good, excellent
      restDays: 2 // days per week
    }
  }
};

export const useUserProfileStore = create((set, get) => ({
  // Current user profile
  profile: defaultProfile,
  
  // Profile completion status
  isProfileComplete: false,
  onboardingStep: 0, // 0 = not started, 1-5 = steps, 6 = complete
  
  // Update functions for each profile section
  updatePersonalProfile: (updates) => {
    set((state) => ({
      profile: {
        ...state.profile,
        personalProfile: { ...state.profile.personalProfile, ...updates }
      }
    }));
  },
  
  updateFitnessGoals: (updates) => {
    set((state) => ({
      profile: {
        ...state.profile,
        fitnessGoals: { ...state.profile.fitnessGoals, ...updates }
      }
    }));
  },
  
  updateDietaryPreferences: (updates) => {
    set((state) => ({
      profile: {
        ...state.profile,
        dietaryPreferences: { ...state.profile.dietaryPreferences, ...updates }
      }
    }));
  },
  
  updateEquipmentAvailability: (updates) => {
    set((state) => ({
      profile: {
        ...state.profile,
        equipmentAvailability: { ...state.profile.equipmentAvailability, ...updates }
      }
    }));
  },
  
  updateLifestyleAssessment: (updates) => {
    set((state) => ({
      profile: {
        ...state.profile,
        lifestyleAssessment: { ...state.profile.lifestyleAssessment, ...updates }
      }
    }));
  },
  
  // Bulk profile update
  updateProfile: (updates) => {
    set((state) => ({
      profile: { ...state.profile, ...updates }
    }));
  },
  
  // Onboarding management
  setOnboardingStep: (step) => {
    set({ onboardingStep: step });
    if (step >= 6) {
      set({ isProfileComplete: true });
    }
  },
  
  completeOnboarding: () => {
    set({ 
      onboardingStep: 6,
      isProfileComplete: true 
    });
  },
  
  // Reset profile (for testing/development)
  resetProfile: () => {
    set({
      profile: defaultProfile,
      isProfileComplete: false,
      onboardingStep: 0
    });
  },
  
  // Profile validation
  validateProfile: () => {
    const { profile } = get();
    
    // Check if essential fields are filled
    const hasPersonalInfo = profile.personalProfile.age && 
                           profile.personalProfile.sex && 
                           profile.personalProfile.height && 
                           profile.personalProfile.weight;
    
    const hasGoals = profile.fitnessGoals.primary;
    const hasEquipment = profile.equipmentAvailability.homeGym || 
                        profile.equipmentAvailability.commercialGym || 
                        profile.equipmentAvailability.noEquipment;
    
    return hasPersonalInfo && hasGoals && hasEquipment;
  },
  
  // Getters for AI engine
  getAIInputData: () => {
    const { profile } = get();
    
    // Format profile data for AI engine consumption
    return {
      // Personal metrics for AI calculations
      age: profile.personalProfile.age,
      sex: profile.personalProfile.sex,
      height: profile.personalProfile.height,
      weight: profile.personalProfile.weight,
      bmi: profile.personalProfile.weight / Math.pow(profile.personalProfile.height / 100, 2),
      activityLevel: profile.personalProfile.activityLevel,
      
      // Goals for plan customization
      primaryGoal: profile.fitnessGoals.primary,
      secondaryGoal: profile.fitnessGoals.secondary,
      timeline: profile.fitnessGoals.timeline,
      
      // Equipment for exercise selection
      availableEquipment: Object.keys(profile.equipmentAvailability)
        .filter(key => profile.equipmentAvailability[key]),
      
      // Lifestyle for intensity/recovery adjustments
      sleepQuality: profile.lifestyleAssessment.sleepPatterns.quality,
      sleepHours: profile.lifestyleAssessment.sleepPatterns.averageHours,
      stressLevel: profile.lifestyleAssessment.stressLevel,
      timeAvailable: profile.lifestyleAssessment.timeAvailable,
      
      // Dietary for nutrition planning
      dietType: profile.dietaryPreferences.dietType,
      allergies: profile.dietaryPreferences.allergies,
      macroTargets: profile.dietaryPreferences.macroTargets,
      
      // Restrictions
      injuries: profile.personalProfile.injuryHistory
    };
  },
  
  // Helper functions
  getTDEE: () => {
    const { profile } = get();
    const { age, sex, height, weight, activityLevel } = profile.personalProfile;
    
    // Mifflin-St Jeor equation
    let bmr;
    if (sex === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725
    };
    
    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  },
  
  getExperienceLevel: () => {
    const { profile } = get();
    const { activityLevel } = profile.personalProfile;
    
    // Map activity level to experience
    const experienceMap = {
      sedentary: 'beginner',
      lightly_active: 'beginner',
      moderately_active: 'intermediate',
      very_active: 'advanced'
    };
    
    return experienceMap[activityLevel] || 'beginner';
  }
}));