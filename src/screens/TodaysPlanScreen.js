import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { AICoachEngine } from '../engine/AICoachEngine';
import { useUserProfileStore } from '../store/userProfileStore';
import DailyHeader from '../components/DailyHeader';
import WorkoutPillar from '../components/WorkoutPillar';
import NutritionPillar from '../components/NutritionPillar';
import RecoveryTracker from '../components/RecoveryTracker';
import MindsetTracker from '../components/MindsetTracker';

export default function TodaysPlanScreen() {
  // Get user profile from store
  const userProfile = useUserProfileStore(state => state.profile);
  
  // Generate today's plan using AI engine
  let todaysPlan = null;
  try {
    if (userProfile) {
      const aiEngine = new AICoachEngine(userProfile);
      todaysPlan = aiEngine.generateTodaysPlan();
    }
  } catch (error) {
    console.log('AI Engine not fully implemented yet, using fallback');
    // Fallback data structure for development
    todaysPlan = {
      workout: {
        title: "Upper Body Strength",
        exercises: [
          {
            id: 1,
            name: "Push-ups",
            sets: 3,
            reps: "8-12",
            target: "CHEST",
            color: "#22c55e"
          },
          {
            id: 2,
            name: "Pull-ups",
            sets: 3,
            reps: "5-8",
            target: "BACK", 
            color: "#3b82f6"
          }
        ],
        estimated_total_time: 30,
        goal: "Strength",
        coaching_notes: ["Focus on proper form", "Rest adequately between sets"]
      },
      nutrition: {
        title: "Balanced Nutrition Plan",
        macros: {
          protein: 120,
          carbs: 200,
          fats: 65,
          calories: 1800
        },
        meals: [
          {
            type: "breakfast",
            name: "Oatmeal with Berries",
            cost: 3.50,
            protein: 15,
            carbs: 45
          },
          {
            type: "lunch", 
            name: "Chicken Salad",
            cost: 8.00,
            protein: 35,
            carbs: 20
          },
          {
            type: "dinner",
            name: "Salmon & Vegetables", 
            cost: 12.00,
            protein: 40,
            carbs: 25
          }
        ],
        budget: {
          used: 85,
          total: 150
        },
        tip: "Stay hydrated throughout the day!"
      }
    };
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Daily Header */}
        <DailyHeader />
        
        {/* Training Pillar */}
        <WorkoutPillar plan={todaysPlan?.workout} />
        
        {/* Nutrition Pillar */}
        <NutritionPillar plan={todaysPlan?.nutrition} />
        
        {/* Recovery Pillar */}
        <RecoveryTracker />
        
        {/* Mindset Pillar */}
        <MindsetTracker />
        
        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacer: {
    height: 20,
  },
});