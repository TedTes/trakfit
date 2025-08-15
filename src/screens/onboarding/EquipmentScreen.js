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

export default function EquipmentScreen({ navigation }) {
  const { updateEquipmentAvailability, setOnboardingStep } = useUserProfileStore();
  
  const [selectedOptions, setSelectedOptions] = useState({
    homeGym: false,
    commercialGym: false,
    noEquipment: false
  });

  const [homeGymEquipment, setHomeGymEquipment] = useState({
    dumbbells: false,
    barbells: false,
    resistanceBands: false,
    pullupBar: false,
    bench: false,
    kettlebells: false,
    cables: false,
    cardioMachine: false
  });

  const equipmentOptions = [
    {
      key: 'homeGym',
      title: 'Home Gym',
      icon: '🏠',
      description: 'I have equipment at home',
      color: '#22c55e'
    },
    {
      key: 'commercialGym',
      title: 'Commercial Gym',
      icon: '🏋️',
      description: 'I have gym membership access',
      color: '#3b82f6'
    },
    {
      key: 'noEquipment',
      title: 'No Equipment',
      icon: '🤸',
      description: 'Bodyweight exercises only',
      color: '#f59e0b'
    }
  ];

  const homeEquipmentItems = [
    { key: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
    { key: 'barbells', label: 'Barbells', icon: '⚖️' },
    { key: 'resistanceBands', label: 'Resistance Bands', icon: '🎗️' },
    { key: 'pullupBar', label: 'Pull-up Bar', icon: '🏗️' },
    { key: 'bench', label: 'Bench', icon: '🪑' },
    { key: 'kettlebells', label: 'Kettlebells', icon: '⚫' },
    { key: 'cables', label: 'Cable System', icon: '🔗' },
    { key: 'cardioMachine', label: 'Cardio Machine', icon: '🏃' }
  ];

  const handleMainOptionToggle = (optionKey) => {
    setSelectedOptions(prev => {
      const newState = { ...prev };
      
      if (optionKey === 'noEquipment') {
        // If selecting no equipment, deselect others
        if (!prev.noEquipment) {
          newState.homeGym = false;
          newState.commercialGym = false;
          newState.noEquipment = true;
          // Clear home gym equipment
          setHomeGymEquipment({
            dumbbells: false,
            barbells: false,
            resistanceBands: false,
            pullupBar: false,
            bench: false,
            kettlebells: false,
            cables: false,
            cardioMachine: false
          });
        } else {
          newState.noEquipment = false;
        }
      } else {
        // If selecting home or commercial gym, deselect no equipment
        newState.noEquipment = false;
        newState[optionKey] = !prev[optionKey];
      }
      
      return newState;
    });
  };

  const handleHomeEquipmentToggle = (equipmentKey) => {
    setHomeGymEquipment(prev => ({
      ...prev,
      [equipmentKey]: !prev[equipmentKey]
    }));
  };

  const validateForm = () => {
    const hasSelectedOption = selectedOptions.homeGym || selectedOptions.commercialGym || selectedOptions.noEquipment;
    
    if (!hasSelectedOption) {
      Alert.alert('Missing Selection', 'Please select at least one equipment option.');
      return false;
    }

    // If home gym is selected, they should select at least one piece of equipment
    if (selectedOptions.homeGym) {
      const hasHomeEquipment = Object.values(homeGymEquipment).some(selected => selected);
      if (!hasHomeEquipment) {
        Alert.alert('Home Gym Equipment', 'Please select at least one piece of home equipment.');
        return false;
      }
    }

    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Prepare equipment data for store
      const equipmentData = {
        homeGym: selectedOptions.homeGym,
        commercialGym: selectedOptions.commercialGym,
        noEquipment: selectedOptions.noEquipment,
        homeEquipment: selectedOptions.homeGym ? homeGymEquipment : {}
      };

      // Save to store
      updateEquipmentAvailability(equipmentData);

      // Move to next onboarding step
      setOnboardingStep(3);
      
      // Navigate to next screen directly
      navigation.navigate('DietaryPreferences');
    }
  };

  const getSelectedCount = () => {
    return Object.values(selectedOptions).filter(Boolean).length;
  };

  const getHomeEquipmentCount = () => {
    return Object.values(homeGymEquipment).filter(Boolean).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Equipment Access</Text>
          <Text style={styles.headerSubtitle}>What equipment do you have available?</Text>
          <Text style={styles.stepIndicator}>Step 3 of 5</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          {/* Main Equipment Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment Availability</Text>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            
            <View style={styles.optionsContainer}>
              {equipmentOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.equipmentCard,
                    selectedOptions[option.key] && styles.equipmentCardSelected,
                    { borderLeftColor: option.color }
                  ]}
                  onPress={() => handleMainOptionToggle(option.key)}
                >
                  <View style={styles.equipmentCardContent}>
                    <View style={styles.equipmentHeader}>
                      <Text style={styles.equipmentIcon}>{option.icon}</Text>
                      <View style={styles.equipmentInfo}>
                        <Text style={[
                          styles.equipmentTitle,
                          selectedOptions[option.key] && styles.equipmentTitleSelected
                        ]}>
                          {option.title}
                        </Text>
                        <Text style={[
                          styles.equipmentDescription,
                          selectedOptions[option.key] && styles.equipmentDescriptionSelected
                        ]}>
                          {option.description}
                        </Text>
                      </View>
                      <View style={[
                        styles.checkmark,
                        selectedOptions[option.key] && styles.checkmarkSelected
                      ]}>
                        <Text style={[
                          styles.checkmarkText,
                          selectedOptions[option.key] && styles.checkmarkTextSelected
                        ]}>
                          {selectedOptions[option.key] ? '✓' : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Home Gym Equipment Details */}
          {selectedOptions.homeGym && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Home Equipment Details</Text>
              <Text style={styles.sectionSubtitle}>
                Select what you have at home ({getHomeEquipmentCount()} selected)
              </Text>
              
              <View style={styles.homeEquipmentGrid}>
                {homeEquipmentItems.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.homeEquipmentItem,
                      homeGymEquipment[item.key] && styles.homeEquipmentItemSelected
                    ]}
                    onPress={() => handleHomeEquipmentToggle(item.key)}
                  >
                    <Text style={styles.homeEquipmentIcon}>{item.icon}</Text>
                    <Text style={[
                      styles.homeEquipmentLabel,
                      homeGymEquipment[item.key] && styles.homeEquipmentLabelSelected
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Selection Summary */}
          {getSelectedCount() > 0 && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Equipment Summary</Text>
              <View style={styles.summaryContent}>
                {selectedOptions.commercialGym && (
                  <Text style={styles.summaryText}>🏋️ Commercial gym access</Text>
                )}
                {selectedOptions.homeGym && (
                  <Text style={styles.summaryText}>
                    🏠 Home gym ({getHomeEquipmentCount()} items)
                  </Text>
                )}
                {selectedOptions.noEquipment && (
                  <Text style={styles.summaryText}>🤸 Bodyweight exercises only</Text>
                )}
              </View>
            </View>
          )}

          {/* AI Coaching Note */}
          <View style={styles.aiNote}>
            <Text style={styles.aiNoteIcon}>🤖</Text>
            <View style={styles.aiNoteContent}>
              <Text style={styles.aiNoteTitle}>AI Coach Note</Text>
              <Text style={styles.aiNoteText}>
                Your equipment selection will be used to create personalized workout plans that match what you have available. Don't worry - great workouts are possible with any setup!
              </Text>
            </View>
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
  equipmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
  },
  equipmentCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  equipmentCardContent: {
    flex: 1,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  equipmentTitleSelected: {
    color: '#6366f1',
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  equipmentDescriptionSelected: {
    color: '#6366f1',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'transparent',
  },
  checkmarkTextSelected: {
    color: 'white',
  },
  homeEquipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  homeEquipmentItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 80,
  },
  homeEquipmentItemSelected: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  homeEquipmentIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  homeEquipmentLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  homeEquipmentLabelSelected: {
    color: '#22c55e',
    fontWeight: '600',
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
  aiNote: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  aiNoteIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  aiNoteContent: {
    flex: 1,
  },
  aiNoteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  aiNoteText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
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