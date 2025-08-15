import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function NutritionPillar({ plan }) {
  // Handle case where AI nutrition plan might not be loaded yet
  if (!plan || !plan.meals) {
    return (
      <View style={styles.pillarCard}>
        <Text style={styles.pillarTitle}>🍽️ Today's Nutrition</Text>
        <Text style={styles.loadingText}>Generating your personalized meal plan...</Text>
      </View>
    );
  }

  const handleViewFullPlan = () => {
    // Could navigate to detailed nutrition screen or expand inline
    console.log('View full nutrition plan');
  };

  const getMacroColor = (macro) => {
    switch(macro) {
      case 'protein': return '#22c55e';
      case 'carbs': return '#3b82f6';
      case 'fats': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  return (
    <View style={styles.pillarCard}>
      <View style={styles.pillarHeader}>
        <Text style={styles.pillarTitle}>🍽️ Today's Nutrition</Text>
        <Text style={styles.nutritionSubtitle}>{plan.title || 'Personalized Meal Plan'}</Text>
      </View>

      {/* Macro Overview */}
      {plan.macros && (
        <View style={styles.macroSummary}>
          <Text style={styles.macroTitle}>Daily Targets</Text>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: getMacroColor('protein') }]}>
                {plan.macros.protein}g
              </Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: getMacroColor('carbs') }]}>
                {plan.macros.carbs}g
              </Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: getMacroColor('fats') }]}>
                {plan.macros.fats}g
              </Text>
              <Text style={styles.macroLabel}>Fats</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{plan.macros.calories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
          </View>
        </View>
      )}

      {/* Meal Preview */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealPreview}>
        {plan.meals?.map((meal, index) => (
          <View key={index} style={styles.mealCard}>
            <Text style={styles.mealType}>{meal.type}</Text>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealCost}>${meal.cost}</Text>
            <View style={styles.mealMacros}>
              <Text style={styles.mealMacroText}>P: {meal.protein}g</Text>
              <Text style={styles.mealMacroText}>C: {meal.carbs}g</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Budget Summary */}
      {plan.budget && (
        <View style={styles.budgetSummary}>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Weekly Budget</Text>
            <Text style={styles.budgetValue}>${plan.budget.used} / ${plan.budget.total}</Text>
          </View>
          <View style={styles.budgetBar}>
            <View 
              style={[
                styles.budgetProgress, 
                { width: `${(plan.budget.used / plan.budget.total) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.viewPlanButton} onPress={handleViewFullPlan}>
        <Text style={styles.viewPlanButtonText}>View Full Plan & Shopping List 📋</Text>
      </TouchableOpacity>

      {/* AI Nutrition Tip */}
      {plan.tip && (
        <View style={styles.nutritionTip}>
          <Text style={styles.tipText}>💡 {plan.tip}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pillarCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  pillarHeader: {
    marginBottom: 16,
  },
  pillarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  macroSummary: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  mealPreview: {
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 130,
  },
  mealType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  mealCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 6,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealMacroText: {
    fontSize: 10,
    color: '#64748b',
  },
  budgetSummary: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  budgetValue: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  budgetBar: {
    height: 4,
    backgroundColor: '#e0e7ff',
    borderRadius: 2,
    overflow: 'hidden',
  },
  budgetProgress: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  viewPlanButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewPlanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nutritionTip: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 12,
  },
  tipText: {
    fontSize: 12,
    color: '#166534',
    fontStyle: 'italic',
  },
});