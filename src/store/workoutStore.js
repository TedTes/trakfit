import { create } from 'zustand';
import WorkoutGenerator from '../utils/WorkoutGenerator';
import { exerciseDatabase } from '../data/exerciseDatabase';
import { mealDatabase } from '../data/mealDatabase';
import { AICoachEngine } from '../engine/AICoachEngine';
import { useUserProfileStore } from './userProfileStore';

  const workoutTracking = {
    isWorkoutActive: false,
    currentExerciseIndex: 0,
    startTime: null,
    completedSets: {},
    workoutHistory: []
  };
const workoutGenerator = new WorkoutGenerator(exerciseDatabase);
// Workout generation logic based on analysis
const generateWorkoutFromAnalysis = (analysis) => {
  const { imbalances, weakAreas, strengths } = analysis;
  
  let exercises = [];
  let workoutFocus = "Balanced Training";
  
  // Generate exercises based on identified issues
  if (imbalances.includes("right stronger")) {
    exercises.push({
      id: Date.now() + 1,
      name: "Single-Arm Dumbbell Curls (Left Focus)",
      target: "BICEPS",
      sets: 4, // Extra set for weaker side
      reps: "10-12",
      weight: "20lbs",
      rest: "60s",
      color: "#ef4444",
      priority: "HIGH"
    });
    workoutFocus = "Left Arm Correction";
  }
  
  if (weakAreas.includes("chest")) {
    exercises.push({
      id: Date.now() + 2,
      name: "Incline Push-ups",
      target: "CHEST",
      sets: 3,
      reps: "8-10",
      weight: null,
      rest: "90s", 
      color: "#22c55e",
      priority: "HIGH"
    });
  }
  
  if (imbalances.includes("shoulders uneven")) {
    exercises.push({
      id: Date.now() + 3,
      name: "Single-Arm Shoulder Press",
      target: "SHOULDERS",
      sets: 3,
      reps: "8-10",
      weight: "15lbs",
      rest: "60s",
      color: "#8b5cf6",
      priority: "MEDIUM"
    });
  }
  
  // Add complementary exercises
  exercises.push({
    id: Date.now() + 4,
    name: "Plank Hold",
    target: "CORE",
    sets: 3,
    reps: "30-45s",
    weight: null,
    rest: "45s",
    color: "#06b6d4",
    priority: "NORMAL"
  });
  
  return {
    title: "AI-Generated Workout",
    subtitle: `${workoutFocus} • ${exercises.length * 12} minutes`,
    exercises: exercises,
    analysisBasedOn: analysis.timestamp
  };
};

