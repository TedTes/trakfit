export class AICoachEngine {
  constructor(userProfile) {
    // Handle both old and new profile structures
    this.userProfile = this.normalizeProfile(userProfile);
    this.today = new Date();
  }

  normalizeProfile(profile) {
    // If profile is already normalized, return as-is
    if (profile.personalProfile) {
      return profile;
    }

    // Convert flat profile to expected nested structure
    return {
      personalProfile: {
        age: profile.age || 25,
        sex: profile.sex || 'male',
        height: profile.height || 170,
        weight: profile.weight || 70,
        activityLevel: profile.activityLevel || 'moderately_active'
      },
      fitnessGoals: {
        primary: profile.primary || profile.fitnessGoals?.primary || 'general_fitness',
        secondary: profile.secondary || profile.fitnessGoals?.secondary || null,
        timeline: profile.timeline || profile.fitnessGoals?.timeline || '6_months'
      },
      equipmentAvailability: {
        homeGym: profile.homeGym || profile.equipmentAvailability?.homeGym || false,
        commercialGym: profile.commercialGym || profile.equipmentAvailability?.commercialGym || true,
        noEquipment: profile.noEquipment || profile.equipmentAvailability?.noEquipment || false,
        homeEquipment: profile.homeEquipment || profile.equipmentAvailability?.homeEquipment || {}
      },
      dietaryPreferences: {
        dietType: profile.dietType || profile.dietaryPreferences?.dietType || 'omnivore',
        allergies: profile.allergies || profile.dietaryPreferences?.allergies || [],
        cuisinePreferences: profile.cuisinePreferences || profile.dietaryPreferences?.cuisinePreferences || [],
        calorieTarget: profile.calorieTarget || profile.dietaryPreferences?.calorieTarget || null,
        proteinTarget: profile.proteinTarget || profile.dietaryPreferences?.proteinTarget || null
      },
      lifestyleAssessment: {
        sleepQuality: profile.sleepQuality || profile.lifestyleAssessment?.sleepQuality || 'good',
        sleepDuration: profile.sleepDuration || profile.lifestyleAssessment?.sleepDuration || '7_8',
        stressLevel: profile.stressLevel || profile.lifestyleAssessment?.stressLevel || 'moderate',
        timeAvailable: profile.timeAvailable || profile.lifestyleAssessment?.timeAvailable || '30_45',
        workoutDays: profile.workoutDays || profile.lifestyleAssessment?.workoutDays || '3_4',
        recoveryHabits: profile.recoveryHabits || profile.lifestyleAssessment?.recoveryHabits || []
      }
    };
  }

  generateTodaysPlan() {
    try {
      // Holistic plan considering all 4 pillars
      return {
        workout: this.generateWorkoutPlan(),
        nutrition: this.generateNutritionPlan(),  
        recovery: this.generateRecoveryPlan(),
        mindset: this.generateMindsetGuidance()
      };
    } catch (error) {
      console.error('Error generating today\'s plan:', error);
      // Return fallback but don't crash
      return this.getFallbackPlan();
    }
  }

  generateWorkoutPlan() {
    const { personalProfile, fitnessGoals, equipmentAvailability, lifestyleAssessment } = this.userProfile;
    
    // 1. Determine workout intensity based on age and recovery
    const intensity = this.calculateWorkoutIntensity();
    
    // 2. Select exercises based on goals and equipment
    const exercises = this.selectExercises();
    
    // 3. Generate coaching notes
    const coachingNotes = this.generateCoachingNotes();
    
    // 4. Calculate workout time
    const estimatedTime = this.calculateWorkoutTime(exercises.length);

    return {
      id: `workout_${Date.now()}`,
      title: this.generateWorkoutTitle(),
      subtitle: `${exercises.length} exercises • ${estimatedTime} minutes`,
      exercises: exercises,
      estimated_total_time: estimatedTime,
      goal: fitnessGoals.primary,
      coaching_notes: coachingNotes,
      intensity_level: intensity,
      ai_generated: true,
      generated_at: new Date().toISOString()
    };
  }

  // FIXED: Properly calculate workout intensity
  calculateWorkoutIntensity() {
    const { personalProfile, lifestyleAssessment } = this.userProfile;
    
    let intensityScore = 5; // Base intensity (1-10 scale)
    
    // Age adjustments
    if (personalProfile.age > 50) intensityScore -= 2;
    else if (personalProfile.age > 35) intensityScore -= 1;
    else if (personalProfile.age < 25) intensityScore += 1;
    
    // Activity level adjustments
    const activityMultipliers = {
      sedentary: -2,
      lightly_active: -1,
      moderately_active: 0,
      very_active: +1
    };
    intensityScore += activityMultipliers[personalProfile.activityLevel] || 0;
    
    // Sleep quality adjustments
    const sleepAdjustments = {
      poor: -2,
      fair: -1,
      good: 0,
      excellent: +1
    };
    intensityScore += sleepAdjustments[lifestyleAssessment.sleepQuality] || 0;
    
    // Stress level adjustments
    const stressAdjustments = {
      low: +1,
      moderate: 0,
      high: -1,
      very_high: -2
    };
    intensityScore += stressAdjustments[lifestyleAssessment.stressLevel] || 0;
    
    return Math.max(1, Math.min(10, intensityScore));
  }

  // FIXED: Exercise selection based on user profile
  selectExercises() {
    const { fitnessGoals, equipmentAvailability, lifestyleAssessment } = this.userProfile;
    const exercisePool = this.getExercisePool();
    
    // Filter exercises by available equipment
    let availableExercises = exercisePool.filter(exercise => {
      if (equipmentAvailability.noEquipment) {
        return exercise.equipment === 'bodyweight';
      }
      if (equipmentAvailability.homeGym) {
        return exercise.equipment === 'bodyweight' || 
               exercise.equipment === 'dumbbells' || 
               exercise.equipment === 'resistance_bands';
      }
      if (equipmentAvailability.commercialGym) {
        return true; // All exercises available
      }
      return exercise.equipment === 'bodyweight'; // Default fallback
    });

    // Select exercises based on primary goal
    const goalExercises = this.filterExercisesByGoal(availableExercises, fitnessGoals.primary);
    
    // Determine number of exercises based on time available
    const timeSlots = {
      '15_30': 3,
      '30_45': 5,
      '45_60': 7,
      '60_plus': 9
    };
    const exerciseCount = timeSlots[lifestyleAssessment.timeAvailable] || 5;
    
    // Return selected exercises with proper formatting
    return goalExercises.slice(0, exerciseCount).map((exercise, index) => ({
      id: `exercise_${index + 1}`,
      name: exercise.name,
      target: exercise.target,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.rest,
      equipment: exercise.equipment,
      color: this.getExerciseColor(exercise.target),
      instructions: exercise.instructions || `Perform ${exercise.name} with proper form`
    }));
  }

  // NEW: Exercise pool with proper equipment filtering
  getExercisePool() {
    return [
      // Bodyweight exercises
      { name: "Push-ups", target: "CHEST", equipment: "bodyweight", sets: 3, reps: "8-15", rest: "60s", instructions: "Keep your body straight from head to toe" },
      { name: "Pull-ups", target: "BACK", equipment: "bodyweight", sets: 3, reps: "5-10", rest: "90s", instructions: "Pull your chest to the bar" },
      { name: "Squats", target: "LEGS", equipment: "bodyweight", sets: 3, reps: "12-20", rest: "60s", instructions: "Keep your knees behind your toes" },
      { name: "Lunges", target: "LEGS", equipment: "bodyweight", sets: 3, reps: "10-15", rest: "60s", instructions: "Step forward and lower your back knee" },
      { name: "Planks", target: "CORE", equipment: "bodyweight", sets: 3, reps: "30-60s", rest: "45s", instructions: "Hold a straight line from head to heels" },
      { name: "Mountain Climbers", target: "CORE", equipment: "bodyweight", sets: 3, reps: "20-30", rest: "45s", instructions: "Keep your hips level throughout" },
      
      // Dumbbell exercises
      { name: "Dumbbell Press", target: "CHEST", equipment: "dumbbells", sets: 3, reps: "8-12", rest: "90s", instructions: "Lower weights to chest level" },
      { name: "Dumbbell Rows", target: "BACK", equipment: "dumbbells", sets: 3, reps: "10-15", rest: "75s", instructions: "Pull weights to your ribs" },
      { name: "Dumbbell Squats", target: "LEGS", equipment: "dumbbells", sets: 3, reps: "10-15", rest: "90s", instructions: "Hold dumbbells at your sides" },
      { name: "Shoulder Press", target: "SHOULDERS", equipment: "dumbbells", sets: 3, reps: "8-12", rest: "75s", instructions: "Press weights overhead" },
      
      // Gym equipment exercises
      { name: "Bench Press", target: "CHEST", equipment: "gym", sets: 3, reps: "6-10", rest: "120s", instructions: "Lower bar to chest, press up" },
      { name: "Lat Pulldown", target: "BACK", equipment: "gym", sets: 3, reps: "8-12", rest: "90s", instructions: "Pull bar to upper chest" },
      { name: "Leg Press", target: "LEGS", equipment: "gym", sets: 3, reps: "10-15", rest: "90s", instructions: "Lower weight until knees at 90 degrees" },
      { name: "Cable Rows", target: "BACK", equipment: "gym", sets: 3, reps: "10-15", rest: "75s", instructions: "Pull handle to your abdomen" }
    ];
  }

  // NEW: Filter exercises by fitness goal
  filterExercisesByGoal(exercises, goal) {
    const goalPriorities = {
      strength: exercises.filter(ex => ["CHEST", "BACK", "LEGS", "SHOULDERS"].includes(ex.target)),
      fat_loss: exercises.filter(ex => ["CORE", "LEGS", "CHEST", "BACK"].includes(ex.target)),
      muscle_gain: exercises.filter(ex => ["CHEST", "BACK", "LEGS", "SHOULDERS"].includes(ex.target)),
      endurance: exercises.filter(ex => ["CORE", "LEGS"].includes(ex.target)),
      mobility: exercises.filter(ex => ["CORE", "LEGS"].includes(ex.target)),
      general_fitness: exercises // All exercises for general fitness
    };
    
    return goalPriorities[goal] || exercises;
  }

  // NEW: Generate workout title based on goal and intensity
  generateWorkoutTitle() {
    const { fitnessGoals } = this.userProfile;
    const intensity = this.calculateWorkoutIntensity();
    
    const titles = {
      strength: intensity >= 7 ? "Power Builder" : "Strength Foundation",
      fat_loss: intensity >= 7 ? "Fat Burning Circuit" : "Metabolic Boost", 
      muscle_gain: intensity >= 7 ? "Muscle Building Blast" : "Growth Session",
      endurance: "Endurance Builder",
      mobility: "Mobility Flow",
      general_fitness: "Balanced Training"
    };
    
    return titles[fitnessGoals.primary] || "AI Workout";
  }

  // NEW: Generate personalized coaching notes
  generateCoachingNotes() {
    const { personalProfile, fitnessGoals, lifestyleAssessment } = this.userProfile;
    const notes = [];
    
    // Age-based advice
    if (personalProfile.age > 40) {
      notes.push("Focus on warming up thoroughly before starting");
    }
    
    // Goal-based advice
    if (fitnessGoals.primary === 'strength') {
      notes.push("Focus on progressive overload - add weight when possible");
    } else if (fitnessGoals.primary === 'fat_loss') {
      notes.push("Keep rest periods short to maintain intensity");
    }
    
    // Stress-based advice
    if (lifestyleAssessment.stressLevel === 'high' || lifestyleAssessment.stressLevel === 'very_high') {
      notes.push("Listen to your body - reduce intensity if feeling overwhelmed");
    }
    
    // Sleep-based advice
    if (lifestyleAssessment.sleepQuality === 'poor') {
      notes.push("Consider a lighter workout today due to poor sleep");
    }
    
    return notes.length > 0 ? notes : ["Focus on proper form over speed", "Stay hydrated throughout"];
  }

  // NEW: Get exercise color by muscle group
  getExerciseColor(target) {
    const colors = {
      CHEST: "#22c55e",
      BACK: "#3b82f6", 
      LEGS: "#f59e0b",
      SHOULDERS: "#8b5cf6",
      CORE: "#ef4444",
      ARMS: "#06b6d4"
    };
    return colors[target] || "#6366f1";
  }

  // NEW: Calculate workout time based on exercises
  calculateWorkoutTime(exerciseCount) {
    // Rough estimate: 7 minutes per exercise (including rest)
    return Math.round(exerciseCount * 7);
  }

  // NEW: Fallback plan if AI generation fails
  getFallbackPlan() {
    return {
      workout: {
        title: "Basic Workout",
        subtitle: "3 exercises • 25 minutes",
        exercises: [
          {
            id: 1,
            name: "Push-ups",
            target: "CHEST",
            sets: 3,
            reps: "8-12",
            rest: "60s",
            color: "#22c55e"
          },
          {
            id: 2,
            name: "Squats", 
            target: "LEGS",
            sets: 3,
            reps: "12-15",
            rest: "60s",
            color: "#f59e0b"
          },
          {
            id: 3,
            name: "Planks",
            target: "CORE", 
            sets: 3,
            reps: "30-45s",
            rest: "45s",
            color: "#ef4444"
          }
        ],
        estimated_total_time: 25,
        goal: "general_fitness",
        coaching_notes: ["Focus on proper form", "Complete profile for personalized workouts"],
        ai_generated: false
      },
      nutrition: {
        title: "Basic Nutrition",
        macros: { protein: 100, carbs: 150, fats: 50, calories: 1500 },
        meals: [],
        tip: "Complete your dietary preferences for personalized meal plans"
      },
      recovery: {
        title: "Recovery Basics",
        sleep_target: { hours: 8, bedtime: "22:30", wakeTime: "06:30" }
      },
      mindset: {
        title: "Stay Motivated",
        daily_affirmation: "Every workout brings you closer to your goals!"
      }
    };
  }

  // Placeholder methods for nutrition, recovery, mindset (to be implemented)
  generateNutritionPlan() {
    const { personalProfile, fitnessGoals, dietaryPreferences } = this.userProfile;
    
    // Calculate basic calorie needs
    const bmr = this.calculateBMR();
    const calories = Math.round(bmr * this.getActivityMultiplier());
    
    return {
      id: `nutrition_${Date.now()}`,
      title: "Personalized Nutrition Plan",
      macros: {
        calories: calories,
        protein: Math.round(personalProfile.weight * 1.6), // 1.6g per kg bodyweight
        carbs: Math.round(calories * 0.45 / 4), // 45% of calories
        fats: Math.round(calories * 0.25 / 9) // 25% of calories
      },
      meals: this.generateMealSuggestions(),
      tip: "Meal plans optimized for your " + fitnessGoals.primary + " goal"
    };
  }

  calculateBMR() {
    const { age, sex, height, weight } = this.userProfile.personalProfile;
    
    if (sex === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }

  getActivityMultiplier() {
    const activityLevels = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725
    };
    return activityLevels[this.userProfile.personalProfile.activityLevel] || 1.55;
  }

  generateMealSuggestions() {
    return [
      { type: "breakfast", name: "Protein Oatmeal", protein: 25, carbs: 45, fats: 12 },
      { type: "lunch", name: "Balanced Bowl", protein: 35, carbs: 40, fats: 15 },
      { type: "dinner", name: "Lean Protein & Veggies", protein: 40, carbs: 30, fats: 18 }
    ];
  }

  generateRecoveryPlan() {
    return {
      id: `recovery_${Date.now()}`,
      title: "Recovery Optimization",
      sleep_target: this.calculateSleepTarget(),
      stress_management: ["Deep breathing", "Light stretching"],
      recovery_activities: ["Gentle walk", "Foam rolling"]
    };
  }

  calculateSleepTarget() {
    const { age } = this.userProfile.personalProfile;
    let baseHours = 8;
    if (age < 25) baseHours = 8.5;
    if (age > 50) baseHours = 7.5;
    
    return {
      hours: baseHours,
      bedtime: "22:30",
      wakeTime: "06:30"
    };
  }

  generateMindsetGuidance() {
    const { fitnessGoals } = this.userProfile;
    
    const affirmations = {
      strength: "I am getting stronger with every rep!",
      fat_loss: "Every healthy choice moves me closer to my goal!",
      muscle_gain: "I am building the body I want!",
      endurance: "My stamina improves with each workout!",
      mobility: "I am becoming more flexible and mobile!",
      general_fitness: "I am investing in my health and future!"
    };

    return {
      id: `mindset_${Date.now()}`,
      title: "Mindset & Motivation",
      daily_affirmation: affirmations[fitnessGoals.primary] || affirmations.general_fitness,
      motivation_tip: "Consistency beats perfection every time"
    };
  }
}