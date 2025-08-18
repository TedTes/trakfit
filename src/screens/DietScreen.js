import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProfileStore } from '../store/userProfileStore';
import { AICoachEngine } from '../engine/AICoachEngine';
import { useLogStore } from '../store/logStore';

export default function DietScreen() {
  const { profile } = useUserProfileStore();
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Single source of truth - only use store state
  const { 
    logMeal, 
    markMealAsEaten, 
    unmarkMealAsEaten,
    getTodaysMeals,
    clearTodaysMeals
  } = useLogStore();

  useEffect(() => {
    generateAINutritionPlan();
  }, []);

  // Initialize meals properly - single source of truth
  useEffect(() => {
    if (nutritionPlan?.meals) {
      initializeTodaysMeals();
    }
  }, [nutritionPlan]);

  //  Get reactive state - single source of truth
  const todaysMeals = getTodaysMeals();
  const consumedMacros = todaysMeals?.totalMacros || { protein: 0, carbs: 0, fats: 0, calories: 0 };
  
  // Calculate planned macros for progress comparison
  const plannedMacros = nutritionPlan?.macros || { protein: 120, carbs: 200, fats: 65, calories: 1800 };

  const initializeTodaysMeals = () => {
    // Clear existing meals first to prevent duplicates
    const existingMeals = getTodaysMeals();
    if (!existingMeals || existingMeals.meals.length === 0) {
      // Initialize with planned meals
      nutritionPlan.meals.forEach((meal) => {
        logMeal({
          name: meal.name,
          type: meal.type,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fats: meal.fats || 0,
          calories: (meal.protein * 4) + (meal.carbs * 4) + (meal.fats * 9) || 0,
          eaten: false,
          plannedMeal: true // Mark as planned meal
        });
      });
    }
  };

  // Use store data directly, eliminate index mismatch
  const toggleMealCompletion = (mealIndex) => {
    const storeMeals = todaysMeals?.meals || [];
    const meal = storeMeals[mealIndex];
    
    if (!meal) {
      console.error('Meal not found at index:', mealIndex);
      return;
    }

    if (meal.eaten) {
      // Add undo functionality
      unmarkMealAsEaten(mealIndex);
      console.log(`Meal unmarked: ${meal.name}`);
    } else {
      // Mark as eaten
      markMealAsEaten(mealIndex, 1);
      console.log(`Meal completed: ${meal.name}`);
    }
  };

  const MacroProgressBar = ({ label, consumed, target, color }) => {
    const percentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
    
    return (
      <View style={styles.macroProgressItem}>
        <View style={styles.macroProgressHeader}>
          <Text style={styles.macroProgressLabel}>{label}</Text>
          <Text style={styles.macroProgressValues}>
            {Math.round(consumed)}/{target}g
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${percentage}%`, backgroundColor: color }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(percentage)}%</Text>
        </View>
      </View>
    );
  };
  
  const generateAINutritionPlan = async () => {
    setIsGenerating(true);
    try {
      const aiEngine = new AICoachEngine(profile);
      const plan = aiEngine.generateNutritionPlan();
      setNutritionPlan(plan);
    } catch (error) {
      console.log('AI nutrition generation error:', error);
      // Fallback to ensure UI still works
      setNutritionPlan({
        title: "Basic Nutrition Plan",
        macros: { protein: 120, carbs: 200, fats: 65, calories: 1800 },
        meals: [
          { type: "breakfast", name: "Oatmeal with Berries", protein: 15, carbs: 45, fats: 5 },
          { type: "lunch", name: "Chicken Salad", protein: 35, carbs: 20, fats: 15 },
          { type: "dinner", name: "Salmon & Vegetables", protein: 40, carbs: 25, fats: 20 }
        ]
      });
    }
    setIsGenerating(false);
  };

  const handleGenerateNewMeals = () => {
    Alert.alert(
      'Generate New Plan?',
      'This will create a new AI-powered nutrition plan and clear today\'s meal progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate', 
          onPress: () => {
            // Clear existing meals before regenerating
            clearTodaysMeals();
            generateAINutritionPlan();
          }
        }
      ]
    );
  };

  if (!nutritionPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🧠 AI is generating your personalized nutrition plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  //  Use store meals as single source of truth
  const displayMeals = todaysMeals?.meals || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* AI-Powered Header */}
        <LinearGradient
          colors={['#22c55e', '#16a34a']}
          style={styles.aiHeader}
        >
          <View style={styles.headerContent}>
            <Text style={styles.aiTitle}>🤖 AI Nutrition Coach</Text>
            <Text style={styles.aiSubtitle}>{nutritionPlan.title}</Text>
            {nutritionPlan.subtitle && (
              <Text style={styles.aiDetails}>{nutritionPlan.subtitle}</Text>
            )}
          </View>
        </LinearGradient>

        {/* Real-time Macro Progress */}
        <View style={styles.macroSection}>
          <Text style={styles.sectionTitle}>🎯 Daily Macro Progress</Text>
          <Text style={styles.sectionSubtitle}>
            Track your nutrition goals in real-time
          </Text>
          
          <View style={styles.macroProgressContainer}>
            <MacroProgressBar 
              label="Protein"
              consumed={consumedMacros.protein}
              target={plannedMacros.protein}
              color="#22c55e"
            />
            <MacroProgressBar 
              label="Carbs"
              consumed={consumedMacros.carbs}
              target={plannedMacros.carbs}
              color="#3b82f6"
            />
            <MacroProgressBar 
              label="Fats"
              consumed={consumedMacros.fats}
              target={plannedMacros.fats}
              color="#f59e0b"
            />
            <MacroProgressBar 
              label="Calories"
              consumed={consumedMacros.calories}
              target={plannedMacros.calories}
              color="#8b5cf6"
            />
          </View>

          {/* Daily Summary */}
          <View style={styles.dailySummary}>
            <Text style={styles.summaryText}>
              📊 {displayMeals.filter(meal => meal.eaten).length}/{displayMeals.length} meals completed
            </Text>
            <Text style={styles.summaryText}>
              🎯 {Math.round((consumedMacros.calories / plannedMacros.calories) * 100)}% of daily calories consumed
            </Text>
          </View>
        </View>

        {/*  Meal Plan with Store Data */}
        <View style={styles.mealPlan}>
          <View style={styles.mealPlanHeader}>
            <Text style={styles.mealPlanTitle}>🍽️ Today's Meal Plan</Text>
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={handleGenerateNewMeals}
              disabled={isGenerating}
            >
              <Text style={styles.generateButtonText}>
                {isGenerating ? '🤖 Generating...' : '✨ Regenerate'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Render from store data, not nutrition plan */}
          {displayMeals.length > 0 ? (
            displayMeals.map((meal, index) => (
              <View key={index} style={styles.mealItemContainer}>
                <TouchableOpacity 
                  style={styles.mealItem}
                  onPress={() => Alert.alert(
                    meal.name,
                    `${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}\n\n` +
                    `Protein: ${meal.protein}g\nCarbs: ${meal.carbs}g\nFats: ${meal.fats || 'N/A'}g\nCalories: ${meal.calories}g` +
                    (meal.eaten ? `\n\n✅ Completed at: ${new Date(meal.eatenAt).toLocaleTimeString()}` : '')
                  )}
                >
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealType}>{meal.type}</Text>
                    <Text style={styles.mealMacros}>
                      P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                    </Text>
                    {meal.eaten && (
                      <Text style={styles.completedText}>
                        ✅ Completed • {Math.round(meal.actualMacros?.calories || meal.calories)} cal
                      </Text>
                    )}
                  </View>
                  
                  {/* Checkbox state from store */}
                  <TouchableOpacity
                    style={[styles.checkbox, meal.eaten && styles.checkboxCompleted]}
                    onPress={() => toggleMealCompletion(index)}
                  >
                    <Text style={[styles.checkboxText, meal.eaten && styles.checkboxTextCompleted]}>
                      {meal.eaten ? '✅' : '○'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noMealsContainer}>
              <Text style={styles.noMealsText}>🍽️ Generating your meals...</Text>
            </View>
          )}
        </View>

        {/* Progress Summary */}
        {displayMeals.length > 0 && (
          <View style={styles.progressSummary}>
            <Text style={styles.progressTitle}>📈 Today's Progress</Text>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{displayMeals.filter(m => m.eaten).length}</Text>
                <Text style={styles.statLabel}>Meals Eaten</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(consumedMacros.calories)}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(consumedMacros.protein)}g</Text>
                <Text style={styles.statLabel}>Protein</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round((consumedMacros.calories / plannedMacros.calories) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Goal</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  aiHeader: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  aiTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aiSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 4,
  },
  aiDetails: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  macroSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  macroProgressContainer: {
    marginBottom: 16,
  },
  macroProgressItem: {
    marginBottom: 12,
  },
  macroProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  macroProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  macroProgressValues: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    minWidth: 35,
    textAlign: 'right',
  },
  dailySummary: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  summaryText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 2,
  },
  mealPlan: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  mealPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  generateButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mealItemContainer: {
    marginBottom: 8,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  mealType: {
    fontSize: 12,
    color: '#6366f1',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  mealMacros: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  completedText: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '600',
    marginTop: 4,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#f0f9ff',
    borderColor: '#22c55e',
  },
  checkboxText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  checkboxTextCompleted: {
    fontSize: 16,
    color: '#22c55e',
  },
  noMealsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noMealsText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  progressSummary: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
});