export const useWorkoutStore = create((set, get) => ({
  // Current workout state
  currentWorkout: {
    title: "Today's Workout",
    subtitle: "Upper Body Focus • 45 minutes",
    exercises: [
      {
        id: 1,
        name: "Push-ups",
        target: "CHEST",
        sets: 3,
        reps: "8-12",
        weight: null,
        rest: "60s",
        color: "#22c55e"
      },
      {
        id: 2,
        name: "Dumbbell Rows",
        target: "BACK", 
        sets: 3,
        reps: "10-12",
        weight: "25lbs",
        rest: "90s",
        color: "#f59e0b"
      }
    ]
  },

  isWorkoutActive: false,
  currentExerciseIndex: 0,
  startTime: null,
  completedSets: {},
  workoutHistory: [],
  generator: workoutGenerator,
  userPreferences: {
    equipment: ['bodyweight'],
    goal: 'hypertrophy',
    experience: 'beginner',
    duration: 30,
    targetMuscles: ['full_body'],
      weeklyBudget: 150,
  preferredStore: 'walmart'
  },
  generateMealPlan: () => {
    const state = get();
    const { weeklyBudget, goal } = state.userPreferences;
    
    // ENHANCED protein needs based on fitness goal
    const nutritionProfile = {
      'strength': { proteinMultiplier: 1.4, proteinPriority: 0.9 },
      'hypertrophy': { proteinMultiplier: 1.3, proteinPriority: 0.8 },
      'endurance': { proteinMultiplier: 1.1, proteinPriority: 0.6 }
    }[goal] || { proteinMultiplier: 1.2, proteinPriority: 0.7 };
  
    const dailyBudget = weeklyBudget / 7;
    const mealsPerDay = 4;
    
    // PRIORITIZE high-protein meals for muscle building goals
    const sortedMeals = mealDatabase
      .filter(meal => meal.baseCost <= (dailyBudget / mealsPerDay) * 1.5)
      .sort((a, b) => {
        if (goal === 'hypertrophy' || goal === 'strength') {
          // Prioritize protein content for muscle building
          return (b.macros.protein * nutritionProfile.proteinMultiplier) - 
                 (a.macros.protein * nutritionProfile.proteinMultiplier);
        }
        // For endurance, balance protein and carbs
        return (b.macros.protein + b.macros.carbs) - (a.macros.protein + a.macros.carbs);
      });
  
    // Generate week with goal-specific meal selection
    const weeklyMeals = [];
    let totalCost = 0;
    let totalProtein = 0;
    
    for (let day = 0; day < 7; day++) {
      const dailyMeals = [];
      let dailyCost = 0;
      let dailyProtein = 0;
      
      for (let meal = 0; meal < mealsPerDay; meal++) {
        const availableMeals = sortedMeals.filter(m => 
          dailyCost + m.baseCost <= dailyBudget * 1.1
        );
        
        if (availableMeals.length > 0) {
          // For muscle building, prefer high-protein meals
          const selectedMeal = goal === 'hypertrophy' ? 
            availableMeals[Math.floor(meal / 2)] : // First half of sorted list
            availableMeals[meal % availableMeals.length];
            
          dailyMeals.push(selectedMeal);
          dailyCost += selectedMeal.baseCost;
          dailyProtein += selectedMeal.macros.protein;
        }
      }
      
      weeklyMeals.push({
        day: day + 1,
        meals: dailyMeals,
        cost: dailyCost,
        protein: dailyProtein
      });
      totalCost += dailyCost;
      totalProtein += dailyProtein;
    }
  
    return {
      weeklyMeals,
      totalCost: Math.round(totalCost * 100) / 100,
      budget: weeklyBudget,
      remaining: Math.round((weeklyBudget - totalCost) * 100) / 100,
      dailyAverage: Math.round((totalCost / 7) * 100) / 100,
      // ADD nutrition insights:
      totalProtein: Math.round(totalProtein),
      dailyProtein: Math.round(totalProtein / 7),
      goalOptimized: goal
    };
  },
  replaceCurrentWorkout: (newWorkout) => {
    const state = get();
    const formattedWorkout = state.formatWorkoutForDisplay(newWorkout);
    console.log('Formatted workout:', formattedWorkout);
    set({ currentWorkout: formattedWorkout });
  },
  generateAIWorkout: () => {
    const profile = useUserProfileStore.getState().profile;
    const aiEngine = new AICoachEngine(profile);
    return aiEngine.generateWorkoutPlan();
  },
  formatWorkoutForDisplay: (aiWorkout) => {
    return {
      ...aiWorkout,
      exercises: aiWorkout.exercises.map((exercise, index) => ({
        // Keep AI data but add display-friendly format
        id: exercise.id || `ai_ex_${index}`,
        name: exercise.name,
        target: exercise.muscles?.primary[0]?.toUpperCase() || 'GENERAL',
        sets: exercise.prescribed_sets || exercise.sets || 3,
        reps: exercise.prescribed_reps || exercise.reps || '8-12',
        weight: exercise.weight || null,
        rest: `${Math.floor((exercise.prescribed_rest || 90) / 60)}:${String((exercise.prescribed_rest || 90) % 60).padStart(2, '0')}`,
        color: exercise.color || '#6366f1', // Default color
        priority: exercise.priority || 'NORMAL'
      }))
    };
  },
  updateUserPreferences: (newPreferences) => {
    set((state) => ({
      userPreferences: { ...state.userPreferences, ...newPreferences }
    }));
  },
  // Analysis results storage
  lastAnalysis: null,
  getAlternativeExercises: (targetMuscle, currentExerciseName) => {
    const state = get();
    
    // Find exercises that target the same muscle group
    const alternatives = exerciseDatabase.filter(exercise => {
      // Check if exercise targets the same primary muscle
      const targetsSameMuscle = exercise.muscles.primary.some(muscle => 
        muscle.toLowerCase().includes(targetMuscle.toLowerCase()) ||
        targetMuscle.toLowerCase().includes(muscle.split('_')[0])
      );
      
      // Don't include the current exercise
      const isDifferentExercise = exercise.name !== currentExerciseName;
      
      // Check if user has required equipment
      const hasEquipment = exercise.equipment.some(eq => 
        state.userPreferences.equipment.includes(eq)
      );
      
      return targetsSameMuscle && isDifferentExercise && hasEquipment;
    });
    
    console.log(`Found ${alternatives.length} alternatives for ${targetMuscle}`);
    return alternatives.slice(0, 5); // Limit to 5 alternatives
  },
  // Update workout based on analysis
  updateWorkoutFromAnalysis: (analysisData) => {
    const generatedWorkout = generateWorkoutFromAnalysis(analysisData);
    set({ 
      currentWorkout: generatedWorkout,
      lastAnalysis: analysisData 
    });
  },
  swapExercise: (exerciseId, newExercise, targetMuscle) => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.map(ex =>
          ex.id === exerciseId
            ? {
                ...ex,
                name: newExercise.name,
                reps: newExercise.rep_ranges?.hypertrophy || ex.reps,
                weight: newExercise.weight || ex.weight,
                // Keep existing formatting for display
                target: ex.target,
                sets: ex.sets,
                rest: ex.rest,
                color: ex.color
              }
            : ex
        )
      }
    }));
  },
  startWorkout: () => {
    set({
      isWorkoutActive: true,
      startTime: new Date(),
      currentExerciseIndex: 0,
      completedSets: {}
    });
  },
  completeSet: (exerciseId, setNumber, reps, weight) => {
    set((state) => ({
      completedSets: {
        ...state.completedSets,
        [`${exerciseId}-${setNumber}`]: {
          reps: reps,
          weight: weight,
          timestamp: new Date()
        }
      }
    }));
  },
  nextExercise: () => {
    set((state) => ({
      currentExerciseIndex: Math.min(
        state.currentExerciseIndex + 1,
        state.currentWorkout.exercises.length - 1
      )
    }));
  },
  // Manual exercise updates
  updateExercise: (exerciseId, updates) => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.map(ex => 
          ex.id === exerciseId ? { ...ex, ...updates } : ex
        )
      }
    }));
  },
  completeWorkout: () => {
    const state = get();
    const workoutDuration = new Date() - state.startTime;
    
    const completedWorkout = {
      id: Date.now(),
      date: new Date(),
      duration: workoutDuration,
      exercises: state.currentWorkout.exercises,
      completedSets: state.completedSets,
      analysisId: state.lastAnalysis?.timestamp,
      // ADD these new tracking fields:
      workoutSource: state.currentWorkout.id?.includes('workout_') ? 'ai_generated' : 'static',
      workoutTitle: state.currentWorkout.title,
      exerciseCount: state.currentWorkout.exercises.length,
      totalSetsCompleted: Object.keys(state.completedSets).length,
      userPreferencesUsed: { ...state.userPreferences } // Snapshot of preferences
    };
  
    set((state) => ({
      isWorkoutActive: false,
      workoutHistory: [...state.workoutHistory, completedWorkout],
      completedSets: {},
      currentExerciseIndex: 0
    }));
  
    return completedWorkout;
  },
  getProgressSummary: () => {
    const state = get();
    const history = state.workoutHistory;
    
    if (history.length === 0) {
      return {
        totalWorkouts: 0,
        totalTime: 0,
        averageWorkoutTime: 0,
        aiWorkouts: 0,
        staticWorkouts: 0,
        thisWeekWorkouts: 0
      };
    }
  
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekWorkouts = history.filter(w => new Date(w.date) > oneWeekAgo);
    
    return {
      totalWorkouts: history.length,
      totalTime: Math.round(history.reduce((sum, w) => sum + w.duration, 0) / (1000 * 60)), // minutes
      averageWorkoutTime: Math.round(history.reduce((sum, w) => sum + w.duration, 0) / history.length / (1000 * 60)),
      aiWorkouts: history.filter(w => w.workoutSource === 'ai_generated').length,
      staticWorkouts: history.filter(w => w.workoutSource === 'static').length,
      thisWeekWorkouts: thisWeekWorkouts.length,
      recentWorkouts: history.slice(-5).reverse() // Last 5 workouts
    };
  }
}));

