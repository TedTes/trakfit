import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserProfileStore } from '../store/userProfileStore';

// Import all onboarding screens
import PersonalProfileScreen from './onboarding/PersonalProfileScreen';
import FitnessGoalsScreen from './onboarding/FitnessGoalsScreen';
import EquipmentScreen from './onboarding/EquipmentScreen';
import DietaryPreferencesScreen from './onboarding/DietaryPreferencesScreen';
import LifestyleAssessmentScreen from './onboarding/LifestyleAssessmentScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  const { onboardingStep } = useUserProfileStore();

  // Determine which screen to show based on onboarding step
  const getInitialRouteName = () => {
    switch (onboardingStep) {
      case 0: return 'PersonalProfile';
      case 1: return 'FitnessGoals';
      case 2: return 'Equipment';
      case 3: return 'DietaryPreferences';
      case 4: return 'LifestyleAssessment';
      default: return 'PersonalProfile';
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false, // We have custom headers in each screen
        gestureEnabled: false, // Prevent swipe back - force linear progression
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="PersonalProfile" 
        component={PersonalProfileScreen}
        listeners={({ navigation }) => ({
          // Auto-navigate when onboarding step changes
          focus: () => {
            const currentStep = useUserProfileStore.getState().onboardingStep;
            if (currentStep > 0) {
              switch (currentStep) {
                case 1:
                  navigation.navigate('FitnessGoals');
                  break;
                case 2:
                  navigation.navigate('Equipment');
                  break;
                case 3:
                  navigation.navigate('DietaryPreferences');
                  break;
                case 4:
                  navigation.navigate('LifestyleAssessment');
                  break;
                default:
                  break;
              }
            }
          }
        })}
      />
      
      <Stack.Screen 
        name="FitnessGoals" 
        component={FitnessGoalsScreen}
        listeners={({ navigation }) => ({
          focus: () => {
            const currentStep = useUserProfileStore.getState().onboardingStep;
            if (currentStep > 1) {
              switch (currentStep) {
                case 2:
                  navigation.navigate('Equipment');
                  break;
                case 3:
                  navigation.navigate('DietaryPreferences');
                  break;
                case 4:
                  navigation.navigate('LifestyleAssessment');
                  break;
                default:
                  break;
              }
            }
          }
        })}
      />
      
      <Stack.Screen 
        name="Equipment" 
        component={EquipmentScreen}
        listeners={({ navigation }) => ({
          focus: () => {
            const currentStep = useUserProfileStore.getState().onboardingStep;
            if (currentStep > 2) {
              switch (currentStep) {
                case 3:
                  navigation.navigate('DietaryPreferences');
                  break;
                case 4:
                  navigation.navigate('LifestyleAssessment');
                  break;
                default:
                  break;
              }
            }
          }
        })}
      />
      
      <Stack.Screen 
        name="DietaryPreferences" 
        component={DietaryPreferencesScreen}
        listeners={({ navigation }) => ({
          focus: () => {
            const currentStep = useUserProfileStore.getState().onboardingStep;
            if (currentStep > 3) {
              navigation.navigate('LifestyleAssessment');
            }
          }
        })}
      />
      
      <Stack.Screen 
        name="LifestyleAssessment" 
        component={LifestyleAssessmentScreen}
      />
    </Stack.Navigator>
  );
}