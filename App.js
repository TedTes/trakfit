import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useUserProfileStore } from './src/store/userProfileStore';
import { View, Text } from 'react-native';

// Import main app screens
import TodaysPlanScreen from './src/screens/TodaysPlanScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import DietScreen from './src/screens/DietScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function ProfileTabIcon({ focused, color, size }) {
  // Get AI power level with error handling
  const getAIPowerLevel = useUserProfileStore(state => state.getAIPowerLevel);
  
  let aiPower;
  try {
    aiPower = getAIPowerLevel();
  } catch (error) {
    // Fallback if store function doesn't exist yet
    console.log('AI Power function not ready yet, using fallback');
    aiPower = { level: 50 }; // Default to show badge
  }
  
  // Only show badge if profile is not fully complete
  const showBadge = aiPower.level < 100;
  
  return (
    <View style={{ position: 'relative' }}>
      <Ionicons 
        name={focused ? 'person' : 'person-outline'} 
        size={size} 
        color={color} 
      />
      {showBadge && (
        <View style={{
          position: 'absolute',
          right: -8,
          top: -4,
          backgroundColor: '#6366f1',
          borderRadius: 10,
          minWidth: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}>
          <Text style={{
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
          }}>
            {aiPower.level}%
          </Text>
        </View>
      )}
    </View>
  );
}

// Main App Navigation
function MainAppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Today') {
            const iconName = focused ? 'today' : 'today-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Execute') {
            const iconName = focused ? 'fitness' : 'fitness-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Nutrition') {
            const iconName = focused ? 'restaurant' : 'restaurant-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <ProfileTabIcon focused={focused} color={color} size={size} />;
          }
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
      
      {/* PROFILE: User data, progress tracking, AND profile completion */}
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

export default function App() {
  return (
    <NavigationContainer>
      {/* Always show main app - no more onboarding gate! */}
      <MainAppNavigator />
    </NavigationContainer>
  );
}