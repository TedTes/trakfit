import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MindsetTracker() {
  const [motivationLevel, setMotivationLevel] = useState(null);
  const [todayHabits, setTodayHabits] = useState({
    water: false,
    morning_routine: false,
    mindfulness: false
  });

  const motivationOptions = [
    { value: 5, emoji: '🔥', label: 'Pumped' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 2, emoji: '😔', label: 'Low' },
    { value: 1, emoji: '😴', label: 'Exhausted' }
  ];

  const habits = [
    { key: 'water', emoji: '💧', label: 'Drink 8 glasses', streak: 5 },
    { key: 'morning_routine', emoji: '🌅', label: 'Morning routine', streak: 3 },
    { key: 'mindfulness', emoji: '🧘‍♀️', label: '5min mindfulness', streak: 2 }
  ];

  const achievements = [
    { emoji: '💪', text: 'Completed 5 workouts this week!' },
    { emoji: '🎯', text: '3-day workout streak!' },
    { emoji: '🌟', text: 'New personal best yesterday!' }
  ];

  const getMotivationalMessage = () => {
    if (!motivationLevel) return "How are you feeling today?";
    
    if (motivationLevel >= 4) {
      return "Amazing energy! Use this momentum to crush your goals! 🚀";
    } else if (motivationLevel === 3) {
      return "Steady as she goes! Consistency beats perfection. 💯";
    } else {
      return "That's okay! Small steps still move you forward. Be kind to yourself. 💙";
    }
  };

  const toggleHabit = (habitKey) => {
    setTodayHabits(prev => ({
      ...prev,
      [habitKey]: !prev[habitKey]
    }));
  };

  const completedHabits = Object.values(todayHabits).filter(Boolean).length;
  const totalHabits = habits.length;
  const habitProgress = (completedHabits / totalHabits) * 100;

  return (
    <View style={styles.pillarCard}>
      <Text style={styles.pillarTitle}>🧠 Mindset & Habits</Text>
      
      {/* Motivation Check */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How's your energy today?</Text>
        <View style={styles.optionRow}>
          {motivationOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.motivationOption,
                motivationLevel === option.value && styles.selectedOption
              ]}
              onPress={() => setMotivationLevel(option.value)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.optionLabel,
                motivationLevel === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* AI Motivational Message */}
      <View style={styles.messageSection}>
        <Text style={styles.motivationalMessage}>
          💬 {getMotivationalMessage()}
        </Text>
      </View>

      {/* Daily Habits */}
      <View style={styles.section}>
        <View style={styles.habitHeader}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <Text style={styles.habitProgress}>
            {completedHabits}/{totalHabits} completed
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${habitProgress}%` }]} />
        </View>

        <View style={styles.habitList}>
          {habits.map((habit) => (
            <TouchableOpacity
              key={habit.key}
              style={[
                styles.habitItem,
                todayHabits[habit.key] && styles.completedHabit
              ]}
              onPress={() => toggleHabit(habit.key)}
            >
              <View style={styles.habitLeft}>
                <View style={[
                  styles.habitCheckbox,
                  todayHabits[habit.key] && styles.checkedBox
                ]}>
                  {todayHabits[habit.key] && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                <Text style={[
                  styles.habitLabel,
                  todayHabits[habit.key] && styles.completedHabitText
                ]}>
                  {habit.label}
                </Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>{habit.streak}🔥</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Wins</Text>
        <View style={styles.achievementsList}>
          {achievements.slice(0, 2).map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
              <Text style={styles.achievementText}>{achievement.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📝 Add Reflection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🎯 Set Today's Goal</Text>
        </TouchableOpacity>
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
    gap: 8,
  },
  motivationOption: {
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    flex: 1,
  },
  selectedOption: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
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
  messageSection: {
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  motivationalMessage: {
    fontSize: 14,
    color: '#7c3aed',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitProgress: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  habitList: {
    gap: 8,
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  completedHabit: {
    backgroundColor: '#f0f9ff',
    borderColor: '#6366f1',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  habitEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  habitLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  completedHabitText: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  streakBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  achievementsList: {
    gap: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
  },
  achievementEmoji: {
    fontSize: 16,
    marginRight: 12,
  },
  achievementText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '500',
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
});