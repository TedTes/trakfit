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
  
  // Reset profile (for testing/development)
  resetProfile: () => {
    set({
      profile: defaultProfile
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
  },
  // Profile completion tracking functions
  getProfileCompletionStatus: () => {
    const profile = get().profile;
    
    const sections = {
      personalProfile: {
        name: 'Personal Info',
        description: 'Age, weight, activity level',
        fields: ['age', 'weight', 'activityLevel'],
        completed: profile.personalProfile.age && 
                  profile.personalProfile.weight && 
                  profile.personalProfile.activityLevel !== undefined
      },
      fitnessGoals: {
        name: 'Fitness Goals',
        description: 'Primary goal, timeline',
        fields: ['primary', 'timeline'],
        completed: profile.fitnessGoals.primary && 
                  profile.fitnessGoals.timeline
      },
      equipmentAvailability: {
        name: 'Equipment Access',
        description: 'Gym, home equipment',
        fields: ['homeGym', 'commercialGym', 'noEquipment'],
        completed: profile.equipmentAvailability.homeGym !== undefined ||
                  profile.equipmentAvailability.commercialGym !== undefined ||
                  profile.equipmentAvailability.noEquipment !== undefined
      },
      dietaryPreferences: {
        name: 'Nutrition Profile',
        description: 'Diet type, preferences',
        fields: ['dietType', 'cuisines'],
        completed: profile.dietaryPreferences.dietType && 
                  profile.dietaryPreferences.cuisines.length > 0
      },
      lifestyleAssessment: {
        name: 'Lifestyle & Recovery',
        description: 'Sleep, stress, time available',
        fields: ['sleepPatterns', 'stressLevel', 'timeAvailable'],
        completed: profile.lifestyleAssessment.sleepPatterns.averageHours > 0 &&
                  profile.lifestyleAssessment.stressLevel &&
                  profile.lifestyleAssessment.timeAvailable > 0
      }
    };

    const completedSections = Object.values(sections).filter(section => section.completed);
    const completionPercentage = Math.round((completedSections.length / Object.keys(sections).length) * 100);

    return {
      sections,
      completedCount: completedSections.length,
      totalCount: Object.keys(sections).length,
      percentage: completionPercentage,
      isBasicComplete: sections.personalProfile.completed && sections.fitnessGoals.completed,
      isFullComplete: completionPercentage === 100
    };
  },

  // Get AI power level based on completion
  getAIPowerLevel: () => {
    const completion = get().getProfileCompletionStatus();
    
    // AI power levels based on which sections are complete
    let powerLevel = 25; // Base level with just age/goal
    
    if (completion.sections.personalProfile.completed) powerLevel = 35;
    if (completion.sections.fitnessGoals.completed) powerLevel = 50;
    if (completion.sections.equipmentAvailability.completed) powerLevel = 65;
    if (completion.sections.dietaryPreferences.completed) powerLevel = 80;
    if (completion.sections.lifestyleAssessment.completed) powerLevel = 100;
    
    return {
      level: powerLevel,
      description: get().getAIPowerDescription(powerLevel),
      nextUnlock: get().getNextUnlock(completion.sections)
    };
  },

  // Get description of what AI can do at current power level
  getAIPowerDescription: (level) => {
    if (level >= 100) return "Full holistic coaching with personalized recovery & nutrition";
    if (level >= 80) return "Advanced workouts with nutrition planning";
    if (level >= 65) return "Equipment-optimized workouts with meal suggestions";
    if (level >= 50) return "Goal-focused workouts with basic meal ideas";
    if (level >= 35) return "Personalized basic workouts";
    return "Simple workout recommendations";
  },

  // Get next unlock incentive
  getNextUnlock: (sections) => {
    if (!sections.personalProfile.completed) return "Complete personal info for better workouts";
    if (!sections.fitnessGoals.completed) return "Set goals for targeted training plans";
    if (!sections.equipmentAvailability.completed) return "Add equipment for optimized exercises";
    if (!sections.dietaryPreferences.completed) return "Complete nutrition profile for meal plans";
    if (!sections.lifestyleAssessment.completed) return "Add lifestyle info for recovery optimization";
    return "Profile complete! Maximum AI power achieved 🎉";
  },
}));