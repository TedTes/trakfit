import { create } from 'zustand';

const exerciseDatabase = {
    CHEST: [
      { name: "Push-ups", reps: "8-12", weight: null, difficulty: "beginner" },
      { name: "Incline Push-ups", reps: "10-15", weight: null, difficulty: "beginner" },
      { name: "Bench Press", reps: "6-8", weight: "135lbs", difficulty: "intermediate" },
      { name: "Dumbbell Press", reps: "8-10", weight: "30lbs", difficulty: "intermediate" },
      { name: "Chest Flyes", reps: "10-12", weight: "20lbs", difficulty: "intermediate" }
    ],
    BACK: [
      { name: "Dumbbell Rows", reps: "10-12", weight: "25lbs", difficulty: "beginner" },
      { name: "Bent-Over Rows", reps: "8-10", weight: "95lbs", difficulty: "intermediate" },
      { name: "Pull-ups", reps: "5-8", weight: null, difficulty: "advanced" },
      { name: "Lat Pulldowns", reps: "10-12", weight: "80lbs", difficulty: "intermediate" },
      { name: "Cable Rows", reps: "12-15", weight: "60lbs", difficulty: "beginner" }
    ],
    SHOULDERS: [
      { name: "Shoulder Press", reps: "8-10", weight: "20lbs", difficulty: "beginner" },
      { name: "Lateral Raises", reps: "12-15", weight: "15lbs", difficulty: "beginner" },
      { name: "Overhead Press", reps: "6-8", weight: "85lbs", difficulty: "intermediate" },
      { name: "Arnold Press", reps: "8-10", weight: "25lbs", difficulty: "intermediate" }
    ],
    BICEPS: [
      { name: "Dumbbell Curls", reps: "10-12", weight: "20lbs", difficulty: "beginner" },
      { name: "Hammer Curls", reps: "10-12", weight: "20lbs", difficulty: "beginner" },
      { name: "Barbell Curls", reps: "8-10", weight: "65lbs", difficulty: "intermediate" },
      { name: "Single-Arm Dumbbell Curls (Left Focus)", reps: "10-12", weight: "20lbs", difficulty: "beginner" }
    ],
    CORE: [
      { name: "Plank Hold", reps: "30-45s", weight: null, difficulty: "beginner" },
      { name: "Russian Twists", reps: "20-30", weight: "10lbs", difficulty: "beginner" },
      { name: "Dead Bug", reps: "10 each", weight: null, difficulty: "beginner" },
      { name: "Mountain Climbers", reps: "30s", weight: null, difficulty: "intermediate" }
    ]
  };


  const workoutTracking = {
    isWorkoutActive: false,
    currentExerciseIndex: 0,
    startTime: null,
    completedSets: {},
    workoutHistory: []
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
  // Analysis results storage
  lastAnalysis: null,
  getAlternativeExercises: (targetMuscle, currentExerciseName) => {
    const alternatives = exerciseDatabase[targetMuscle] || [];
    return alternatives.filter(ex => ex.name !== currentExerciseName);
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
                reps: newExercise.reps,
                weight: newExercise.weight
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
      analysisId: state.lastAnalysis?.timestamp
    };

    set((state) => ({
      isWorkoutActive: false,
      workoutHistory: [...state.workoutHistory, completedWorkout],
      completedSets: {},
      currentExerciseIndex: 0
    }));

    return completedWorkout;
  }
}));

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