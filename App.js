import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useUserProfileStore } from './src/store/userProfileStore';

// Import main app screens
import TodaysPlanScreen from './src/screens/TodaysPlanScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import DietScreen from './src/screens/DietScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import onboarding navigator
import OnboardingNavigator from './src/screens/OnboardingNavigator';

const Tab = createBottomTabNavigator();

// Main App Navigation (after onboarding is complete)
function MainAppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Today') {
            iconName = focused ? 'today' : 'today-outline';
          } else if (route.name === 'Execute') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
      initialRouteName="Today"
    >
      {/* PRIMARY: Today's Plan - Main screen with all 4 pillars */}
      <Tab.Screen 
        name="Today" 
        component={TodaysPlanScreen}
        options={{
          title: "Today's Plan"
        }}
      />
      
      {/* EXECUTE: Workout execution when user is ready to train */}
      <Tab.Screen 
        name="Execute" 
        component={WorkoutScreen}
        options={{
          title: "Execute"
        }}
      />
      
      {/* NUTRITION: AI-powered nutrition planning */}
      <Tab.Screen 
        name="Nutrition" 
        component={DietScreen}
        options={{
          title: "Nutrition"
        }}
      />
      
      {/* PROFILE: User data and progress tracking */}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: "Profile"
        }}
      />
    </Tab.Navigator>
  );
}

// Root App Component
export default function App() {
  // Get profile completion status from store
  const isProfileComplete = useUserProfileStore(state => state.isProfileComplete);

  return (
    <NavigationContainer>
      {isProfileComplete ? (
        // Show main app if profile is complete
        <MainAppNavigator />
      ) : (
        // Show onboarding flow if profile is not complete
        <OnboardingNavigator />
      )}
    </NavigationContainer>
  );
}