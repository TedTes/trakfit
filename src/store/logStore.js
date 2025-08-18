import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logsPersistConfig } from '../utils/persistence';

// Helper function to get today's date key
const getTodayKey = () => {
  return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
};

// Helper function to get date key for any date
const getDateKey = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const useLogStore = create(
  persist(
    (set, get) => ({
      // Date-keyed logs structure
      workoutsByDate: {}, // { 'YYYY-MM-DD': WorkoutSession }
      mealsByDate: {},    // { 'YYYY-MM-DD': MealLog }
      recoveryByDate: {}, // { 'YYYY-MM-DD': RecoveryLog }
      habitsByDate: {},   // { 'YYYY-MM-DD': HabitLog }

      // === WORKOUT LOGGING ===
      
      logWorkoutSession: (workoutSession, date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        
        set((state) => ({
          workoutsByDate: {
            ...state.workoutsByDate,
            [dateKey]: {
              ...workoutSession,
              date: dateKey,
              loggedAt: new Date().toISOString()
            }
          }
        }));
      },

      getWorkoutForDate: (date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        return get().workoutsByDate[dateKey] || null;
      },

      getTodaysWorkout: () => {
        return get().getWorkoutForDate();
      },

      unmarkMealAsEaten: (mealIndex, date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        const currentMealLog = get().mealsByDate[dateKey] || {
          date: dateKey,
          meals: [],
          totalMacros: { protein: 0, carbs: 0, fats: 0, calories: 0 }
        };
      
        if (!currentMealLog.meals[mealIndex]) {
          console.error('Meal not found at index:', mealIndex);
          return;
        }
      
        const updatedMeals = currentMealLog.meals.map((meal, index) => {
          if (index === mealIndex) {
            return {
              ...meal,
              eaten: false,
              eatenAt: null,
              portionMultiplier: 1,
              actualMacros: null
            };
          }
          return meal;
        });
      
        // Recalculate total macros based on eaten meals only
        const totalMacros = updatedMeals
          .filter(meal => meal.eaten)
          .reduce((total, meal) => {
            const macros = meal.actualMacros || meal;
            return {
              protein: total.protein + (macros.protein || 0),
              carbs: total.carbs + (macros.carbs || 0),
              fats: total.fats + (macros.fats || 0),
              calories: total.calories + (macros.calories || 0)
            };
          }, { protein: 0, carbs: 0, fats: 0, calories: 0 });
      
        set((state) => ({
          mealsByDate: {
            ...state.mealsByDate,
            [dateKey]: {
              ...currentMealLog,
              meals: updatedMeals,
              totalMacros,
              lastUpdated: new Date().toISOString()
            }
          }
        }));
      },
      
      clearTodaysMeals: (date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        
        set((state) => ({
          mealsByDate: {
            ...state.mealsByDate,
            [dateKey]: {
              date: dateKey,
              meals: [],
              totalMacros: { protein: 0, carbs: 0, fats: 0, calories: 0 },
              lastUpdated: new Date().toISOString()
            }
          }
        }));
      },

      // === MEAL LOGGING ===
      
      logMeal: (mealData, date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        const currentMealLog = get().mealsByDate[dateKey] || {
          date: dateKey,
          meals: [],
          totalMacros: { protein: 0, carbs: 0, fats: 0, calories: 0 }
        };
      
        const updatedMeals = [...currentMealLog.meals, {
          ...mealData,
          loggedAt: new Date().toISOString()
        }];
      
        // Only count eaten meals for totalMacros (consumed progress)
        const totalMacros = updatedMeals
          .filter(meal => meal.eaten) 
          .reduce((total, meal) => {
            const macros = meal.actualMacros || meal;
            return {
              protein: total.protein + (macros.protein || 0),
              carbs: total.carbs + (macros.carbs || 0),
              fats: total.fats + (macros.fats || 0),
              calories: total.calories + (macros.calories || 0)
            };
          }, { protein: 0, carbs: 0, fats: 0, calories: 0 });
      
        set((state) => ({
          mealsByDate: {
            ...state.mealsByDate,
            [dateKey]: {
              date: dateKey,
              meals: updatedMeals,
              totalMacros, 
              lastUpdated: new Date().toISOString()
            }
          }
        }));
      },
      markMealAsEaten: (mealIndex, portionMultiplier = 1, date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        const currentMealLog = get().mealsByDate[dateKey] || {
          date: dateKey,
          meals: [],
          totalMacros: { protein: 0, carbs: 0, fats: 0, calories: 0 }
        };

        // Mark meal as eaten with portion adjustment
        const updatedMeals = currentMealLog.meals.map((meal, index) => {
          if (index === mealIndex) {
            return {
              ...meal,
              eaten: true,
              eatenAt: new Date().toISOString(),
              portionMultiplier,
              actualMacros: {
                protein: (meal.protein || 0) * portionMultiplier,
                carbs: (meal.carbs || 0) * portionMultiplier,
                fats: (meal.fats || 0) * portionMultiplier,
                calories: (meal.calories || 0) * portionMultiplier
              }
            };
          }
          return meal;
        });

        // Recalculate total macros based on eaten meals
        const totalMacros = updatedMeals
          .filter(meal => meal.eaten)
          .reduce((total, meal) => {
            const macros = meal.actualMacros || meal;
            return {
              protein: total.protein + (macros.protein || 0),
              carbs: total.carbs + (macros.carbs || 0),
              fats: total.fats + (macros.fats || 0),
              calories: total.calories + (macros.calories || 0)
            };
          }, { protein: 0, carbs: 0, fats: 0, calories: 0 });

        set((state) => ({
          mealsByDate: {
            ...state.mealsByDate,
            [dateKey]: {
              ...currentMealLog,
              meals: updatedMeals,
              totalMacros,
              lastUpdated: new Date().toISOString()
            }
          }
        }));
      },

      getMealsForDate: (date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        return get().mealsByDate[dateKey] || null;
      },

      getTodaysMeals: () => {
        return get().getMealsForDate();
      },

      // === RECOVERY LOGGING ===
      
      logRecovery: (recoveryData, date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        
        // Calculate simple recovery score
        const calculateRecoveryScore = (data) => {
          let score = 50; // Base score
          
          // Sleep hours impact (7-9 hours is optimal)
          if (data.sleepHours >= 7 && data.sleepHours <= 9) score += 20;
          else if (data.sleepHours >= 6) score += 10;
          else score -= 10;
          
          // Sleep quality impact
          if (data.sleepQuality === 'excellent') score += 15;
          else if (data.sleepQuality === 'good') score += 10;
          else if (data.sleepQuality === 'fair') score += 5;
          else score -= 5;
          
          // Stress level impact
          if (data.stressLevel === 'low') score += 15;
          else if (data.stressLevel === 'moderate') score += 5;
          else score -= 10;
          
          return Math.max(0, Math.min(100, score));
        };

        const recoveryScore = calculateRecoveryScore(recoveryData);

        set((state) => ({
          recoveryByDate: {
            ...state.recoveryByDate,
            [dateKey]: {
              ...recoveryData,
              date: dateKey,
              recoveryScore,
              loggedAt: new Date().toISOString()
            }
          }
        }));
      },

      getRecoveryForDate: (date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        return get().recoveryByDate[dateKey] || null;
      },

      getTodaysRecovery: () => {
        return get().getRecoveryForDate();
      },

      // === HABIT LOGGING ===
      
      logHabit: (habitKey, completed, date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        const currentHabitLog = get().habitsByDate[dateKey] || {
          date: dateKey,
          habits: {}
        };

        set((state) => ({
          habitsByDate: {
            ...state.habitsByDate,
            [dateKey]: {
              ...currentHabitLog,
              habits: {
                ...currentHabitLog.habits,
                [habitKey]: {
                  completed,
                  completedAt: completed ? new Date().toISOString() : null
                }
              },
              lastUpdated: new Date().toISOString()
            }
          }
        }));
      },

      getHabitsForDate: (date = null) => {
        const dateKey = date ? getDateKey(date) : getTodayKey();
        return get().habitsByDate[dateKey] || null;
      },

      getTodaysHabits: () => {
        return get().getHabitsForDate();
      },

      // Calculate habit streaks
      getHabitStreak: (habitKey) => {
        const habitsByDate = get().habitsByDate;
        const dates = Object.keys(habitsByDate).sort().reverse(); // Most recent first
        
        let streak = 0;
        for (const date of dates) {
          const habitLog = habitsByDate[date];
          if (habitLog.habits[habitKey]?.completed) {
            streak++;
          } else {
            break; // Streak broken
          }
        }
        
        return streak;
      },

      // === DAILY PROGRESS HELPERS ===
      
      getTodaysProgress: () => {
        const today = getTodayKey();
        
        return {
          workout: get().getWorkoutForDate(today),
          meals: get().getMealsForDate(today),
          recovery: get().getRecoveryForDate(today),
          habits: get().getHabitsForDate(today)
        };
      },

      // Calculate completion percentage for today
      getTodaysCompletionPercentage: () => {
        const progress = get().getTodaysProgress();
        let completed = 0;
        let total = 4; // 4 pillars

        // Workout completion
        if (progress.workout && progress.workout.endedAt) completed++;

        // Meal completion (if any meals are eaten)
        if (progress.meals && progress.meals.meals.some(meal => meal.eaten)) completed++;

        // Recovery completion (if sleep is logged)
        if (progress.recovery && progress.recovery.sleepHours) completed++;

        // Habits completion (if any habits are completed)
        if (progress.habits && Object.values(progress.habits.habits || {}).some(habit => habit.completed)) completed++;

        return Math.round((completed / total) * 100);
      },

      // === WEEKLY PROGRESS ===
      
      getWeeklyProgress: () => {
        const today = new Date();
        const weekDates = [];
        
        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          weekDates.push(getDateKey(date));
        }

        return weekDates.map(date => ({
          date,
          workout: get().getWorkoutForDate(date),
          meals: get().getMealsForDate(date),
          recovery: get().getRecoveryForDate(date),
          habits: get().getHabitsForDate(date)
        }));
      },

      // === UTILITY FUNCTIONS ===
      
      clearAllLogs: () => {
        set({
          workoutsByDate: {},
          mealsByDate: {},
          recoveryByDate: {},
          habitsByDate: {}
        });
      },

      clearLogsBeforeDate: (cutoffDate) => {
        const cutoffKey = getDateKey(cutoffDate);
        
        set((state) => ({
          workoutsByDate: Object.fromEntries(
            Object.entries(state.workoutsByDate).filter(([date]) => date >= cutoffKey)
          ),
          mealsByDate: Object.fromEntries(
            Object.entries(state.mealsByDate).filter(([date]) => date >= cutoffKey)
          ),
          recoveryByDate: Object.fromEntries(
            Object.entries(state.recoveryByDate).filter(([date]) => date >= cutoffKey)
          ),
          habitsByDate: Object.fromEntries(
            Object.entries(state.habitsByDate).filter(([date]) => date >= cutoffKey)
          )
        }));
      }
    }),
    logsPersistConfig // Apply persistence configuration
  )
);
