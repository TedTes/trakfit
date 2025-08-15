import React, { useState } from 'react';
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
import { useUserProfileStore } from '../../store/userProfileStore';

export default function FitnessGoalsScreen({ navigation }) {
  const { updateFitnessGoals, setOnboardingStep } = useUserProfileStore();
  
  const [formData, setFormData] = useState({
    primary: '',
    secondary: '',
    timeline: ''
  });

  const goalOptions = [
    {
      key: 'strength',
      label: 'Build Strength',
      icon: '💪',
      description: 'Increase muscle strength and power'
    },
    {
      key: 'fat_loss',
      label: 'Lose Fat',
      icon: '🔥',
      description: 'Burn fat and improve body composition'
    },
    {
      key: 'muscle_gain',
      label: 'Build Muscle',
      icon: '🏗️',
      description: 'Increase muscle mass and size'
    },
    {
      key: 'endurance',
      label: 'Improve Endurance',
      icon: '🏃',
      description: 'Build cardiovascular fitness'
    },
    {
      key: 'mobility',
      label: 'Enhance Mobility',
      icon: '🤸',
      description: 'Improve flexibility and movement quality'
    },
    {
      key: 'general_fitness',
      label: 'General Fitness',
      icon: '🎯',
      description: 'Overall health and wellness'
    }
  ];

  const timelineOptions = [
    {
      key: '3_months',
      label: '3 Months',
      description: 'Quick results focus'
    },
    {
      key: '6_months',
      label: '6 Months',
      description: 'Balanced approach'
    },
    {
      key: '12_months',
      label: '1 Year',
      description: 'Long-term transformation'
    },
    {
      key: 'ongoing',
      label: 'Ongoing',
      description: 'Lifestyle change'
    }
  ];

  const handleGoalSelection = (goalType, goalKey) => {
    if (goalType === 'primary') {
      setFormData(prev => ({
        ...prev,
        primary: goalKey,
        // Clear secondary if it's the same as primary
        secondary: prev.secondary === goalKey ? '' : prev.secondary
      }));
    } else {
      // Don't allow same goal for both primary and secondary
      if (goalKey !== formData.primary) {
        setFormData(prev => ({
          ...prev,
          secondary: goalKey
        }));
      }
    }
  };
  const handleContinue = () => {
    if (validateForm()) {
      // Save to store
      updateFitnessGoals({
        primary: formData.primary,
        secondary: formData.secondary || null,
        timeline: formData.timeline
      });

      // Move to next onboarding step
      setOnboardingStep(2);
      
      // Navigate to next screen directly
      navigation.navigate('Equipment');
    }
  };
  const handleTimelineSelection = (timelineKey) => {
    setFormData(prev => ({
      ...prev,
      timeline: timelineKey
    }));
  };

  const validateForm = () => {
    if (!formData.primary) {
      Alert.alert('Missing Selection', 'Please select your primary fitness goal.');
      return false;
    }

    if (!formData.timeline) {
      Alert.alert('Missing Selection', 'Please select your target timeline.');
      return false;
    }

    return true;
  };

  

  const getGoalInfo = (goalKey) => {
    return goalOptions.find(goal => goal.key === goalKey);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Fitness Goals</Text>
          <Text style={styles.headerSubtitle}>What do you want to achieve?</Text>
          <Text style={styles.stepIndicator}>Step 2 of 5</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          {/* Primary Goal Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Primary Goal</Text>
            <Text style={styles.sectionSubtitle}>Choose your main focus</Text>
            
            <View style={styles.goalsGrid}>
              {goalOptions.map((goal) => (
                <TouchableOpacity
                  key={goal.key}
                  style={[
                    styles.goalCard,
                    formData.primary === goal.key && styles.goalCardSelected
                  ]}
                  onPress={() => handleGoalSelection('primary', goal.key)}
                >
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={[
                    styles.goalLabel,
                    formData.primary === goal.key && styles.goalLabelSelected
                  ]}>
                    {goal.label}
                  </Text>
                  <Text style={[
                    styles.goalDescription,
                    formData.primary === goal.key && styles.goalDescriptionSelected
                  ]}>
                    {goal.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Secondary Goal Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Secondary Goal (Optional)</Text>
            <Text style={styles.sectionSubtitle}>Add a secondary focus if desired</Text>
            
            <View style={styles.secondaryGoalsContainer}>
              {goalOptions
                .filter(goal => goal.key !== formData.primary)
                .map((goal) => (
                <TouchableOpacity
                  key={goal.key}
                  style={[
                    styles.secondaryGoalOption,
                    formData.secondary === goal.key && styles.secondaryGoalSelected
                  ]}
                  onPress={() => handleGoalSelection('secondary', goal.key)}
                >
                  <Text style={styles.secondaryGoalIcon}>{goal.icon}</Text>
                  <View style={styles.secondaryGoalText}>
                    <Text style={[
                      styles.secondaryGoalLabel,
                      formData.secondary === goal.key && styles.secondaryGoalLabelSelected
                    ]}>
                      {goal.label}
                    </Text>
                    <Text style={[
                      styles.secondaryGoalDesc,
                      formData.secondary === goal.key && styles.secondaryGoalDescSelected
                    ]}>
                      {goal.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Timeline Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timeline</Text>
            <Text style={styles.sectionSubtitle}>When do you want to see results?</Text>
            
            <View style={styles.timelineContainer}>
              {timelineOptions.map((timeline) => (
                <TouchableOpacity
                  key={timeline.key}
                  style={[
                    styles.timelineOption,
                    formData.timeline === timeline.key && styles.timelineSelected
                  ]}
                  onPress={() => handleTimelineSelection(timeline.key)}
                >
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.timelineLabel,
                      formData.timeline === timeline.key && styles.timelineLabelSelected
                    ]}>
                      {timeline.label}
                    </Text>
                    <Text style={[
                      styles.timelineDescription,
                      formData.timeline === timeline.key && styles.timelineDescriptionSelected
                    ]}>
                      {timeline.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Goals Summary */}
          {formData.primary && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Your Goals Summary</Text>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryText}>
                  🎯 Primary: {getGoalInfo(formData.primary)?.label}
                </Text>
                {formData.secondary && (
                  <Text style={styles.summaryText}>
                    🎯 Secondary: {getGoalInfo(formData.secondary)?.label}
                  </Text>
                )}
                {formData.timeline && (
                  <Text style={styles.summaryText}>
                    ⏰ Timeline: {timelineOptions.find(t => t.key === formData.timeline)?.label}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepIndicator: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  formContainer: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minHeight: 120,
  },
  goalCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  goalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  goalLabelSelected: {
    color: '#6366f1',
  },
  goalDescription: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 16,
  },
  goalDescriptionSelected: {
    color: '#6366f1',
  },
  secondaryGoalsContainer: {
    gap: 8,
  },
  secondaryGoalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryGoalSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  secondaryGoalIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  secondaryGoalText: {
    flex: 1,
  },
  secondaryGoalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  secondaryGoalLabelSelected: {
    color: '#6366f1',
  },
  secondaryGoalDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  secondaryGoalDescSelected: {
    color: '#6366f1',
  },
  timelineContainer: {
    gap: 8,
  },
  timelineOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timelineSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  timelineContent: {
    alignItems: 'center',
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  timelineLabelSelected: {
    color: '#6366f1',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  timelineDescriptionSelected: {
    color: '#6366f1',
  },
  summarySection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
  },
  summaryContent: {
    gap: 6,
  },
  summaryText: {
    fontSize: 14,
    color: '#1e40af',
  },
  continueButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  continueButtonGradient: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});