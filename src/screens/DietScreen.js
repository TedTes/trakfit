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

export default function DietScreen() {
  const { profile, updateDietaryPreferences } = useUserProfileStore();
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [selectedStore, setSelectedStore] = useState(profile.dietaryPreferences?.preferredStore || 'walmart');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateAINutritionPlan();
  }, []);

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
          { type: "breakfast", name: "Oatmeal with Berries", cost: 3.50, protein: 15, carbs: 45 },
          { type: "lunch", name: "Chicken Salad", cost: 8.00, protein: 35, carbs: 20 },
          { type: "dinner", name: "Salmon & Vegetables", cost: 12.00, protein: 40, carbs: 25 }
        ],
        budget: { used: 85, total: 150 },
        tip: "Stay hydrated throughout the day!"
      });
    }
    setIsGenerating(false);
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    updateDietaryPreferences({ preferredStore: store });
    
    // Regenerate plan with new store preferences
    setTimeout(() => {
      generateAINutritionPlan();
    }, 100);
  };

  const handleGenerateNewMeals = () => {
    Alert.alert(
      'Generate New Plan?',
      'This will create a new AI-powered nutrition plan based on your current profile and goals.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: generateAINutritionPlan }
      ]
    );
  };

  const handleBudgetChange = (newBudget) => {
    updateDietaryPreferences({ weeklyBudget: newBudget });
    
    // Update profile and regenerate with new budget
    setTimeout(() => {
      generateAINutritionPlan();
    }, 100);
  };

  const handleGoalAdjustment = (newGoal) => {
    // Update fitness goal which affects nutrition planning
    useUserProfileStore.getState().updateFitnessGoals({ primary: newGoal });
    
    Alert.alert(
      'Goal Updated!',
      `Your nutrition plan will be regenerated for ${newGoal} focus.`,
      [{ text: 'OK', onPress: generateAINutritionPlan }]
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

        {/* Intelligent Macro Targets */}
        {nutritionPlan.macros && (
          <View style={styles.macroSection}>
            <Text style={styles.sectionTitle}>🎯 AI-Calculated Targets</Text>
            <Text style={styles.sectionSubtitle}>
              Based on your {profile.personalProfile.age}yr old {profile.personalProfile.sex}, 
              {profile.personalProfile.weight}kg, {profile.fitnessGoals.primary} goal
            </Text>
            
            <View style={styles.macroGrid}>
              <View style={styles.macroCard}>
                <Text style={[styles.macroValue, { color: '#22c55e' }]}>
                  {nutritionPlan.macros.protein}g
                </Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={[styles.macroValue, { color: '#3b82f6' }]}>
                  {nutritionPlan.macros.carbs}g
                </Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={[styles.macroValue, { color: '#f59e0b' }]}>
                  {nutritionPlan.macros.fats}g
                </Text>
                <Text style={styles.macroLabel}>Fats</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroValue}>
                  {nutritionPlan.macros.calories}
                </Text>
                <Text style={styles.macroLabel}>Calories</Text>
              </View>
            </View>
          </View>
        )}

        {/* Store Selection */}
        <View style={styles.storeSelector}>
          <Text style={styles.storeTitle}>🛒 Preferred Store</Text>
          <View style={styles.storeOptions}>
            <TouchableOpacity 
              style={[styles.storeOption, selectedStore === 'walmart' && styles.storeSelected]}
              onPress={() => handleStoreSelect('walmart')}
            >
              <Text style={styles.storeIcon}>🛍️</Text>
              <Text style={styles.storeLabel}>Walmart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.storeOption, selectedStore === 'costco' && styles.storeSelected]}
              onPress={() => handleStoreSelect('costco')}
            >
              <Text style={styles.storeIcon}>📦</Text>
              <Text style={styles.storeLabel}>Costco</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.storeOption, selectedStore === 'kroger' && styles.storeSelected]}
              onPress={() => handleStoreSelect('kroger')}
            >
              <Text style={styles.storeIcon}>🛍️</Text>
              <Text style={styles.storeLabel}>Kroger</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Generated Meal Plan */}
        <View style={styles.mealPlan}>
          <View style={styles.mealPlanHeader}>
            <Text style={styles.mealPlanTitle}>🍽️ AI Meal Plan</Text>
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
          
          {nutritionPlan.meals?.map((meal, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.mealItem}
              onPress={() => Alert.alert(
                meal.name,
                `${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}\n\n` +
                `Protein: ${meal.protein}g\nCarbs: ${meal.carbs}g\nFats: ${meal.fats || 'N/A'}g\n\n` +
                `Cost: $${meal.cost}`
              )}
            >
              <View>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealType}>{meal.type}</Text>
                <Text style={styles.mealMacros}>
                  P: {meal.protein}g • C: {meal.carbs}g
                </Text>
              </View>
              <Text style={styles.mealPrice}>${meal.cost}</Text>
            </TouchableOpacity>
          ))}
          
          {nutritionPlan.budget && (
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>
                Weekly Total: ${nutritionPlan.budget.used} / ${nutritionPlan.budget.total}
              </Text>
              <View style={styles.budgetBar}>
                <View 
                  style={[
                    styles.budgetProgress, 
                    { width: `${(nutritionPlan.budget.used / nutritionPlan.budget.total) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        {/* AI Tips */}
        {nutritionPlan.tip && (
          <View style={styles.aiTipSection}>
            <Text style={styles.aiTipTitle}>💡 AI Coach Tip</Text>
            <Text style={styles.aiTipText}>{nutritionPlan.tip}</Text>
          </View>
        )}

        {/* Quick Goal Adjustments */}
        <View style={styles.goalAdjustments}>
          <Text style={styles.goalTitle}>🎯 Quick Goal Adjustments</Text>
          <View style={styles.goalButtons}>
            <TouchableOpacity 
              style={styles.goalButton}
              onPress={() => handleGoalAdjustment('fat_loss')}
            >
              <Text style={styles.goalButtonText}>🔥 Fat Loss</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.goalButton}
              onPress={() => handleGoalAdjustment('strength')}
            >
              <Text style={styles.goalButtonText}>💪 Strength</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.goalButton}
              onPress={() => handleGoalAdjustment('endurance')}
            >
              <Text style={styles.goalButtonText}>🏃 Endurance</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  storeSelector: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1e293b',
  },
  storeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  storeSelected: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  storeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  storeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
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
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  mealPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
    textAlign: 'center',
  },
  budgetBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  budgetProgress: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  aiTipSection: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  aiTipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  aiTipText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  goalAdjustments: {
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
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  goalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  goalButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  goalButtonText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
});