import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AICoachEngine } from '../engine/AICoachEngine';
import { useUserProfileStore } from './userProfileStore';
import { workoutPersistConfig } from '../utils/persistence';

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
      currentWorkout: {
        title: "Loading...",
        subtitle: "Generating your AI workout...",
        exercises: []
      },

      isWorkoutActive: false,
      currentExerciseIndex: 0,
      startTime: null,
      completedSets: {},
      workoutHistory: [],
      
      // Analysis data (NOT PERSISTED - temporary)
      lastAnalysis: null,

      
      // Generate workout using AI engine
      generateAIWorkout: () => {
        try {
          const profile = useUserProfileStore.getState().profile;
          const aiEngine = new AICoachEngine(profile);
          const aiWorkout = aiEngine.generateWorkoutPlan();
          
          // Format for display and store
          const formattedWorkout = get().formatWorkoutForDisplay(aiWorkout);
          set({ currentWorkout: formattedWorkout });
          
          return formattedWorkout;
        } catch (error) {
          console.error('AI workout generation failed:', error);
          // Fallback to ensure app doesn't crash
          const fallbackWorkout = {
            title: "Basic Workout",
            subtitle: "3 exercises • 30 minutes",
            exercises: [
              {
                id: 1,
                name: "Push-ups",
                target: "CHEST",
                sets: 3,
                reps: "8-12",
                rest: "60s",
                color: "#22c55e"
              }
            ]
          };
          set({ currentWorkout: fallbackWorkout });
          return fallbackWorkout;
        }
      },

      // Generate nutrition using AI engine
      generateAINutrition: () => {
        try {
          const profile = useUserProfileStore.getState().profile;
          const aiEngine = new AICoachEngine(profile);
          return aiEngine.generateNutritionPlan();
        } catch (error) {
          console.error('AI nutrition generation failed:', error);
          return null;
        }
      },

      // Replace current workout with new AI workout
      replaceCurrentWorkout: (newWorkout) => {
        const formattedWorkout = get().formatWorkoutForDisplay(newWorkout);
        set({ currentWorkout: formattedWorkout });
      },

      // Format AI workout for display in UI components
      formatWorkoutForDisplay: (aiWorkout) => {
        if (!aiWorkout || !aiWorkout.exercises) {
          return get().currentWorkout; // Return current if invalid
        }

        return {
          ...aiWorkout,
          exercises: aiWorkout.exercises.map((exercise, index) => ({
            id: exercise.id || `ai_ex_${index}`,
            name: exercise.name,
            target: exercise.target || exercise.muscles?.primary[0]?.toUpperCase() || 'GENERAL',
            sets: exercise.prescribed_sets || exercise.sets || 3,
            reps: exercise.prescribed_reps || exercise.reps || '8-12',
            weight: exercise.weight || exercise.suggestedWeight || null,
            rest: exercise.rest || `${Math.floor((exercise.prescribed_rest || 90) / 60)}:${String((exercise.prescribed_rest || 90) % 60).padStart(2, '0')}`,
            color: exercise.color || '#6366f1'
          }))
        };
      },

      startWorkout: () => {
        set({
          isWorkoutActive: true,
          startTime: Date.now(),
          currentExerciseIndex: 0,
          completedSets: {}
        });
      },

      completeSet: (exerciseId, setNumber, reps, weight) => {
        set((state) => ({
          completedSets: {
            ...state.completedSets,
            [exerciseId]: {
              ...state.completedSets[exerciseId],
              [setNumber]: { reps, weight, timestamp: Date.now() }
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

      skipExercise: () => {
        get().nextExercise();
      },

      completeWorkout: () => {
        const state = get();
        const endTime = Date.now();
        const duration = endTime - (state.startTime || endTime);

        const completedWorkout = {
          id: `workout_${endTime}`,
          date: new Date().toISOString(),
          startedAt: state.startTime,
          endedAt: endTime,
          duration: duration,
          title: state.currentWorkout.title,
          exercises: state.currentWorkout.exercises.map(ex => ({
            ...ex,
            completedSets: state.completedSets[ex.id] || {}
          })),
          totalSets: Object.values(state.completedSets).reduce(
            (total, sets) => total + Object.keys(sets).length, 0
          )
        };

        set((state) => ({
          isWorkoutActive: false,
          workoutHistory: [...state.workoutHistory, completedWorkout],
          completedSets: {},
          currentExerciseIndex: 0,
          startTime: null
        }));

        return completedWorkout;
      },

      // === PROGRESS TRACKING ===
      
      getProgressSummary: () => {
        const state = get();
        const history = state.workoutHistory;
        
        if (history.length === 0) {
          return {
            totalWorkouts: 0,
            totalTime: 0,
            averageWorkoutTime: 0,
            aiGeneratedWorkouts: 0,
            manualWorkouts: 0,
            thisWeekWorkouts: 0,
            recentWorkouts: []
          };
        }

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const thisWeekWorkouts = history.filter(w => new Date(w.date) > oneWeekAgo);
        
        return {
          totalWorkouts: history.length,
          totalTime: Math.round(history.reduce((sum, w) => sum + w.duration, 0) / (1000 * 60)),
          averageWorkoutTime: Math.round(history.reduce((sum, w) => sum + w.duration, 0) / history.length / (1000 * 60)),
          aiGeneratedWorkouts: history.length, // All workouts are now AI-generated
          manualWorkouts: 0, // No more manual workouts
          thisWeekWorkouts: thisWeekWorkouts.length,
          recentWorkouts: history.slice(-5).reverse()
        };
      },

      // === WORKOUT MODIFICATION ===
      
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

      // Swap exercise with AI-recommended alternative
      swapExercise: (exerciseId, newExercise) => {
        set((state) => ({
          currentWorkout: {
            ...state.currentWorkout,
            exercises: state.currentWorkout.exercises.map(ex =>
              ex.id === exerciseId ? {
                ...ex,
                name: newExercise.name,
                target: newExercise.target || ex.target,
                muscles: newExercise.muscles || ex.muscles,
                equipment: newExercise.equipment || ex.equipment,
                // Keep existing prescribed values unless new ones provided
                sets: newExercise.sets || ex.sets,
                reps: newExercise.reps || ex.reps,
                weight: newExercise.weight || ex.weight,
                rest: newExercise.rest || ex.rest,
                color: newExercise.color || ex.color
              } : ex
            )
          }
        }));
      },

      // Get AI-recommended alternative exercises
      getAlternativeExercises: (targetMuscle, currentExerciseName) => {
        try {
          const profile = useUserProfileStore.getState().profile;
          const aiEngine = new AICoachEngine(profile);
          
          // Get all exercises from AI engine's exercise pool
          const exercisePool = aiEngine.getExercisePool();
          
          // Filter for similar exercises targeting same muscle
          const alternatives = exercisePool.filter(exercise => {
            const targetsSameMuscle = exercise.target === targetMuscle ||
              exercise.muscles?.primary?.some(muscle => 
                muscle.toLowerCase().includes(targetMuscle.toLowerCase())
              );
            
            const isDifferentExercise = exercise.name !== currentExerciseName;
            
            return targetsSameMuscle && isDifferentExercise;
          });
          
          return alternatives.slice(0, 5); // Limit to 5 alternatives
        } catch (error) {
          console.error('Error getting alternatives:', error);
          return [];
        }
      },

      // === ANALYSIS INTEGRATION ===
      
      updateWorkoutFromAnalysis: (analysisData) => {
        // lastAnalysis is NOT persisted (temporary data)
        set({ lastAnalysis: analysisData });
        
        // Update user profile based on analysis if needed
        if (analysisData.recommendations) {
          // TODO: Could update user profile here based on analysis
          // For now, just regenerate workout
          get().generateAIWorkout();
        }
      },

      // === INITIALIZATION ===
      
      initializeWorkout: () => {
        // Generate initial AI workout when app starts
        get().generateAIWorkout();
      },

      // === DEPRECATED METHODS (for backward compatibility during transition) ===
      
      // Keep these temporarily while updating other components
      generateNewWorkout: () => {
        console.warn('generateNewWorkout is deprecated, use generateAIWorkout');
        return get().generateAIWorkout();
      },

      updateUserPreferences: (newPreferences) => {
        console.warn('updateUserPreferences should be done through userProfileStore');
        // Optionally update user profile store here for backward compatibility
      },

      generateMealPlan: () => {
        console.warn('generateMealPlan is deprecated, use generateAINutrition');
        return get().generateAINutrition();
      }
    }),
    workoutPersistConfig // Apply persistence configuration
  )
);