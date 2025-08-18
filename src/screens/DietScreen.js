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
  const { profile} = useUserProfileStore();
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { logMeal, markMealAsEaten } = useLogStore();
  const [completedMeals, setCompletedMeals] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    generateAINutritionPlan();
  }, []);

  useEffect(() => {
    // Initialize today's meals in logStore when nutrition plan is generated
    if (nutritionPlan?.meals) {
      const { getTodaysMeals, logMeal } = useLogStore.getState();
      
      // Only initialize if no meals exist for today
      if (!getTodaysMeals()) {
        nutritionPlan.meals.forEach((meal, index) => {
          logMeal({
            name: meal.name,
            type: meal.type,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fats: meal.fats || 0,
            calories: (meal.protein * 4) + (meal.carbs * 4) + (meal.fats * 9) || 0,
            eaten: false,
            plannedIndex: index
          });
        });
      }
    }
  }, [nutritionPlan]);

  const getConsumedMacros = () => {
    const { getTodaysMeals } = useLogStore.getState();
    const todaysMeals = getTodaysMeals();
    return todaysMeals?.totalMacros || { protein: 0, carbs: 0, fats: 0, calories: 0 };
  };
  const toggleMealCompletion = (mealIndex, meal) => {
    const isCompleted = !completedMeals[mealIndex];
    
    setCompletedMeals(prev => ({
      ...prev,
      [mealIndex]: isCompleted
    }));
    
    if (isCompleted) {
      markMealAsEaten(mealIndex, 1);
      console.log(`Meal completed: ${meal.name}`);
      
      // Force re-render of progress bars
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 100);
    }
  };

  const consumedMacros = getConsumedMacros();
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
          { type: "breakfast", name: "Oatmeal with Berries", protein: 15, carbs: 45 },
          { type: "lunch", name: "Chicken Salad",  protein: 35, carbs: 20 },
          { type: "dinner", name: "Salmon & Vegetables",  protein: 40, carbs: 25 }
        ]
      });
    }
    setIsGenerating(false);
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
    <Text style={styles.sectionTitle}>🎯 Daily Macro Progress</Text>
    <Text style={styles.sectionSubtitle}>
      Track your nutrition goals in real-time
    </Text>
    
    {/* Real-time Progress Bars */}
    <View style={styles.macroProgressContainer}>
    <MacroProgressBar 
  label="Protein"
  consumed={consumedMacros.protein}
  target={nutritionPlan.macros.protein}
  color="#22c55e"
  key={`protein-${refreshTrigger}`}
/>
<MacroProgressBar 
  label="Carbs"
  consumed={consumedMacros.carbs}
  target={nutritionPlan.macros.carbs}
  color="#3b82f6"
  key={`carbs-${refreshTrigger}`}
/>
<MacroProgressBar 
  label="Fats"
  consumed={consumedMacros.fats}
  target={nutritionPlan.macros.fats}
  color="#f59e0b"
  key={`fats-${refreshTrigger}`}
/>
<MacroProgressBar 
  label="Calories"
  consumed={consumedMacros.calories}
  target={nutritionPlan.macros.calories}
  color="#8b5cf6"
  key={`calories-${refreshTrigger}`}
/>
    </View>
  </View>
)}
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
          
          {nutritionPlan.meals?.map((meal, index) => {
  const isCompleted = completedMeals[index] || false;
  
  return (
    <View key={index} style={styles.mealItemContainer}>
      <TouchableOpacity 
        style={styles.mealItem}
        onPress={() => Alert.alert(
          meal.name,
          `${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}\n\n` +
          `Protein: ${meal.protein}g\nCarbs: ${meal.carbs}g\nFats: ${meal.fats || 'N/A'}g`
        )}
      >
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealType}>{meal.type}</Text>
          <Text style={styles.mealMacros}>
            P: {meal.protein}g • C: {meal.carbs}g
          </Text>
        </View>
        
        {/* NEW: Completion Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={() => toggleMealCompletion(index, meal)}
        >
          <Text style={[styles.checkboxText, isCompleted && styles.checkboxTextCompleted]}>
            {isCompleted ? '✅' : '○'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
})}
          
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


  markEatenButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  markEatenText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  mealItemContainer: {
    marginBottom: 8,
  },
  mealInfo: {
    flex: 1,
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
  macroProgressContainer: {
    marginBottom: 20,
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
  targetsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  }
});