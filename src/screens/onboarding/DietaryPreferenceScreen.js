import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProfileStore } from '../../store/userProfileStore';

export default function DietaryPreferencesScreen({ navigation }) {
  const { updateDietaryPreferences, setOnboardingStep } = useUserProfileStore();
  
  const [formData, setFormData] = useState({
    dietType: '',
    allergies: [],
    cuisinePreferences: [],
    customAllergies: '',
    customCuisines: '',
    calorieTarget: '',
    proteinTarget: '',
    hasTargets: false
  });

  const dietTypes = [
    { key: 'omnivore', label: 'Omnivore', icon: '🍽️', description: 'Eat everything' },
    { key: 'vegetarian', label: 'Vegetarian', icon: '🥗', description: 'No meat, fish allowed' },
    { key: 'vegan', label: 'Vegan', icon: '🌱', description: 'Plant-based only' },
    { key: 'pescatarian', label: 'Pescatarian', icon: '🐟', description: 'Fish but no meat' },
    { key: 'keto', label: 'Keto', icon: '🥑', description: 'Low carb, high fat' },
    { key: 'paleo', label: 'Paleo', icon: '🥩', description: 'Whole foods only' }
  ];

  const commonAllergies = [
    { key: 'nuts', label: 'Tree Nuts', icon: '🥜' },
    { key: 'peanuts', label: 'Peanuts', icon: '🥜' },
    { key: 'dairy', label: 'Dairy', icon: '🥛' },
    { key: 'eggs', label: 'Eggs', icon: '🥚' },
    { key: 'soy', label: 'Soy', icon: '🫘' },
    { key: 'gluten', label: 'Gluten', icon: '🌾' },
    { key: 'shellfish', label: 'Shellfish', icon: '🦐' },
    { key: 'fish', label: 'Fish', icon: '🐟' }
  ];

  const cuisineOptions = [
    { key: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { key: 'asian', label: 'Asian', icon: '🍜' },
    { key: 'mexican', label: 'Mexican', icon: '🌮' },
    { key: 'italian', label: 'Italian', icon: '🍝' },
    { key: 'american', label: 'American', icon: '🍔' },
    { key: 'indian', label: 'Indian', icon: '🍛' },
    { key: 'middle_eastern', label: 'Middle Eastern', icon: '🥙' },
    { key: 'african', label: 'African', icon: '🍲' }
  ];

  const handleDietTypeSelection = (dietKey) => {
    setFormData(prev => ({
      ...prev,
      dietType: dietKey
    }));
  };

  const handleAllergyToggle = (allergyKey) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergyKey)
        ? prev.allergies.filter(a => a !== allergyKey)
        : [...prev.allergies, allergyKey]
    }));
  };

  const handleCuisineToggle = (cuisineKey) => {
    setFormData(prev => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.includes(cuisineKey)
        ? prev.cuisinePreferences.filter(c => c !== cuisineKey)
        : [...prev.cuisinePreferences, cuisineKey]
    }));
  };

  const handleTargetsToggle = () => {
    setFormData(prev => ({
      ...prev,
      hasTargets: !prev.hasTargets,
      calorieTarget: !prev.hasTargets ? prev.calorieTarget : '',
      proteinTarget: !prev.hasTargets ? prev.proteinTarget : ''
    }));
  };

  const validateForm = () => {
    if (!formData.dietType) {
      Alert.alert('Missing Selection', 'Please select your diet type.');
      return false;
    }

    // Validate macro targets if provided
    if (formData.hasTargets) {
      if (formData.calorieTarget && (isNaN(formData.calorieTarget) || formData.calorieTarget < 1000 || formData.calorieTarget > 5000)) {
        Alert.alert('Invalid Calories', 'Please enter a calorie target between 1000-5000.');
        return false;
      }
      
      if (formData.proteinTarget && (isNaN(formData.proteinTarget) || formData.proteinTarget < 20 || formData.proteinTarget > 300)) {
        Alert.alert('Invalid Protein', 'Please enter a protein target between 20-300g.');
        return false;
      }
    }

    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Prepare dietary data
      const allergiesList = [...formData.allergies];
      if (formData.customAllergies.trim()) {
        allergiesList.push(...formData.customAllergies.split(',').map(a => a.trim()).filter(a => a));
      }

      const cuisinesList = [...formData.cuisinePreferences];
      if (formData.customCuisines.trim()) {
        cuisinesList.push(...formData.customCuisines.split(',').map(c => c.trim()).filter(c => c));
      }

      const dietaryData = {
        dietType: formData.dietType,
        allergies: allergiesList,
        cuisinePreferences: cuisinesList,
        calorieTarget: formData.hasTargets && formData.calorieTarget ? parseInt(formData.calorieTarget) : null,
        proteinTarget: formData.hasTargets && formData.proteinTarget ? parseInt(formData.proteinTarget) : null,
        hasSpecificTargets: formData.hasTargets
      };

      // Save to store
      updateDietaryPreferences(dietaryData);

      // Move to next onboarding step
      setOnboardingStep(4);
      
      Alert.alert(
        'Dietary Preferences Saved!',
        'Your dietary preferences have been saved. Ready for the final step?',
        [{ text: 'Continue', onPress: () => console.log('Navigate to lifestyle assessment screen') }]
      );
    }
  };

  const getDietTypeInfo = (dietKey) => {
    return dietTypes.find(diet => diet.key === dietKey);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Dietary Preferences</Text>
          <Text style={styles.headerSubtitle}>Help us plan your nutrition</Text>
          <Text style={styles.stepIndicator}>Step 4 of 5</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          {/* Diet Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diet Type</Text>
            <Text style={styles.sectionSubtitle}>What describes your eating style?</Text>
            
            <View style={styles.dietGrid}>
              {dietTypes.map((diet) => (
                <TouchableOpacity
                  key={diet.key}
                  style={[
                    styles.dietCard,
                    formData.dietType === diet.key && styles.dietCardSelected
                  ]}
                  onPress={() => handleDietTypeSelection(diet.key)}
                >
                  <Text style={styles.dietIcon}>{diet.icon}</Text>
                  <Text style={[
                    styles.dietLabel,
                    formData.dietType === diet.key && styles.dietLabelSelected
                  ]}>
                    {diet.label}
                  </Text>
                  <Text style={[
                    styles.dietDescription,
                    formData.dietType === diet.key && styles.dietDescriptionSelected
                  ]}>
                    {diet.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Allergies & Restrictions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies & Restrictions</Text>
            <Text style={styles.sectionSubtitle}>Select any foods to avoid ({formData.allergies.length} selected)</Text>
            
            <View style={styles.allergiesGrid}>
              {commonAllergies.map((allergy) => (
                <TouchableOpacity
                  key={allergy.key}
                  style={[
                    styles.allergyChip,
                    formData.allergies.includes(allergy.key) && styles.allergyChipSelected
                  ]}
                  onPress={() => handleAllergyToggle(allergy.key)}
                >
                  <Text style={styles.allergyIcon}>{allergy.icon}</Text>
                  <Text style={[
                    styles.allergyLabel,
                    formData.allergies.includes(allergy.key) && styles.allergyLabelSelected
                  ]}>
                    {allergy.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Allergies */}
            <View style={styles.customInput}>
              <Text style={styles.customInputLabel}>Other allergies (comma separated)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., strawberries, sesame"
                value={formData.customAllergies}
                onChangeText={(text) => setFormData(prev => ({ ...prev, customAllergies: text }))}
                multiline
              />
            </View>
          </View>

          {/* Cuisine Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuisine Preferences</Text>
            <Text style={styles.sectionSubtitle}>What cuisines do you enjoy? ({formData.cuisinePreferences.length} selected)</Text>
            
            <View style={styles.cuisinesGrid}>
              {cuisineOptions.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine.key}
                  style={[
                    styles.cuisineChip,
                    formData.cuisinePreferences.includes(cuisine.key) && styles.cuisineChipSelected
                  ]}
                  onPress={() => handleCuisineToggle(cuisine.key)}
                >
                  <Text style={styles.cuisineIcon}>{cuisine.icon}</Text>
                  <Text style={[
                    styles.cuisineLabel,
                    formData.cuisinePreferences.includes(cuisine.key) && styles.cuisineLabelSelected
                  ]}>
                    {cuisine.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Cuisines */}
            <View style={styles.customInput}>
              <Text style={styles.customInputLabel}>Other cuisines (comma separated)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Thai, Brazilian"
                value={formData.customCuisines}
                onChangeText={(text) => setFormData(prev => ({ ...prev, customCuisines: text }))}
                multiline
              />
            </View>
          </View>

          {/* Macro Targets (Optional) */}
          <View style={styles.section}>
            <View style={styles.targetsHeader}>
              <Text style={styles.sectionTitle}>Macro Targets (Optional)</Text>
              <TouchableOpacity
                style={[styles.toggle, formData.hasTargets && styles.toggleActive]}
                onPress={handleTargetsToggle}
              >
                <Text style={[styles.toggleText, formData.hasTargets && styles.toggleTextActive]}>
                  {formData.hasTargets ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Set specific calorie and protein targets (AI will calculate if left blank)
            </Text>
            
            {formData.hasTargets && (
              <View style={styles.targetsContainer}>
                <View style={styles.targetInput}>
                  <Text style={styles.targetLabel}>Daily Calories</Text>
                  <TextInput
                    style={styles.targetTextInput}
                    placeholder="e.g., 2000"
                    value={formData.calorieTarget}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, calorieTarget: text }))}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.targetInput}>
                  <Text style={styles.targetLabel}>Protein (grams)</Text>
                  <TextInput
                    style={styles.targetTextInput}
                    placeholder="e.g., 120"
                    value={formData.proteinTarget}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, proteinTarget: text }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Preferences Summary */}
          {formData.dietType && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Dietary Summary</Text>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryText}>
                  🍽️ Diet: {getDietTypeInfo(formData.dietType)?.label}
                </Text>
                {formData.allergies.length > 0 && (
                  <Text style={styles.summaryText}>
                    ⚠️ Avoiding: {formData.allergies.length} allergen(s)
                  </Text>
                )}
                {formData.cuisinePreferences.length > 0 && (
                  <Text style={styles.summaryText}>
                    🌍 Likes: {formData.cuisinePreferences.length} cuisine(s)
                  </Text>
                )}
                {formData.hasTargets && (
                  <Text style={styles.summaryText}>
                    🎯 Custom macro targets set
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
  dietGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dietCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minHeight: 120,
  },
  dietCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  dietIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  dietLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  dietLabelSelected: {
    color: '#6366f1',
  },
  dietDescription: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  dietDescriptionSelected: {
    color: '#6366f1',
  },
  allergiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  allergyChipSelected: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  allergyIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  allergyLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  allergyLabelSelected: {
    color: '#ef4444',
    fontWeight: '600',
  },
  cuisinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cuisineChipSelected: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  cuisineIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  cuisineLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  cuisineLabelSelected: {
    color: '#22c55e',
    fontWeight: '600',
  },
  customInput: {
    marginTop: 16,
  },
  customInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    color: '#1e293b',
    minHeight: 40,
  },
  targetsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggle: {
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toggleActive: {
    backgroundColor: '#6366f1',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  toggleTextActive: {
    color: 'white',
  },
  targetsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  targetInput: {
    flex: 1,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  targetTextInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    textAlign: 'center',
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