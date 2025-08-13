import React, { useState,useEffect } from 'react';
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
import {useWorkoutStore} from "../store/workoutStore";
export default function DietScreen() {
  const { userPreferences, generateMealPlan, updateUserPreferences } = useWorkoutStore();
  const [mealPlan, setMealPlan] = useState(null);
  const [selectedStore, setSelectedStore] = useState(userPreferences.preferredStore || 'walmart');

  useEffect(() => {
    // Generate initial meal plan
    const plan = generateMealPlan();
    setMealPlan(plan);
  }, []);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    updateUserPreferences({ preferredStore: store });
  };

  const handleGenerateNewMeals = () => {
    const newPlan = generateMealPlan();
    setMealPlan(newPlan);
  };

  const handleBudgetChange = (newBudget) => {
    updateUserPreferences({ weeklyBudget: newBudget });
    // Regenerate meal plan with new budget
    setTimeout(() => {
      const newPlan = generateMealPlan();
      setMealPlan(newPlan);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Budget Section */}
        <LinearGradient
          colors={['#22c55e', '#16a34a']}
          style={styles.budgetSection}
        >
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.budgetAmount}>${userPreferences.weeklyBudget}</Text>
              <Text style={styles.budgetPeriod}>Weekly Budget</Text>
            </View>
            <Text style={styles.budgetIcon}>🛒</Text>
          </View>
          
          {mealPlan && (
            <View style={styles.budgetSummary}>
              <Text style={styles.budgetUsed}>
                Used: ${mealPlan.totalCost} • Remaining: ${mealPlan.remaining}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Budget Adjustment */}
        <View style={styles.budgetControls}>
          <Text style={styles.controlsTitle}>Adjust Weekly Budget</Text>
          <View style={styles.budgetOptions}>
            {[100, 150, 200, 250].map(budget => (
              <TouchableOpacity
                key={budget}
                style={[
                  styles.budgetOption,
                  userPreferences.weeklyBudget === budget && styles.selectedBudgetOption
                ]}
                onPress={() => handleBudgetChange(budget)}
              >
                <Text style={[
                  styles.budgetOptionText,
                  userPreferences.weeklyBudget === budget && styles.selectedBudgetText
                ]}>
                  ${budget}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Store Selector - keep your existing code but update the state */}
        <View style={styles.storeSelector}>
          <Text style={styles.storeTitle}>Select Your Store</Text>
          <View style={styles.storeOptions}>
            <TouchableOpacity 
              style={[styles.storeOption, selectedStore === 'walmart' && styles.storeSelected]}
              onPress={() => handleStoreSelect('walmart')}
            >
              <Text style={styles.storeIcon}>🏪</Text>
              <Text style={styles.storeLabel}>Walmart</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.storeOption, selectedStore === 'target' && styles.storeSelected]}
              onPress={() => handleStoreSelect('target')}
            >
              <Text style={styles.storeIcon}>🎯</Text>
              <Text style={styles.storeLabel}>Target</Text>
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

        {/* Meal Plan */}
        {mealPlan && (
          <View style={styles.mealPlan}>
            <View style={styles.mealPlanHeader}>
              <Text style={styles.mealPlanTitle}>This Week's Meals</Text>
              <TouchableOpacity 
                style={styles.generateButton}
                onPress={handleGenerateNewMeals}
              >
                <Text style={styles.generateButtonText}>Generate New</Text>
              </TouchableOpacity>
            </View>
            
            {mealPlan.weeklyMeals.slice(0, 1)[0]?.meals.map((meal, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.mealItem}
                onPress={() => console.log('Meal details:', meal)}
              >
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealPrice}>${meal.baseCost}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>
                Weekly Total: ${mealPlan.totalCost} / ${mealPlan.budget}
              </Text>
              <Text style={styles.dailyAverage}>
                Daily Average: ${mealPlan.dailyAverage}
              </Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  budgetSection: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  budgetPeriod: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  budgetIcon: {
    fontSize: 32,
  },
  storeSelector: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 16,
  },
  shoppingListButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shoppingListButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  budgetSummary: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  budgetUsed: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
  budgetControls: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  budgetOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedBudgetOption: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  budgetOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedBudgetText: {
    color: 'white',
  },
  dailyAverage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
});
