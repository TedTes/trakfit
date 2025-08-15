import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens aligned with User Journey Model
import TodaysPlanScreen from './src/screens/TodaysPlanScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AnalyzeScreen from './src/screens/AnalyzeScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Today') {
              iconName = focused ? 'today' : 'today-outline';
            } else if (route.name === 'Execute') {
              iconName = focused ? 'fitness' : 'fitness-outline';
            } else if (route.name === 'Analyze') {
              iconName = focused ? 'camera' : 'camera-outline';
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
        
        {/* ANALYZE: Photo analysis for AI improvements */}
        <Tab.Screen 
          name="Analyze" 
          component={AnalyzeScreen}
          options={{
            title: "Analyze"
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
    </NavigationContainer>
  );
}