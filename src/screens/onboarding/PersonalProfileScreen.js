import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProfileStore } from '../../store/userProfileStore';

export default function PersonalProfileScreen({ navigation }) {
  const { updatePersonalProfile, setOnboardingStep } = useUserProfileStore();
  
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    height: '',
    weight: '',
    activityLevel: ''
  });

  const activityLevels = [
    { key: 'sedentary', label: 'Sedentary (Little/no exercise)' },
    { key: 'lightly_active', label: 'Lightly Active (Light exercise 1-3 days/week)' },
    { key: 'moderately_active', label: 'Moderately Active (Moderate exercise 3-5 days/week)' },
    { key: 'very_active', label: 'Very Active (Hard exercise 6-7 days/week)' }
  ];

  const sexOptions = [
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.age || !formData.sex || !formData.height || !formData.weight || !formData.activityLevel) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue.');
      return false;
    }

    const age = parseInt(formData.age);
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);

    if (age < 16 || age > 100) {
      Alert.alert('Invalid Age', 'Please enter an age between 16 and 100.');
      return false;
    }

    if (height < 120 || height > 250) {
      Alert.alert('Invalid Height', 'Please enter a height between 120cm and 250cm.');
      return false;
    }

    if (weight < 30 || weight > 300) {
      Alert.alert('Invalid Weight', 'Please enter a weight between 30kg and 300kg.');
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Save to store
      updatePersonalProfile({
        age: parseInt(formData.age),
        sex: formData.sex,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        activityLevel: formData.activityLevel
      });

      // Move to next onboarding step
      setOnboardingStep(1);
      
      // Navigate to next screen directly
      navigation.navigate('FitnessGoals');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Personal Profile</Text>
          <Text style={styles.headerSubtitle}>Help us personalize your fitness journey</Text>
          <Text style={styles.stepIndicator}>Step 1 of 5</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          {/* Age Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your age"
              value={formData.age}
              onChangeText={(value) => handleInputChange('age', value)}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {/* Sex Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sex</Text>
            <View style={styles.optionRow}>
              {sexOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    formData.sex === option.key && styles.optionButtonSelected
                  ]}
                  onPress={() => handleInputChange('sex', option.key)}
                >
                  <Text style={[
                    styles.optionText,
                    formData.sex === option.key && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Height Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your height in cm"
              value={formData.height}
              onChangeText={(value) => handleInputChange('height', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Weight Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your weight in kg"
              value={formData.weight}
              onChangeText={(value) => handleInputChange('weight', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Activity Level Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Activity Level</Text>
            <Text style={styles.labelSubtext}>How active are you currently?</Text>
            {activityLevels.map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[
                  styles.activityOption,
                  formData.activityLevel === level.key && styles.activityOptionSelected
                ]}
                onPress={() => handleInputChange('activityLevel', level.key)}
              >
                <Text style={[
                  styles.activityText,
                  formData.activityLevel === level.key && styles.activityTextSelected
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  labelSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1e293b',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  optionText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  activityOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
    marginBottom: 8,
  },
  activityOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  activityText: {
    fontSize: 16,
    color: '#64748b',
  },
  activityTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  continueButton: {
    marginTop: 32,
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