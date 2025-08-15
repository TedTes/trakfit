export class AICoachEngine {
  constructor(userProfile) {
    this.userProfile = userProfile;
    this.today = new Date();
  }

  generateTodaysPlan() {
    // Holistic plan considering all 4 pillars
    return {
      workout: this.generateWorkoutPlan(),
      nutrition: this.generateNutritionPlan(),  
      recovery: this.generateRecoveryPlan(),
      mindset: this.generateMindsetGuidance()
    };
  }

  generateWorkoutPlan() {
    const { personalProfile, fitnessGoals, equipmentAvailability, lifestyleAssessment } = this.userProfile;
    
    // Apply Input → Output Mapping logic
    
    // 1. Determine workout intensity based on age and recovery
    const intensity = this.calculateWorkoutIntensity();
    
    // 2. Select exercises based on goals and equipment
    const exercises = this.selectExercises();
    
    // 3. Set rep ranges based on goals
    const repRanges = this.getRepRanges();
    
    // 4. Calculate rest times based on age and goals
    const restTimes = this.getRestTimes();
    
    // 5. Estimate total time based on available time
    const estimatedTime = Math.min(lifestyleAssessment.timeAvailable, this.calculateWorkoutTime(exercises.length));
    
    return {
      id: `workout_${Date.now()}`,
      title: this.generateWorkoutTitle(),
      subtitle: `${exercises.length} exercises • ${estimatedTime} minutes`,
      goal: fitnessGoals.primary,
      exercises: exercises.map((exercise, index) => ({
        id: index + 1,
        name: exercise.name,
        target: exercise.target,
        sets: this.getSetsForExercise(exercise),
        reps: repRanges[exercise.type] || "8-12",
        weight: exercise.suggestedWeight,
        rest: restTimes[exercise.type] || "90s",
        color: exercise.color,
        priority: exercise.priority || "NORMAL",
        prescribed_sets: this.getSetsForExercise(exercise),
        prescribed_reps: repRanges[exercise.type] || "8-12",
        prescribed_rest: this.parseRestToSeconds(restTimes[exercise.type] || "90s"),
        muscles: exercise.muscles,
        equipment: exercise.equipment
      })),
      estimated_total_time: estimatedTime,
      coaching_notes: this.generateCoachingNotes(),
      warm_up_required: true,
      cool_down_required: personalProfile.age > 35
    };
  }

  generateNutritionPlan() {
    const { personalProfile, fitnessGoals, dietaryPreferences } = this.userProfile;
    
    // Calculate TDEE using Mifflin-St Jeor equation
    const tdee = this.calculateTDEE();
    
    // Adjust calories based on goals
    const targetCalories = this.adjustCaloriesForGoals(tdee);
    
    // Calculate macros based on goals and preferences
    const macros = this.calculateMacros(targetCalories);
    
    // Generate meals based on preferences and macros
    const meals = this.generateMeals(macros);
    
    return {
      id: `nutrition_${Date.now()}`,
      title: "Personalized Nutrition Plan",
      subtitle: `${targetCalories} calories • ${macros.protein}g protein`,
      macros: macros,
      meals: meals,
      budget: this.calculateBudget(meals),
      tip: this.generateNutritionTip(),
      hydration_target: this.calculateHydrationTarget(),
      meal_timing: this.generateMealTiming()
    };
  }

  generateRecoveryPlan() {
    const { personalProfile, lifestyleAssessment } = this.userProfile;
    
    const sleepTarget = this.calculateSleepTarget();
    const stressManagement = this.getStressManagementPlan();
    const recoveryActivities = this.selectRecoveryActivities();
    
    return {
      id: `recovery_${Date.now()}`,
      title: "Recovery Optimization",
      sleep_target: sleepTarget,
      stress_management: stressManagement,
      recovery_activities: recoveryActivities,
      rest_day_recommendation: this.shouldRecommendRestDay(),
      recovery_score_target: this.calculateRecoveryScoreTarget()
    };
  }

  generateMindsetGuidance() {
    const { personalProfile, fitnessGoals } = this.userProfile;
    
    return {
      id: `mindset_${Date.now()}`,
      title: "Mindset & Motivation",
      daily_affirmation: this.generateDailyAffirmation(),
      motivation_level_check: true,
      habit_focus: this.selectHabitFocus(),
      progress_celebration: this.generateProgressCelebration(),
      goal_reminder: this.generateGoalReminder(),
      mental_health_check: personalProfile.age > 25 // More important for older users
    };
  }

  // Helper Methods - Workout Generation
  calculateWorkoutIntensity() {
    const { personalProfile, lifestyleAssessment } = this.userProfile;
    
    let intensityScore = 5; // Base intensity (1-10 scale)
    
    // Age adjustments (older → lower intensity)
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
    intensityScore += sleepAdjustments[lifestyleAssessment.sleepPatterns?.quality] || 0;
    
    // Stress level adjustments
    const stressAdjustments = {
      low: +1,
      moderate: 0,
      high: -2
    };
    intensityScore += stressAdjustments[lifestyleAssessment.stressLevel] || 0;
    
    return Math.max(1, Math.min(10, intensityScore));
  }

  selectExercises() {
    const { fitnessGoals, equipmentAvailability } = this.userProfile;
    const intensity = this.calculateWorkoutIntensity();
    
    // Exercise database based on goals and equipment
    const exercisePool = this.getExercisePool();
    
    let selectedExercises = [];
    
    // Goal-based exercise selection
    switch (fitnessGoals.primary) {
      case 'strength':
        selectedExercises = this.selectStrengthExercises(exercisePool, intensity);
        break;
      case 'fat_loss':
        selectedExercises = this.selectFatLossExercises(exercisePool, intensity);
        break;
      case 'endurance':
        selectedExercises = this.selectEnduranceExercises(exercisePool, intensity);
        break;
      case 'mobility':
        selectedExercises = this.selectMobilityExercises(exercisePool, intensity);
        break;
      default:
        selectedExercises = this.selectBalancedExercises(exercisePool, intensity);
    }
    
    return selectedExercises.slice(0, Math.min(6, Math.max(3, Math.floor(this.userProfile.lifestyleAssessment.timeAvailable / 8))));
  }

  getExercisePool() {
    const { equipmentAvailability } = this.userProfile;
    
    // Base exercise library
    const exercises = [
      // Bodyweight exercises (always available)
      { name: "Push-ups", target: "CHEST", type: "strength", equipment: ["bodyweight"], muscles: { primary: ["chest"], secondary: ["triceps"] }, color: "#22c55e" },
      { name: "Squats", target: "LEGS", type: "strength", equipment: ["bodyweight"], muscles: { primary: ["quadriceps"], secondary: ["glutes"] }, color: "#3b82f6" },
      { name: "Plank", target: "CORE", type: "stability", equipment: ["bodyweight"], muscles: { primary: ["core"], secondary: ["shoulders"] }, color: "#f59e0b" },
      { name: "Lunges", target: "LEGS", type: "strength", equipment: ["bodyweight"], muscles: { primary: ["quadriceps", "glutes"], secondary: ["calves"] }, color: "#8b5cf6" },
      { name: "Burpees", target: "FULL BODY", type: "cardio", equipment: ["bodyweight"], muscles: { primary: ["full_body"], secondary: [] }, color: "#ef4444" },
      
      // Dumbbell exercises (if home gym available)
      { name: "Dumbbell Bench Press", target: "CHEST", type: "strength", equipment: ["dumbbells"], muscles: { primary: ["chest"], secondary: ["triceps"] }, color: "#22c55e", suggestedWeight: "25lbs" },
      { name: "Dumbbell Rows", target: "BACK", type: "strength", equipment: ["dumbbells"], muscles: { primary: ["back"], secondary: ["biceps"] }, color: "#3b82f6", suggestedWeight: "20lbs" },
      { name: "Dumbbell Squats", target: "LEGS", type: "strength", equipment: ["dumbbells"], muscles: { primary: ["quadriceps"], secondary: ["glutes"] }, color: "#8b5cf6", suggestedWeight: "30lbs" },
      
      // Gym exercises (if commercial gym available)
      { name: "Barbell Squats", target: "LEGS", type: "strength", equipment: ["barbell"], muscles: { primary: ["quadriceps"], secondary: ["glutes"] }, color: "#8b5cf6", suggestedWeight: "135lbs" },
      { name: "Deadlifts", target: "BACK", type: "strength", equipment: ["barbell"], muscles: { primary: ["back", "hamstrings"], secondary: ["glutes"] }, color: "#ef4444", suggestedWeight: "155lbs" },
      { name: "Pull-ups", target: "BACK", type: "strength", equipment: ["pull_up_bar"], muscles: { primary: ["back"], secondary: ["biceps"] }, color: "#3b82f6" }
    ];
    
    // Filter exercises based on available equipment
    return exercises.filter(exercise => {
      if (equipmentAvailability.noEquipment && exercise.equipment.includes("bodyweight")) return true;
      if (equipmentAvailability.homeGym && (exercise.equipment.includes("dumbbells") || exercise.equipment.includes("bodyweight"))) return true;
      if (equipmentAvailability.commercialGym) return true;
      return false;
    });
  }

  selectStrengthExercises(pool, intensity) {
    return pool
      .filter(ex => ex.type === "strength")
      .sort((a, b) => b.muscles.primary.length - a.muscles.primary.length) // Prioritize compound movements
      .slice(0, intensity >= 7 ? 5 : 4)
      .map(ex => ({ ...ex, priority: intensity >= 8 ? "HIGH" : "NORMAL" }));
  }

  selectFatLossExercises(pool, intensity) {
    const cardioExercises = pool.filter(ex => ex.type === "cardio");
    const strengthExercises = pool.filter(ex => ex.type === "strength");
    
    return [
      ...cardioExercises.slice(0, 2),
      ...strengthExercises.slice(0, 3)
    ].map(ex => ({ ...ex, priority: "NORMAL" }));
  }

  selectBalancedExercises(pool, intensity) {
    const strengthExercises = pool.filter(ex => ex.type === "strength").slice(0, 3);
    const otherExercises = pool.filter(ex => ex.type !== "strength").slice(0, 2);
    
    return [...strengthExercises, ...otherExercises];
  }

  // Continue with other exercise selection methods...
  selectEnduranceExercises(pool, intensity) {
    return pool.filter(ex => ex.type === "cardio" || ex.name.includes("Squats")).slice(0, 4);
  }

  selectMobilityExercises(pool, intensity) {
    return pool.filter(ex => ex.type === "stability" || ex.target === "CORE").slice(0, 4);
  }

  getRepRanges() {
    const { fitnessGoals } = this.userProfile;
    
    const repRangeMap = {
      strength: { strength: "3-6", cardio: "30s", stability: "30-45s" },
      fat_loss: { strength: "8-15", cardio: "45s", stability: "30s" },
      endurance: { strength: "12-20", cardio: "60s", stability: "45s" },
      mobility: { strength: "8-12", cardio: "30s", stability: "60s" }
    };
    
    return repRangeMap[fitnessGoals.primary] || repRangeMap.strength;
  }

  getRestTimes() {
    const { fitnessGoals, personalProfile } = this.userProfile;
    
    let baseRest = {
      strength: "120s",
      cardio: "60s", 
      stability: "45s"
    };
    
    // Adjust for age (older people need more rest)
    if (personalProfile.age > 40) {
      baseRest = {
        strength: "150s",
        cardio: "90s",
        stability: "60s"
      };
    }
    
    // Adjust for goals
    if (fitnessGoals.primary === 'fat_loss') {
      baseRest = {
        strength: "60s",
        cardio: "30s",
        stability: "30s"
      };
    }
    
    return baseRest;
  }

  getSetsForExercise(exercise) {
    const { fitnessGoals } = this.userProfile;
    const intensity = this.calculateWorkoutIntensity();
    
    let baseSets = 3;
    
    if (fitnessGoals.primary === 'strength' && intensity >= 7) baseSets = 4;
    if (fitnessGoals.primary === 'endurance') baseSets = 2;
    if (exercise.priority === 'HIGH') baseSets += 1;
    
    return Math.max(2, Math.min(5, baseSets));
  }

  // Helper Methods - Nutrition Generation
  calculateTDEE() {
    const { personalProfile } = this.userProfile;
    const { age, sex, height, weight, activityLevel } = personalProfile;
    
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
  }

  adjustCaloriesForGoals(tdee) {
    const { fitnessGoals } = this.userProfile;
    
    switch (fitnessGoals.primary) {
      case 'fat_loss':
        return Math.round(tdee * 0.8); // 20% deficit
      case 'strength':
        return Math.round(tdee * 1.1); // 10% surplus
      case 'endurance':
        return Math.round(tdee * 1.05); // 5% surplus
      default:
        return tdee; // Maintenance
    }
  }

  calculateMacros(calories) {
    const { fitnessGoals, personalProfile } = this.userProfile;
    
    let proteinRatio, carbRatio, fatRatio;
    
    switch (fitnessGoals.primary) {
      case 'strength':
        proteinRatio = 0.30; carbRatio = 0.40; fatRatio = 0.30;
        break;
      case 'fat_loss':
        proteinRatio = 0.35; carbRatio = 0.35; fatRatio = 0.30;
        break;
      case 'endurance':
        proteinRatio = 0.20; carbRatio = 0.55; fatRatio = 0.25;
        break;
      default:
        proteinRatio = 0.25; carbRatio = 0.45; fatRatio = 0.30;
    }
    
    // Adjust protein for age and sex
    if (personalProfile.age > 40) proteinRatio += 0.05;
    if (personalProfile.sex === 'female') proteinRatio += 0.02;
    
    return {
      protein: Math.round((calories * proteinRatio) / 4),
      carbs: Math.round((calories * carbRatio) / 4),
      fats: Math.round((calories * fatRatio) / 9),
      calories: calories
    };
  }

  generateMeals(macros) {
    const { dietaryPreferences } = this.userProfile;
    
    const mealTemplates = this.getMealTemplates();
    const filteredMeals = mealTemplates.filter(meal => 
      this.matchesDietaryPreferences(meal, dietaryPreferences)
    );
    
    // Select 3 meals that roughly match macro targets
    const selectedMeals = this.optimizeMealSelection(filteredMeals, macros);
    
    return selectedMeals.map((meal, index) => ({
      ...meal,
      type: ['breakfast', 'lunch', 'dinner'][index],
      cost: this.calculateMealCost(meal),
      macros: this.calculateMealMacros(meal)
    }));
  }

  getMealTemplates() {
    return [
      {
        name: "Oatmeal with Berries",
        ingredients: ["oats", "blueberries", "almonds"],
        protein: 15, carbs: 45, fats: 8, baseCost: 3.50,
        dietTypes: ["omnivore", "vegetarian", "vegan"]
      },
      {
        name: "Chicken Salad",
        ingredients: ["chicken breast", "mixed greens", "olive oil"],
        protein: 35, carbs: 20, fats: 12, baseCost: 8.00,
        dietTypes: ["omnivore"]
      },
      {
        name: "Salmon & Vegetables",
        ingredients: ["salmon", "broccoli", "sweet potato"],
        protein: 40, carbs: 25, fats: 15, baseCost: 12.00,
        dietTypes: ["omnivore", "pescatarian"]
      },
      {
        name: "Tofu Stir Fry",
        ingredients: ["tofu", "vegetables", "brown rice"],
        protein: 20, carbs: 40, fats: 10, baseCost: 6.00,
        dietTypes: ["vegetarian", "vegan"]
      }
    ];
  }

  // Helper Methods - Recovery & Mindset
  calculateSleepTarget() {
    const { personalProfile } = this.userProfile;
    
    let baseHours = 8;
    if (personalProfile.age < 25) baseHours = 8.5;
    if (personalProfile.age > 50) baseHours = 7.5;
    
    return {
      hours: baseHours,
      bedtime: "22:30",
      wakeTime: "06:30",
      quality_tips: this.getSleepTips()
    };
  }

  generateCoachingNotes() {
    const { fitnessGoals, personalProfile } = this.userProfile;
    const intensity = this.calculateWorkoutIntensity();
    
    const notes = [];
    
    if (intensity <= 4) {
      notes.push("Take it easy today - focus on form over intensity");
    } else if (intensity >= 8) {
      notes.push("High energy day - push your limits safely!");
    }
    
    if (personalProfile.age > 40) {
      notes.push("Extra attention to warm-up and cool-down");
    }
    
    if (fitnessGoals.primary === 'strength') {
      notes.push("Focus on progressive overload - add weight when possible");
    }
    
    return notes;
  }

  generateWorkoutTitle() {
    const { fitnessGoals } = this.userProfile;
    const intensity = this.calculateWorkoutIntensity();
    
    const titles = {
      strength: intensity >= 7 ? "Power Builder" : "Strength Foundation",
      fat_loss: intensity >= 7 ? "Fat Burning Circuit" : "Metabolic Boost", 
      endurance: "Endurance Builder",
      mobility: "Mobility Flow"
    };
    
    return titles[fitnessGoals.primary] || "Balanced Training";
  }

  // Utility methods
  parseRestToSeconds(restString) {
    if (restString.includes('s')) {
      return parseInt(restString.replace('s', ''));
    }
    return 90; // default
  }

  calculateWorkoutTime(exerciseCount) {
    return exerciseCount * 7; // Rough estimate: 7 minutes per exercise
  }

  // Placeholder methods for additional features
  generateNutritionTip() { return "Stay hydrated throughout the day!"; }
  calculateBudget(meals) { return { used: 85, total: 150 }; }
  calculateHydrationTarget() { return "2.5L"; }
  generateMealTiming() { return "Every 3-4 hours"; }
  getStressManagementPlan() { return { techniques: ["deep breathing", "meditation"] }; }
  selectRecoveryActivities() { return ["light stretching", "walk"]; }
  shouldRecommendRestDay() { return false; }
  calculateRecoveryScoreTarget() { return 75; }
  generateDailyAffirmation() { return "I am capable of achieving my fitness goals"; }
  selectHabitFocus() { return "hydration"; }
  generateProgressCelebration() { return "You completed 3 workouts this week!"; }
  generateGoalReminder() { return `Stay focused on your ${this.userProfile.fitnessGoals.primary} goal`; }
  getSleepTips() { return ["Avoid screens 1hr before bed", "Keep room cool and dark"]; }
  matchesDietaryPreferences(meal, prefs) { return meal.dietTypes.includes(prefs.dietType); }
  optimizeMealSelection(meals, macros) { return meals.slice(0, 3); }
  calculateMealCost(meal) { return meal.baseCost; }
  calculateMealMacros(meal) { return { protein: meal.protein, carbs: meal.carbs, fats: meal.fats }; }
}