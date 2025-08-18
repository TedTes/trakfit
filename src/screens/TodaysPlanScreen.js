import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AICoachEngine } from '../engine/AICoachEngine';
import { useUserProfileStore } from '../store/userProfileStore';
import { useLogStore } from '../store/logStore'; // NEW: Import logStore
import DailyHeader from '../components/DailyHeader';

export default function TodaysPlanScreen() {
  const navigation = useNavigation();
  const [expandedPillars, setExpandedPillars] = useState({});
  
  // Get user profile from store
  const userProfile = useUserProfileStore(state => state.profile);
  
  const {
    getTodaysProgress,
    getTodaysCompletionPercentage,
    getTodaysWorkout,
    getTodaysMeals,
    getTodaysRecovery,
    getTodaysHabits
  } = useLogStore();

  // Generate today's plan using AI engine
  let todaysPlan = null;
  try {
    if (userProfile) {
      const aiEngine = new AICoachEngine(userProfile);
      todaysPlan = aiEngine.generateTodaysPlan();
    }
  } catch (error) {
    console.log('AI Engine generating plan...');
    // Fallback data structure
    todaysPlan = {
      workout: {
        title: "Upper Body Strength",
        exercises: [
          { id: 1, name: "Push-ups", sets: 3, reps: "8-12", target: "CHEST", color: "#22c55e" },
          { id: 2, name: "Pull-ups", sets: 3, reps: "5-8", target: "BACK", color: "#3b82f6" }
        ],
        estimated_total_time: 30,
        goal: "Strength",
        coaching_notes: ["Focus on proper form", "Rest adequately between sets"],
        completed: false
      },
      nutrition: {
        title: "Balanced Nutrition Plan",
        macros: { protein: 120, carbs: 200, fats: 65, calories: 1800 },
        meals: [
          { type: "breakfast", name: "Oatmeal with Berries", cost: 3.50, protein: 15, carbs: 45, completed: false },
          { type: "lunch", name: "Chicken Salad", cost: 8.00, protein: 35, carbs: 20, completed: false },
          { type: "dinner", name: "Salmon & Vegetables", cost: 12.00, protein: 40, carbs: 25, completed: false }
        ],
        tip: "Stay hydrated throughout the day!"
      },
      recovery: {
        title: "Recovery Goals",
        sleep_target: { hours: 8, bedtime: "22:30", wakeTime: "06:30" },
        stress_level: "moderate",
        recovery_score: 75
      },
      mindset: {
        title: "Mindset Boost",
        daily_affirmation: "I am getting stronger with every workout!",
        habits: [
          { name: "Morning meditation", completed: false },
          { name: "Gratitude practice", completed: false }
        ]
      }
    };
  }

  const togglePillar = (pillarKey) => {
    setExpandedPillars(prev => ({
      ...prev,
      [pillarKey]: !prev[pillarKey]
    }));
  };

  const getCompletionStatus = () => {
    // Get actual logged data
    const loggedWorkout = getTodaysWorkout();
    const loggedMeals = getTodaysMeals();
    const loggedRecovery = getTodaysRecovery();
    const loggedHabits = getTodaysHabits();

    let completed = 0;
    let total = 4;

    // Workout completion - check if workout session is logged and completed
    if (loggedWorkout && loggedWorkout.endedAt) {
      completed++;
    }

    // Nutrition completion - check if any meals are marked as eaten
    if (loggedMeals && loggedMeals.meals && loggedMeals.meals.some(meal => meal.eaten)) {
      completed++;
    }

    // Recovery completion - check if sleep is logged
    if (loggedRecovery && loggedRecovery.sleepHours) {
      completed++;
    }

    // Mindset completion - check if any habits are completed
    if (loggedHabits && loggedHabits.habits && 
        Object.values(loggedHabits.habits).some(habit => habit.completed)) {
      completed++;
    }

    return { 
      completed, 
      total, 
      percentage: Math.round((completed / total) * 100) 
    };
  };

  const getPillarProgress = () => {
    const loggedWorkout = getTodaysWorkout();
    const loggedMeals = getTodaysMeals();
    const loggedRecovery = getTodaysRecovery();
    const loggedHabits = getTodaysHabits();

    return {
      workout: {
        completed: !!(loggedWorkout && loggedWorkout.endedAt),
        progress: loggedWorkout ? 
          `${loggedWorkout.totalSets || 0} sets completed` : 
          `${todaysPlan?.workout?.exercises?.length || 0} exercises planned`,
        status: loggedWorkout?.endedAt ? 'complete' : 'pending'
      },
      nutrition: {
        completed: !!(loggedMeals && loggedMeals.meals.some(meal => meal.eaten)),
        progress: loggedMeals ? 
          `${loggedMeals.meals.filter(meal => meal.eaten).length}/${loggedMeals.meals.length} meals eaten` :
          `${todaysPlan?.nutrition?.meals?.length || 0} meals planned`,
        macros: loggedMeals?.totalMacros || { protein: 0, carbs: 0, fats: 0, calories: 0 },
        target: todaysPlan?.nutrition?.macros || { protein: 120, carbs: 200, fats: 65, calories: 1800 },
        status: loggedMeals?.meals.some(meal => meal.eaten) ? 
          (loggedMeals.meals.every(meal => meal.eaten) ? 'complete' : 'partial') : 'pending'
      },
      recovery: {
        completed: !!(loggedRecovery && loggedRecovery.sleepHours),
        progress: loggedRecovery ? 
          `${loggedRecovery.sleepHours}h sleep, ${loggedRecovery.recoveryScore}/100 score` :
          `${todaysPlan?.recovery?.sleep_target?.hours || 8}h sleep target`,
        score: loggedRecovery?.recoveryScore || 0,
        status: loggedRecovery?.sleepHours ? 'complete' : 'pending'
      },
      mindset: {
        completed: !!(loggedHabits && Object.values(loggedHabits.habits || {}).some(habit => habit.completed)),
        progress: loggedHabits ? 
          `${Object.values(loggedHabits.habits || {}).filter(habit => habit.completed).length}/${Object.keys(loggedHabits.habits || {}).length} habits done` :
          `${todaysPlan?.mindset?.habits?.length || 2} habits planned`,
        habits: loggedHabits?.habits || {},
        status: loggedHabits && Object.values(loggedHabits.habits || {}).some(habit => habit.completed) ? 'partial' : 'pending'
      }
    };
  };

  // Use real data instead of mock calculation
  const status = getCompletionStatus();
  const pillarProgress = getPillarProgress();

  // Calculate profile completion for AI power indicator
  const getProfileCompletionPercentage = () => {
    const weights = {
      personal: { weight: 20, completed: !!(userProfile.personalProfile?.age && userProfile.personalProfile?.sex && userProfile.personalProfile?.height && userProfile.personalProfile?.weight) },
      goals: { weight: 25, completed: !!(userProfile.fitnessGoals?.primary && userProfile.fitnessGoals?.timeline) },
      equipment: { weight: 20, completed: !!(userProfile.equipmentAvailability?.homeGym || userProfile.equipmentAvailability?.commercialGym || userProfile.equipmentAvailability?.noEquipment) },
      diet: { weight: 20, completed: !!(userProfile.dietaryPreferences?.dietType) },
      lifestyle: { weight: 15, completed: !!(userProfile.lifestyleAssessment?.sleepQuality && userProfile.lifestyleAssessment?.stressLevel) }
    };

    let totalWeight = 0;
    let completedWeight = 0;

    Object.values(weights).forEach(section => {
      totalWeight += section.weight;
      if (section.completed) {
        completedWeight += section.weight;
      }
    });

    return Math.round((completedWeight / totalWeight) * 100);
  };

  const profileCompletion = getProfileCompletionPercentage();

  const getAIPowerLevel = () => {
    if (profileCompletion >= 90) return { level: "Maximum", color: "#22c55e", description: "🚀 Full AI coaching power!" };
    if (profileCompletion >= 70) return { level: "Advanced", color: "#6366f1", description: "🎯 Advanced personalization" };
    if (profileCompletion >= 50) return { level: "Intermediate", color: "#f59e0b", description: "⚡ Good personalization" };
    if (profileCompletion >= 25) return { level: "Basic", color: "#ef4444", description: "🔄 Basic recommendations" };
    return { level: "Minimal", color: "#94a3b8", description: "📍 Complete profile for better AI" };
  };

  const aiPower = getAIPowerLevel();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Daily Header */}
        <DailyHeader />
        
        {/* Daily Progress Overview - NOW SHOWS REAL DATA */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <Text style={styles.progressSubtitle}>
                {status.completed} of {status.total} goals completed
              </Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{status.percentage}%</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${status.percentage}%` }]} />
          </View>
        </View>

        {/* Pillars Overview - NOW SHOWS REAL PROGRESS */}
        <View style={styles.pillarsSection}>
          <Text style={styles.pillarsTitle}>Today's Plan</Text>
          
          {/* Workout Pillar */}
          <TouchableOpacity
            style={styles.pillarCard}
            onPress={() => togglePillar('workout')}
          >
            <View style={styles.pillarHeader}>
              <View style={styles.pillarTitleRow}>
                <Text style={styles.pillarIcon}>💪</Text>
                <View style={styles.pillarTitleContainer}>
                  <Text style={styles.pillarTitle}>Workout</Text>
                  <Text style={styles.pillarSubtitle}>
                    {pillarProgress.workout.progress}
                  </Text>
                </View>
                <View style={styles.pillarStatus}>
                  {pillarProgress.workout.completed ? (
                    <Text style={styles.statusCompleted}>✓</Text>
                  ) : (
                    <Text style={styles.statusPending}>○</Text>
                  )}
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {expandedPillars.workout ? '↑' : '↓'}
              </Text>
            </View>

            {expandedPillars.workout && (
              <View style={styles.pillarContent}>
                <View style={styles.workoutPreview}>
                  {todaysPlan?.workout?.exercises?.slice(0, 3).map((exercise, index) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                      <View style={[styles.exerciseColorBar, { backgroundColor: exercise.color }]} />
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDetails}>{exercise.sets} × {exercise.reps}</Text>
                    </View>
                  ))}
                  {todaysPlan?.workout?.exercises?.length > 3 && (
                    <Text style={styles.moreExercises}>
                      +{todaysPlan.workout.exercises.length - 3} more exercises
                    </Text>
                  )}
                </View>
                
                <TouchableOpacity
                  style={styles.pillarAction}
                  onPress={() => navigation.navigate('Execute')}
                >
                  <Text style={styles.pillarActionText}>
                    {pillarProgress.workout.completed ? 'View Workout' : 'Start Workout'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* Nutrition Pillar */}
          <TouchableOpacity
            style={styles.pillarCard}
            onPress={() => togglePillar('nutrition')}
          >
            <View style={styles.pillarHeader}>
              <View style={styles.pillarTitleRow}>
                <Text style={styles.pillarIcon}>🍽️</Text>
                <View style={styles.pillarTitleContainer}>
                  <Text style={styles.pillarTitle}>Nutrition</Text>
                  <Text style={styles.pillarSubtitle}>
                    {pillarProgress.nutrition.progress}
                  </Text>
                </View>
                <View style={styles.pillarStatus}>
                  {pillarProgress.nutrition.completed ? (
                    <Text style={styles.statusCompleted}>✓</Text>
                  ) : (
                    <Text style={styles.statusPending}>○</Text>
                  )}
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {expandedPillars.nutrition ? '↑' : '↓'}
              </Text>
            </View>

            {expandedPillars.nutrition && (
              <View style={styles.pillarContent}>
                <View style={styles.nutritionPreview}>
                  {/* Show real macro progress */}
                  <View style={styles.macroProgress}>
                    <Text style={styles.macroTitle}>Macro Progress</Text>
                    <View style={styles.macroRow}>
                      <Text style={styles.macroLabel}>Protein:</Text>
                      <Text style={styles.macroValues}>
                        {Math.round(pillarProgress.nutrition.macros.protein)}g / {pillarProgress.nutrition.target.protein}g
                      </Text>
                    </View>
                    <View style={styles.macroRow}>
                      <Text style={styles.macroLabel}>Calories:</Text>
                      <Text style={styles.macroValues}>
                        {Math.round(pillarProgress.nutrition.macros.calories)} / {pillarProgress.nutrition.target.calories}
                      </Text>
                    </View>
                  </View>
                  
                  {todaysPlan?.nutrition?.meals?.slice(0, 2).map((meal, index) => (
                    <View key={index} style={styles.mealItem}>
                      <Text style={styles.mealType}>{meal.type}</Text>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealMacros}>{meal.protein}g protein • {meal.carbs}g carbs</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity
                  style={styles.pillarAction}
                  onPress={() => navigation.navigate('Nutrition')}
                >
                  <Text style={styles.pillarActionText}>
                    {pillarProgress.nutrition.status === 'complete' ? 'View Meals' : 'Log Meals'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* Recovery Pillar */}
          <TouchableOpacity
            style={styles.pillarCard}
            onPress={() => togglePillar('recovery')}
          >
            <View style={styles.pillarHeader}>
              <View style={styles.pillarTitleRow}>
                <Text style={styles.pillarIcon}>😴</Text>
                <View style={styles.pillarTitleContainer}>
                  <Text style={styles.pillarTitle}>Recovery</Text>
                  <Text style={styles.pillarSubtitle}>
                    {pillarProgress.recovery.progress}
                  </Text>
                </View>
                <View style={styles.pillarStatus}>
                  {pillarProgress.recovery.completed ? (
                    <Text style={styles.statusCompleted}>✓</Text>
                  ) : (
                    <Text style={styles.statusPending}>○</Text>
                  )}
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {expandedPillars.recovery ? '↑' : '↓'}
              </Text>
            </View>

            {expandedPillars.recovery && (
              <View style={styles.pillarContent}>
                <View style={styles.recoveryPreview}>
                  <View style={styles.recoveryItem}>
                    <Text style={styles.recoveryLabel}>Recovery Score</Text>
                    <View style={styles.scoreContainer}>
                      <View style={styles.scoreBar}>
                        <View style={[
                          styles.scoreProgress, 
                          { width: `${pillarProgress.recovery.score}%` }
                        ]} />
                      </View>
                      <Text style={styles.scoreText}>{pillarProgress.recovery.score}/100</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Mindset Pillar */}
          <TouchableOpacity
            style={styles.pillarCard}
            onPress={() => togglePillar('mindset')}
          >
            <View style={styles.pillarHeader}>
              <View style={styles.pillarTitleRow}>
                <Text style={styles.pillarIcon}>🧠</Text>
                <View style={styles.pillarTitleContainer}>
                  <Text style={styles.pillarTitle}>Mindset</Text>
                  <Text style={styles.pillarSubtitle}>
                    {pillarProgress.mindset.progress}
                  </Text>
                </View>
                <View style={styles.pillarStatus}>
                  {pillarProgress.mindset.completed ? (
                    <Text style={styles.statusCompleted}>✓</Text>
                  ) : (
                    <Text style={styles.statusPending}>○</Text>
                  )}
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {expandedPillars.mindset ? '↑' : '↓'}
              </Text>
            </View>

            {expandedPillars.mindset && (
              <View style={styles.pillarContent}>
                <View style={styles.mindsetPreview}>
                  <View style={styles.affirmationContainer}>
                    <Text style={styles.affirmationLabel}>Today's Affirmation</Text>
                    <Text style={styles.affirmationText}>
                      "{todaysPlan?.mindset?.daily_affirmation}"
                    </Text>
                  </View>
                  
                  <View style={styles.habitsContainer}>
                    <Text style={styles.habitsLabel}>Daily Habits</Text>
                    {todaysPlan?.mindset?.habits?.map((habit, index) => (
                      <View key={index} style={styles.habitItem}>
                        <Text style={styles.habitCheckbox}>
                          {pillarProgress.mindset.habits[habit.name]?.completed ? '✓' : '○'}
                        </Text>
                        <Text style={styles.habitName}>{habit.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  macroProgress: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  macroValues: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6366f1',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  nextActionCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  nextActionGradient: {
    borderRadius: 16,
    padding: 20,
  },
  nextActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextActionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  nextActionText: {
    flex: 1,
  },
  nextActionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  nextActionSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  nextActionArrow: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  pillarsSection: {
    padding: 20,
    paddingTop: 0,
  },
  pillarsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  pillarCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pillarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pillarIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  pillarTitleContainer: {
    flex: 1,
  },
  pillarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  pillarSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  pillarStatus: {
    marginRight: 12,
  },
  statusCompleted: {
    fontSize: 20,
    color: '#22c55e',
  },
  statusPending: {
    fontSize: 20,
    color: '#e2e8f0',
  },
  expandIcon: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 'bold',
  },
  pillarContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  workoutPreview: {
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exerciseColorBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  moreExercises: {
    fontSize: 14,
    color: '#6366f1',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  nutritionPreview: {
    marginBottom: 16,
  },
  mealItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  mealType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  mealMacros: {
    fontSize: 14,
    color: '#64748b',
  },
  recoveryPreview: {
    marginBottom: 16,
  },
  recoveryItem: {
    paddingVertical: 8,
  },
  recoveryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  recoveryValue: {
    fontSize: 14,
    color: '#64748b',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  mindsetPreview: {
    marginBottom: 16,
  },
  affirmationContainer: {
    marginBottom: 16,
  },
  affirmationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  affirmationText: {
    fontSize: 16,
    color: '#1e293b',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  habitsContainer: {
    marginTop: 16,
  },
  habitsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  habitCheckbox: {
    fontSize: 16,
    marginRight: 12,
    color: '#6366f1',
  },
  habitName: {
    fontSize: 14,
    color: '#64748b',
  },
  pillarAction: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  pillarActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});