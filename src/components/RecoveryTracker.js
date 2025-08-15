import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function RecoveryTracker() {
  const [sleepQuality, setSleepQuality] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [sleepHours, setSleepHours] = useState(null);

  const sleepQualityOptions = [
    { value: 5, emoji: '😴', label: 'Excellent' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 3, emoji: '😐', label: 'Fair' },
    { value: 2, emoji: '😴', label: 'Poor' },
    { value: 1, emoji: '😵', label: 'Terrible' }
  ];

  const stressLevelOptions = [
    { value: 1, emoji: '😌', label: 'Relaxed' },
    { value: 2, emoji: '🙂', label: 'Calm' },
    { value: 3, emoji: '😐', label: 'Moderate' },
    { value: 4, emoji: '😰', label: 'High' },
    { value: 5, emoji: '🤯', label: 'Overwhelmed' }
  ];

  const sleepHoursOptions = [
    { value: 4, label: '< 5h' },
    { value: 5, label: '5-6h' },
    { value: 6, label: '6-7h' },
    { value: 7, label: '7-8h' },
    { value: 8, label: '8-9h' },
    { value: 9, label: '9+ h' }
  ];

  const getRecoveryRecommendation = () => {
    if (!sleepQuality || !stressLevel) return null;

    if (sleepQuality <= 2 || stressLevel >= 4) {
      return {
        type: 'rest',
        message: 'Consider taking it easy today. Light stretching or yoga recommended.',
        color: '#f59e0b'
      };
    } else if (sleepQuality >= 4 && stressLevel <= 2) {
      return {
        type: 'go',
        message: 'Great recovery! You\'re ready for an intense workout.',
        color: '#22c55e'
      };
    } else {
      return {
        type: 'moderate',
        message: 'Moderate intensity recommended. Listen to your body.',
        color: '#3b82f6'
      };
    }
  };

  const recommendation = getRecoveryRecommendation();
  const recoveryScore = sleepQuality && stressLevel ? 
    Math.round(((sleepQuality + (6 - stressLevel)) / 2) * 20) : null;

  return (
    <View style={styles.pillarCard}>
      <Text style={styles.pillarTitle}>🛌 Recovery Check</Text>
      
      {/* Sleep Quality */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How did you sleep?</Text>
        <View style={styles.optionRow}>
          {sleepQualityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                sleepQuality === option.value && styles.selectedOption
              ]}
              onPress={() => setSleepQuality(option.value)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.optionLabel,
                sleepQuality === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sleep Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hours of sleep</Text>
        <View style={styles.optionRow}>
          {sleepHoursOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.hourOption,
                sleepHours === option.value && styles.selectedOption
              ]}
              onPress={() => setSleepHours(option.value)}
            >
              <Text style={[
                styles.hourText,
                sleepHours === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stress Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current stress level</Text>
        <View style={styles.optionRow}>
          {stressLevelOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                stressLevel === option.value && styles.selectedOption
              ]}
              onPress={() => setStressLevel(option.value)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.optionLabel,
                stressLevel === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recovery Score & Recommendation */}
      {recommendation && (
        <View style={styles.recommendationSection}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Recovery Score</Text>
            <Text style={[styles.scoreValue, { color: recommendation.color }]}>
              {recoveryScore}%
            </Text>
          </View>
          
          <View style={[styles.recommendation, { borderLeftColor: recommendation.color }]}>
            <Text style={[styles.recommendationText, { color: recommendation.color }]}>
              {recommendation.message}
            </Text>
          </View>
        </View>
      )}

      {/* Quick Recovery Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.actionsTitle}>Quick Recovery Boosters</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>🧘‍♀️</Text>
            <Text style={styles.actionText}>5min Meditation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>🤸‍♂️</Text>
            <Text style={styles.actionText}>Stretch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>💧</Text>
            <Text style={styles.actionText}>Hydrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pillarCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  pillarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    minWidth: 60,
    flex: 1,
  },
  selectedOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },
  hourOption: {
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    minWidth: 50,
    flex: 1,
  },
  hourText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  recommendationSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendation: {
    borderLeftWidth: 4,
    paddingLeft: 12,
  },
  recommendationText: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  actionsSection: {
    marginTop: 8,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  actionEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
});