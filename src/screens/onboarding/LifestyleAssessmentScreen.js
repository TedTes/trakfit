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

export default function LifestyleAssessmentScreen({ navigation }) {
  const { updateLifestyleAssessment, completeOnboarding } = useUserProfileStore();
  
  const [formData, setFormData] = useState({
    sleepQuality: '',
    sleepDuration: '',
    stressLevel: '',
    timeAvailable: '',
    workoutDays: '',
    recoveryHabits: []
  });

  const sleepQualityOptions = [
    { key: 'poor', label: 'Poor', icon: '😴', description: 'Restless, wake up tired' },
    { key: 'fair', label: 'Fair', icon: '😐', description: 'Some good nights, some bad' },
    { key: 'good', label: 'Good', icon: '😊', description: 'Usually sleep well' },
    { key: 'excellent', label: 'Excellent', icon: '😍', description: 'Wake up refreshed daily' }
  ];

  const sleepDurationOptions = [
    { key: 'under_6', label: 'Under 6 hours', icon: '⏰' },
    { key: '6_7', label: '6-7 hours', icon: '🕐' },
    { key: '7_8', label: '7-8 hours', icon: '🕑' },
    { key: '8_9', label: '8-9 hours', icon: '🕒' },
    { key: 'over_9', label: 'Over 9 hours', icon: '🕓' }
  ];

  const stressLevelOptions = [
    { key: 'low', label: 'Low Stress', icon: '😌', description: 'Generally calm and relaxed', color: '#22c55e' },
    { key: 'moderate', label: 'Moderate Stress', icon: '😐', description: 'Some stressful periods', color: '#f59e0b' },
    { key: 'high', label: 'High Stress', icon: '😰', description: 'Often stressed or anxious', color: '#ef4444' },
    { key: 'very_high', label: 'Very High Stress', icon: '🤯', description: 'Constantly overwhelmed', color: '#dc2626' }
  ];

  const timeAvailableOptions = [
    { key: '15_30', label: '15-30 minutes', icon: '⚡', description: 'Quick sessions only' },
    { key: '30_45', label: '30-45 minutes', icon: '🏃', description: 'Standard workout time' },
    { key: '45_60', label: '45-60 minutes', icon: '💪', description: 'Full workout sessions' },
    { key: '60_plus', label: '60+ minutes', icon: '🏋️', description: 'Extended training time' }
  ];

  const workoutDaysOptions = [
    { key: '2_3', label: '2-3 days/week', icon: '📅', description: 'Beginner frequency' },
    { key: '3_4', label: '3-4 days/week', icon: '📊', description: 'Moderate frequency' },
    { key: '4_5', label: '4-5 days/week', icon: '📈', description: 'Active frequency' },
    { key: '5_6', label: '5-6 days/week', icon: '🔥', description: 'High frequency' },
    { key: '6_7', label: '6-7 days/week', icon: '⚡', description: 'Daily training' }
  ];

  const recoveryHabitsOptions = [
    { key: 'stretching', label: 'Regular Stretching', icon: '🤸' },
    { key: 'meditation', label: 'Meditation/Mindfulness', icon: '🧘' },
    { key: 'massage', label: 'Massage Therapy', icon: '💆' },
    { key: 'yoga', label: 'Yoga Practice', icon: '🧘‍♀️' },
    { key: 'walks', label: 'Daily Walks', icon: '🚶' },
    { key: 'baths', label: 'Hot Baths/Sauna', icon: '🛁' },
    { key: 'music', label: 'Relaxing Music', icon: '🎵' },
    { key: 'reading', label: 'Reading/Quiet Time', icon: '📚' }
  ];

  const handleSingleSelection = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleRecoveryHabitToggle = (habitKey) => {
    setFormData(prev => ({
      ...prev,
      recoveryHabits: prev.recoveryHabits.includes(habitKey)
        ? prev.recoveryHabits.filter(h => h !== habitKey)
        : [...prev.recoveryHabits, habitKey]
    }));
  };

  const validateForm = () => {
    const requiredFields = ['sleepQuality', 'sleepDuration', 'stressLevel', 'timeAvailable', 'workoutDays'];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        Alert.alert('Missing Information', `Please select your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
        return false;
      }
    }

    return true;
  };

  const handleCompleteOnboarding = () => {
    if (validateForm()) {
      // Save lifestyle assessment to store
      updateLifestyleAssessment(formData);

      // Complete the entire onboarding process
      completeOnboarding();
      
      Alert.alert(
        '🎉 Welcome to Your AI Coach!',
        'Your profile is complete! Your personalized fitness and nutrition plans are ready.',
        [{ 
          text: 'Start Your Journey!', 
          onPress: () => {
            console.log('Navigate to main app - TodaysPlanScreen');
            // This would typically navigate to the main app
          }
        }]
      );
    }
  };

  const getSelectionInfo = (category, key) => {
    const optionsMap = {
      sleepQuality: sleepQualityOptions,
      sleepDuration: sleepDurationOptions,
      stressLevel: stressLevelOptions,
      timeAvailable: timeAvailableOptions,
      workoutDays: workoutDaysOptions
    };
    
    return optionsMap[category]?.find(option => option.key === key);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Lifestyle Assessment</Text>
          <Text style={styles.headerSubtitle}>Tell us about your daily routine</Text>
          <Text style={styles.stepIndicator}>Step 5 of 5 - Final Step!</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          {/* Sleep Quality */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sleep Quality</Text>
            <Text style={styles.sectionSubtitle}>How well do you typically sleep?</Text>
            
            <View style={styles.optionsContainer}>
              {sleepQualityOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionCard,
                    formData.sleepQuality === option.key && styles.optionCardSelected
                  ]}
                  onPress={() => handleSingleSelection('sleepQuality', option.key)}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionContent}>
                    <Text style={[
                      styles.optionLabel,
                      formData.sleepQuality === option.key && styles.optionLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.optionDescription,
                      formData.sleepQuality === option.key && styles.optionDescriptionSelected
                    ]}>
                      {option.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Duration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sleep Duration</Text>
            <Text style={styles.sectionSubtitle}>How many hours do you sleep per night?</Text>
            
            <View style={styles.compactOptions}>
              {sleepDurationOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.compactOption,
                    formData.sleepDuration === option.key && styles.compactOptionSelected
                  ]}
                  onPress={() => handleSingleSelection('sleepDuration', option.key)}
                >
                  <Text style={styles.compactIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.compactLabel,
                    formData.sleepDuration === option.key && styles.compactLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stress Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stress Level</Text>
            <Text style={styles.sectionSubtitle}>What's your typical stress level?</Text>
            
            <View style={styles.stressOptions}>
              {stressLevelOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.stressCard,
                    formData.stressLevel === option.key && styles.stressCardSelected,
                    { borderLeftColor: option.color }
                  ]}
                  onPress={() => handleSingleSelection('stressLevel', option.key)}
                >
                  <Text style={styles.stressIcon}>{option.icon}</Text>
                  <View style={styles.stressContent}>
                    <Text style={[
                      styles.stressLabel,
                      formData.stressLevel === option.key && styles.stressLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.stressDescription,
                      formData.stressLevel === option.key && styles.stressDescriptionSelected
                    ]}>
                      {option.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Available */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Time Available</Text>
            <Text style={styles.sectionSubtitle}>How much time can you dedicate per workout?</Text>
            
            <View style={styles.timeOptions}>
              {timeAvailableOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.timeCard,
                    formData.timeAvailable === option.key && styles.timeCardSelected
                  ]}
                  onPress={() => handleSingleSelection('timeAvailable', option.key)}
                >
                  <Text style={styles.timeIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.timeLabel,
                    formData.timeAvailable === option.key && styles.timeLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.timeDescription,
                    formData.timeAvailable === option.key && styles.timeDescriptionSelected
                  ]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Workout Frequency */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Frequency</Text>
            <Text style={styles.sectionSubtitle}>How often do you want to work out?</Text>
            
            <View style={styles.frequencyOptions}>
              {workoutDaysOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.frequencyCard,
                    formData.workoutDays === option.key && styles.frequencyCardSelected
                  ]}
                  onPress={() => handleSingleSelection('workoutDays', option.key)}
                >
                  <Text style={styles.frequencyIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.frequencyLabel,
                    formData.workoutDays === option.key && styles.frequencyLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.frequencyDescription,
                    formData.workoutDays === option.key && styles.frequencyDescriptionSelected
                  ]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recovery Habits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recovery Habits</Text>
            <Text style={styles.sectionSubtitle}>
              What recovery activities do you currently do? ({formData.recoveryHabits.length} selected)
            </Text>
            
            <View style={styles.habitsGrid}>
              {recoveryHabitsOptions.map((habit) => (
                <TouchableOpacity
                  key={habit.key}
                  style={[
                    styles.habitChip,
                    formData.recoveryHabits.includes(habit.key) && styles.habitChipSelected
                  ]}
                  onPress={() => handleRecoveryHabitToggle(habit.key)}
                >
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                  <Text style={[
                    styles.habitLabel,
                    formData.recoveryHabits.includes(habit.key) && styles.habitLabelSelected
                  ]}>
                    {habit.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lifestyle Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>🎯 Your Lifestyle Summary</Text>
            <View style={styles.summaryContent}>
              {formData.sleepQuality && (
                <Text style={styles.summaryText}>
                  😴 Sleep: {getSelectionInfo('sleepQuality', formData.sleepQuality)?.label} quality
                </Text>
              )}
              {formData.sleepDuration && (
                <Text style={styles.summaryText}>
                  ⏰ Duration: {getSelectionInfo('sleepDuration', formData.sleepDuration)?.label}
                </Text>
              )}
              {formData.stressLevel && (
                <Text style={styles.summaryText}>
                  😌 Stress: {getSelectionInfo('stressLevel', formData.stressLevel)?.label}
                </Text>
              )}
              {formData.timeAvailable && (
                <Text style={styles.summaryText}>
                  ⚡ Workout Time: {getSelectionInfo('timeAvailable', formData.timeAvailable)?.label}
                </Text>
              )}
              {formData.workoutDays && (
                <Text style={styles.summaryText}>
                  📅 Frequency: {getSelectionInfo('workoutDays', formData.workoutDays)?.label}
                </Text>
              )}
              {formData.recoveryHabits.length > 0 && (
                <Text style={styles.summaryText}>
                  🔄 Recovery: {formData.recoveryHabits.length} habit(s)
                </Text>
              )}
            </View>
          </View>

          {/* Complete Onboarding Button */}
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteOnboarding}
          >
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>🎉 Complete Setup & Start!</Text>
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
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  optionCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#6366f1',
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  optionDescriptionSelected: {
    color: '#6366f1',
  },
  compactOptions: {
    gap: 8,
  },
  compactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  compactOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  compactIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  compactLabel: {
    fontSize: 16,
    color: '#1e293b',
  },
  compactLabelSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  stressOptions: {
    gap: 8,
  },
  stressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
  },
  stressCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  stressIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  stressContent: {
    flex: 1,
  },
  stressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  stressLabelSelected: {
    color: '#6366f1',
  },
  stressDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  stressDescriptionSelected: {
    color: '#6366f1',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minHeight: 100,
  },
  timeCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  timeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  timeLabelSelected: {
    color: '#6366f1',
  },
  timeDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  timeDescriptionSelected: {
    color: '#6366f1',
  },
  frequencyOptions: {
    gap: 8,
  },
  frequencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  frequencyCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  frequencyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 8,
  },
  frequencyLabelSelected: {
    color: '#6366f1',
  },
  frequencyDescription: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  frequencyDescriptionSelected: {
    color: '#6366f1',
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  habitChipSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#faf5ff',
  },
  habitIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  habitLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  habitLabelSelected: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  summarySection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#bfdbfe',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryContent: {
    gap: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#1e40af',
  },
  completeButton: {
    marginBottom: 32,
  },
  completeButtonGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});