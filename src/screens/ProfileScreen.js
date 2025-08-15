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
import { useWorkoutStore } from '../store/workoutStore';
import { useUserProfileStore } from '../store/userProfileStore';

export default function ProfileScreen() {
  const { getProgressSummary } = useWorkoutStore();
  const { 
    profile, 
    getProfileCompletionStatus, 
    getAIPowerLevel,
    updatePersonalProfile,
    updateFitnessGoals,
    updateEquipmentAvailability,
    updateDietaryPreferences,
    updateLifestyleAssessment
  } = useUserProfileStore();

  const progressSummary = getProgressSummary();
  const completionStatus = getProfileCompletionStatus();
  const aiPower = getAIPowerLevel();

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({});
  const [editingData, setEditingData] = useState({});

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleSkipAll = () => {
    Alert.alert(
      "Skip Profile Setup?",
      "You can always complete your profile later to improve AI recommendations. Skip for now?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Skip All", 
          onPress: () => {
            // Mark as "skipped" - user can still access but with basic AI
            Alert.alert("✅ Setup Skipped", "You can complete your profile anytime to improve your AI coach!");
          }
        }
      ]
    );
  };

  const renderCompletionSection = (sectionKey, sectionData) => {
    const isExpanded = expandedSections[sectionKey];
    const isCompleted = sectionData.completed;

    return (
      <View key={sectionKey} style={styles.completionSection}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={[
              styles.completionDot, 
              isCompleted ? styles.completionDotComplete : styles.completionDotIncomplete
            ]}>
              <Text style={styles.completionDotText}>
                {isCompleted ? '✓' : '○'}
              </Text>
            </View>
            <View>
              <Text style={styles.sectionName}>{sectionData.name}</Text>
              <Text style={styles.sectionDescription}>{sectionData.description}</Text>
            </View>
          </View>
          <Text style={styles.expandIcon}>
            {isExpanded ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            {renderSectionForm(sectionKey)}
          </View>
        )}
      </View>
    );
  };

  const renderSectionForm = (sectionKey) => {
    switch (sectionKey) {
      case 'personalProfile':
        return (
          <View style={styles.formSection}>
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.personalProfile.age?.toString() || ''}
                  onChangeText={(value) => updatePersonalProfile({ age: parseInt(value) || 0 })}
                  placeholder="25"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.personalProfile.weight?.toString() || ''}
                  onChangeText={(value) => updatePersonalProfile({ weight: parseInt(value) || 0 })}
                  placeholder="70"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Activity Level</Text>
            <View style={styles.optionsGrid}>
              {[
                { key: 'sedentary', label: 'Sedentary' },
                { key: 'lightly_active', label: 'Light' },
                { key: 'moderately_active', label: 'Moderate' },
                { key: 'very_active', label: 'Very Active' }
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    profile.personalProfile.activityLevel === option.key && styles.optionButtonSelected
                  ]}
                  onPress={() => updatePersonalProfile({ activityLevel: option.key })}
                >
                  <Text style={[
                    styles.optionText,
                    profile.personalProfile.activityLevel === option.key && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'fitnessGoals':
        return (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Primary Goal</Text>
            <View style={styles.optionsGrid}>
              {[
                { key: 'strength', label: '💪 Strength' },
                { key: 'fat_loss', label: '🔥 Fat Loss' },
                { key: 'muscle_gain', label: '📈 Muscle Gain' },
                { key: 'endurance', label: '🏃 Endurance' }
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    profile.fitnessGoals.primary === option.key && styles.optionButtonSelected
                  ]}
                  onPress={() => updateFitnessGoals({ primary: option.key })}
                >
                  <Text style={[
                    styles.optionText,
                    profile.fitnessGoals.primary === option.key && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Timeline</Text>
            <View style={styles.optionsGrid}>
              {[
                { key: '1_month', label: '1 Month' },
                { key: '3_months', label: '3 Months' },
                { key: '6_months', label: '6 Months' },
                { key: '1_year', label: '1 Year' }
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    profile.fitnessGoals.timeline === option.key && styles.optionButtonSelected
                  ]}
                  onPress={() => updateFitnessGoals({ timeline: option.key })}
                >
                  <Text style={[
                    styles.optionText,
                    profile.fitnessGoals.timeline === option.key && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'equipmentAvailability':
        return (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Available Equipment</Text>
            <View style={styles.optionsColumn}>
              {[
                { key: 'homeGym', label: '🏠 Home Gym Equipment' },
                { key: 'commercialGym', label: '🏋️ Commercial Gym Access' },
                { key: 'noEquipment', label: '💪 Bodyweight Only' }
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    profile.equipmentAvailability[option.key] && styles.optionButtonSelected
                  ]}
                  onPress={() => updateEquipmentAvailability({ 
                    [option.key]: !profile.equipmentAvailability[option.key] 
                  })}
                >
                  <Text style={[
                    styles.optionText,
                    profile.equipmentAvailability[option.key] && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'dietaryPreferences':
        return (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Diet Type</Text>
            <View style={styles.optionsGrid}>
              {[
                { key: 'omnivore', label: '🍖 Omnivore' },
                { key: 'vegetarian', label: '🥗 Vegetarian' },
                { key: 'vegan', label: '🌱 Vegan' },
                { key: 'pescatarian', label: '🐟 Pescatarian' }
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    profile.dietaryPreferences.dietType === option.key && styles.optionButtonSelected
                  ]}
                  onPress={() => updateDietaryPreferences({ dietType: option.key })}
                >
                  <Text style={[
                    styles.optionText,
                    profile.dietaryPreferences.dietType === option.key && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'lifestyleAssessment':
        return (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Sleep Hours</Text>
            <View style={styles.optionsGrid}>
              {[
                { key: 6, label: '6 hrs' },
                { key: 7, label: '7 hrs' },
                { key: 8, label: '8 hrs' },
                { key: 9, label: '9+ hrs' }
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    profile.lifestyleAssessment.sleepPatterns.averageHours === option.key && styles.optionButtonSelected
                  ]}
                  onPress={() => updateLifestyleAssessment({ 
                    sleepPatterns: { 
                      ...profile.lifestyleAssessment.sleepPatterns,
                      averageHours: option.key 
                    }
                  })}
                >
                  <Text style={[
                    styles.optionText,
                    profile.lifestyleAssessment.sleepPatterns.averageHours === option.key && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Available Time (minutes/day)</Text>
            <View style={styles.optionsGrid}>
              {[
                { key: 15, label: '15 min' },
                { key: 30, label: '30 min' },
                { key: 45, label: '45 min' },
                { key: 60, label: '60+ min' }
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    profile.lifestyleAssessment.timeAvailable === option.key && styles.optionButtonSelected
                  ]}
                  onPress={() => updateLifestyleAssessment({ timeAvailable: option.key })}
                >
                  <Text style={[
                    styles.optionText,
                    profile.lifestyleAssessment.timeAvailable === option.key && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>👤</Text>
          </LinearGradient>
          <Text style={styles.profileName}>Fitness Enthusiast</Text>
          <Text style={styles.profileStats}>Member since January 2025</Text>
        </View>

        {/* AI Power Level */}
        <View style={styles.aiPowerSection}>
          <View style={styles.aiPowerHeader}>
            <Text style={styles.aiPowerTitle}>🤖 AI Coach Power</Text>
            <View style={styles.aiPowerBadge}>
              <Text style={styles.aiPowerPercentage}>{aiPower.level}%</Text>
            </View>
          </View>
          <Text style={styles.aiPowerDescription}>{aiPower.description}</Text>
          <Text style={styles.aiPowerNext}>{aiPower.nextUnlock}</Text>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${aiPower.level}%` }]} />
          </View>
        </View>

        {/* Profile Completion Sections */}
        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionTitle}>Profile Completion</Text>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkipAll}
            >
              <Text style={styles.skipButtonText}>Skip All</Text>
            </TouchableOpacity>
          </View>
          
          {Object.entries(completionStatus.sections).map(([key, section]) => 
            renderCompletionSection(key, section)
          )}
        </View>

        {/* Existing Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Workout Progress</Text>
          
          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progressSummary.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progressSummary.thisWeekWorkouts}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progressSummary.totalTime}m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progressSummary.averageWorkoutTime}m</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
          </View>

          {progressSummary.totalWorkouts > 0 && (
            <View style={styles.workoutTypeStats}>
              <Text style={styles.typeStatsTitle}>Workout Types</Text>
              <View style={styles.typeStatsRow}>
                <Text style={styles.typeStatText}>
                  🤖 AI Generated: {progressSummary.aiGeneratedWorkouts}
                </Text>
                <Text style={styles.typeStatText}>
                  📝 Manual: {progressSummary.manualWorkouts}
                </Text>
              </View>
            </View>
          )}
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
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileStats: {
    fontSize: 14,
    color: '#64748b',
  },
  
  // AI Power Section
  aiPowerSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aiPowerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiPowerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  aiPowerBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aiPowerPercentage: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiPowerDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  aiPowerNext: {
    fontSize: 12,
    color: '#6366f1',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },

  // Profile Completion
  completionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skipButtonText: {
    fontSize: 12,
    color: '#64748b',
  },
  completionSection: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  completionDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionDotComplete: {
    backgroundColor: '#22c55e',
  },
  completionDotIncomplete: {
    backgroundColor: '#e2e8f0',
  },
  completionDotText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  expandIcon: {
    fontSize: 16,
    color: '#64748b',
  },
  sectionContent: {
    paddingLeft: 36,
    paddingTop: 8,
  },

  // Form Styles
  formSection: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionsColumn: {
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  optionButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },

  // Existing Stats Styles
  statsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  workoutTypeStats: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
  },
  typeStatsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  typeStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeStatText: {
    fontSize: 14,
    color: '#6366f1',
  },
});