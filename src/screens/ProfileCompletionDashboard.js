import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUserProfileStore } from '../store/userProfileStore';

export default function ProfileCompletionDashboard({ onClose }) {
  const navigation = useNavigation();
  const { profile, updatePersonalProfile, updateFitnessGoals, updateEquipmentAvailability, updateDietaryPreferences, updateLifestyleAssessment } = useUserProfileStore();

  // Calculate completion status for each section
  const getProfileCompletion = () => {
    const sections = {
      personal: {
        title: "Personal Info",
        description: "Age, measurements, activity level",
        icon: "👤",
        completed: !!(profile.personalProfile?.age && profile.personalProfile?.sex && profile.personalProfile?.height && profile.personalProfile?.weight && profile.personalProfile?.activityLevel),
        weight: 20,
        aiImpact: "Enables precise calorie and intensity calculations"
      },
      goals: {
        title: "Fitness Goals", 
        description: "Primary goal, timeline",
        icon: "🎯",
        completed: !!(profile.fitnessGoals?.primary && profile.fitnessGoals?.timeline),
        weight: 25,
        aiImpact: "Personalizes exercise selection and rep ranges"
      },
      equipment: {
        title: "Equipment Setup",
        description: "Available equipment and location",
        icon: "🏋️",
        completed: !!(profile.equipmentAvailability?.homeGym || profile.equipmentAvailability?.commercialGym || profile.equipmentAvailability?.noEquipment),
        weight: 20,
        aiImpact: "Filters exercises to match your available equipment"
      },
      diet: {
        title: "Dietary Preferences",
        description: "Diet type, allergies, preferences",
        icon: "🍽️",
        completed: !!(profile.dietaryPreferences?.dietType),
        weight: 20,
        aiImpact: "Generates personalized meal plans and nutrition tracking"
      },
      lifestyle: {
        title: "Lifestyle Assessment", 
        description: "Sleep, stress, time availability",
        icon: "😴",
        completed: !!(profile.lifestyleAssessment?.sleepQuality && profile.lifestyleAssessment?.stressLevel && profile.lifestyleAssessment?.timeAvailable),
        weight: 15,
        aiImpact: "Optimizes workout intensity and recovery recommendations"
      }
    };

    let totalWeight = 0;
    let completedWeight = 0;

    Object.values(sections).forEach(section => {
      totalWeight += section.weight;
      if (section.completed) {
        completedWeight += section.weight;
      }
    });

    const percentage = Math.round((completedWeight / totalWeight) * 100);

    return { sections, percentage, completedWeight, totalWeight };
  };

  const { sections, percentage } = getProfileCompletion();

  const handleSectionPress = (sectionKey) => {
    onClose?.();
    
    switch (sectionKey) {
      case 'personal':
        navigation.navigate('PersonalProfile');
        break;
      case 'goals':
        navigation.navigate('FitnessGoals');
        break;
      case 'equipment':
        navigation.navigate('Equipment');
        break;
      case 'diet':
        navigation.navigate('DietaryPreferences');
        break;
      case 'lifestyle':
        navigation.navigate('LifestyleAssessment');
        break;
    }
  };

  const getAIPowerLevel = () => {
    if (percentage >= 90) return { level: "Maximum", color: "#22c55e", description: "🚀 Full AI coaching power!" };
    if (percentage >= 70) return { level: "Advanced", color: "#6366f1", description: "🎯 Advanced personalization active" };
    if (percentage >= 50) return { level: "Intermediate", color: "#f59e0b", description: "⚡ Good personalization level" };
    if (percentage >= 25) return { level: "Basic", color: "#ef4444", description: "🔄 Basic AI recommendations" };
    return { level: "Minimal", color: "#94a3b8", description: "📍 Complete profile for better AI" };
  };

  const aiPower = getAIPowerLevel();

  const getNextRecommendation = () => {
    const incomplete = Object.entries(sections).find(([key, section]) => !section.completed);
    return incomplete ? incomplete[1] : null;
  };

  const nextSection = getNextRecommendation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* AI Power Header */}
      <LinearGradient
        colors={[aiPower.color, aiPower.color + '90']}
        style={styles.powerHeader}
      >
        <View style={styles.powerContent}>
          <Text style={styles.powerTitle}>🤖 AI Personalization Level</Text>
          <View style={styles.powerStats}>
            <View style={styles.powerCircle}>
              <Text style={styles.powerPercentage}>{percentage}%</Text>
              <Text style={styles.powerLevel}>{aiPower.level}</Text>
            </View>
            <View style={styles.powerInfo}>
              <Text style={styles.powerDescription}>{aiPower.description}</Text>
              {percentage < 100 && (
                <Text style={styles.powerSubtext}>
                  Complete more sections to unlock advanced AI features
                </Text>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Progress Overview */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Profile Completion Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: aiPower.color }]} />
          </View>
          <Text style={styles.progressText}>{percentage}% Complete</Text>
        </View>
        
        {nextSection && (
          <View style={styles.nextRecommendation}>
            <Text style={styles.nextTitle}>🎯 Recommended Next:</Text>
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={() => handleSectionPress(Object.keys(sections).find(key => sections[key] === nextSection))}
            >
              <Text style={styles.nextIcon}>{nextSection.icon}</Text>
              <View style={styles.nextContent}>
                <Text style={styles.nextSectionTitle}>{nextSection.title}</Text>
                <Text style={styles.nextSectionImpact}>{nextSection.aiImpact}</Text>
              </View>
              <Text style={styles.nextArrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Profile Sections */}
      <View style={styles.sectionsContainer}>
        <Text style={styles.sectionsTitle}>Profile Sections</Text>
        <Text style={styles.sectionsSubtitle}>Complete any section to improve your AI experience</Text>
        
        {Object.entries(sections).map(([key, section]) => (
          <TouchableOpacity
            key={key}
            style={styles.sectionCard}
            onPress={() => handleSectionPress(key)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{section.icon}</Text>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                </View>
                <View style={styles.sectionStatus}>
                  {section.completed ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.incompleteBadge}>
                      <Text style={styles.incompleteText}>{section.weight}%</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.sectionImpact}>
                <Text style={styles.impactLabel}>AI Impact:</Text>
                <Text style={styles.impactText}>{section.aiImpact}</Text>
              </View>
              
              <View style={styles.sectionAction}>
                <Text style={styles.actionText}>
                  {section.completed ? 'Review & Update' : 'Complete Section'}
                </Text>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Capabilities Overview */}
      <View style={styles.capabilitiesCard}>
        <Text style={styles.capabilitiesTitle}>🤖 Current AI Capabilities</Text>
        <View style={styles.capabilitiesList}>
          <View style={[styles.capabilityItem, sections.personal.completed && styles.capabilityActive]}>
            <Text style={styles.capabilityIcon}>📊</Text>
            <Text style={[styles.capabilityText, sections.personal.completed && styles.capabilityTextActive]}>
              Calorie & Intensity Calculations
            </Text>
            <Text style={styles.capabilityStatus}>
              {sections.personal.completed ? '✓' : '○'}
            </Text>
          </View>
          
          <View style={[styles.capabilityItem, sections.goals.completed && styles.capabilityActive]}>
            <Text style={styles.capabilityIcon}>💪</Text>
            <Text style={[styles.capabilityText, sections.goals.completed && styles.capabilityTextActive]}>
              Goal-Specific Exercise Selection
            </Text>
            <Text style={styles.capabilityStatus}>
              {sections.goals.completed ? '✓' : '○'}
            </Text>
          </View>
          
          <View style={[styles.capabilityItem, sections.equipment.completed && styles.capabilityActive]}>
            <Text style={styles.capabilityIcon}>🏋️</Text>
            <Text style={[styles.capabilityText, sections.equipment.completed && styles.capabilityTextActive]}>
              Equipment-Based Workouts
            </Text>
            <Text style={styles.capabilityStatus}>
              {sections.equipment.completed ? '✓' : '○'}
            </Text>
          </View>
          
          <View style={[styles.capabilityItem, sections.diet.completed && styles.capabilityActive]}>
            <Text style={styles.capabilityIcon}>🍽️</Text>
            <Text style={[styles.capabilityText, sections.diet.completed && styles.capabilityTextActive]}>
              Personalized Nutrition Plans
            </Text>
            <Text style={styles.capabilityStatus}>
              {sections.diet.completed ? '✓' : '○'}
            </Text>
          </View>
          
          <View style={[styles.capabilityItem, sections.lifestyle.completed && styles.capabilityActive]}>
            <Text style={styles.capabilityIcon}>😴</Text>
            <Text style={[styles.capabilityText, sections.lifestyle.completed && styles.capabilityTextActive]}>
              Recovery & Intensity Optimization
            </Text>
            <Text style={styles.capabilityStatus}>
              {sections.lifestyle.completed ? '✓' : '○'}
            </Text>
          </View>
        </View>
      </View>

      {/* Skip Option */}
      {percentage < 100 && (
        <View style={styles.skipSection}>
          <TouchableOpacity style={styles.skipButton} onPress={onClose}>
            <Text style={styles.skipText}>Skip for now - I'll complete this later</Text>
          </TouchableOpacity>
          <Text style={styles.skipSubtext}>
            You can always return to complete your profile and unlock more AI features
          </Text>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  powerHeader: {
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
  },
  powerContent: {
    alignItems: 'center',
  },
  powerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  powerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  powerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  powerPercentage: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  powerLevel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  powerInfo: {
    flex: 1,
  },
  powerDescription: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  powerSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  nextRecommendation: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  nextTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  nextIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  nextContent: {
    flex: 1,
  },
  nextSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  nextSectionImpact: {
    fontSize: 14,
    color: '#1e40af',
  },
  nextArrow: {
    fontSize: 18,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  sectionsContainer: {
    paddingHorizontal: 20,
  },
  sectionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionsSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionContent: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  sectionStatus: {
    alignItems: 'center',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  incompleteBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  incompleteText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionImpact: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  impactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 4,
  },
  impactText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  sectionAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  actionArrow: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  capabilitiesCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  capabilitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  capabilitiesList: {
    gap: 12,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.5,
  },
  capabilityActive: {
    opacity: 1,
  },
  capabilityIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  capabilityText: {
    flex: 1,
    fontSize: 16,
    color: '#64748b',
  },
  capabilityTextActive: {
    color: '#1e293b',
    fontWeight: '600',
  },
  capabilityStatus: {
    fontSize: 18,
    color: '#22c55e',
  },
  skipSection: {
    padding: 20,
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skipText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  skipSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});