import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WorkoutPillar({ plan }) {
  const navigation = useNavigation();
  
  // Handle case where AI plan might not be loaded yet
  if (!plan || !plan.exercises) {
    return (
      <View style={styles.pillarCard}>
        <Text style={styles.pillarTitle}>💪 Today's Workout</Text>
        <Text style={styles.loadingText}>Generating your personalized workout...</Text>
      </View>
    );
  }

  const handleStartWorkout = () => {
    navigation.navigate('Execute');
  };

  return (
    <View style={styles.pillarCard}>
      <View style={styles.pillarHeader}>
        <Text style={styles.pillarTitle}>💪 Today's Workout</Text>
        <Text style={styles.workoutSubtitle}>{plan.title}</Text>
      </View>

      <View style={styles.workoutSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{plan.exercises?.length || 0}</Text>
          <Text style={styles.summaryLabel}>Exercises</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{Math.round(plan.estimated_total_time || 30)}</Text>
          <Text style={styles.summaryLabel}>Minutes</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{plan.goal || 'General'}</Text>
          <Text style={styles.summaryLabel}>Focus</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exercisePreview}>
        {plan.exercises?.slice(0, 3).map((exercise, index) => (
          <View key={exercise.id || index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.prescribed_sets || exercise.sets} × {exercise.prescribed_reps || exercise.reps}
            </Text>
            <View style={[styles.targetBadge, { backgroundColor: exercise.color || '#6366f1' }]}>
              <Text style={styles.targetText}>{exercise.target || exercise.muscles?.primary[0]?.toUpperCase()}</Text>
            </View>
          </View>
        ))}
        {plan.exercises?.length > 3 && (
          <View style={styles.moreExercises}>
            <Text style={styles.moreText}>+{plan.exercises.length - 3} more</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
        <Text style={styles.startButtonText}>Start Workout 🚀</Text>
      </TouchableOpacity>

      {plan.coaching_notes && (
        <View style={styles.coachingNote}>
          <Text style={styles.coachingText}>💡 {plan.coaching_notes[0]}</Text>
        </View>
      )}
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
  pillarHeader: {
    marginBottom: 16,
  },
  pillarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  workoutSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  exercisePreview: {
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 6,
  },
  exerciseDetails: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 8,
  },
  targetBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  targetText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  moreExercises: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
  },
  moreText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  coachingNote: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
  },
  coachingText: {
    fontSize: 12,
    color: '#92400e',
    fontStyle: 'italic',
  },
});