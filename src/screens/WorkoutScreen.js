import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkoutStore } from '../store/workoutStore';

export default function WorkoutScreen() {
  const { 
    currentWorkout, 
    lastAnalysis

  } = useWorkoutStore();

  const handleStartExercise = (exerciseName) => {
    const exercise = currentWorkout.exercises.find(ex => ex.name === exerciseName);
  };


  return (
    <SafeAreaView style={styles.container}>

    <ScrollView style={styles.content}>
      {lastAnalysis && (
  <View style={styles.analysisStatus}>
    <Text style={styles.analysisStatusText}>
      🎯 Workout & Diet optimized for your photo analysis
    </Text>
    <Text style={styles.analysisDate}>
      {new Date(lastAnalysis.timestamp).toLocaleDateString()}
    </Text>
  </View>
)}
      {/* Dynamic Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{currentWorkout.title}</Text>
        <Text style={styles.headerSubtitle}>{currentWorkout.subtitle}</Text>
        {lastAnalysis && (
          <Text style={styles.analysisNote}>
            📸 Based on your photo analysis
          </Text>
        )}
      </LinearGradient>

      {/* Dynamic Exercise Cards */}
      {currentWorkout.exercises.map((exercise, index) => (
        <View key={exercise.id || index} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={[
              styles.targetBadge, 
              { backgroundColor: exercise.color },
              exercise.priority === 'HIGH' && styles.highPriorityBadge
            ]}>
              <Text style={styles.targetText}>{exercise.target}</Text>
              {exercise.priority === 'HIGH' && (
                <Text style={styles.priorityIndicator}>🔥</Text>
              )}
            </View>
          </View>
          
          <View style={styles.exerciseDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{exercise.sets}</Text>
              <Text style={styles.detailLabel}>Sets</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{exercise.reps}</Text>
              <Text style={styles.detailLabel}>
                {exercise.weight ? 'Reps' : 'Duration'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>
                {exercise.weight || exercise.rest}
              </Text>
              <Text style={styles.detailLabel}>
                {exercise.weight ? 'Weight' : 'Rest'}
              </Text>
            </View>
          </View>

          <View style={styles.exerciseActions}>
          <TouchableOpacity 
  style={[styles.actionButton, styles.primaryButton]}
  onPress={() => handleStartExercise(exercise.name)}
>
  <Text>Log Set</Text>
</TouchableOpacity>
          </View>
        </View>
      ))}
 <View style={styles.aiWorkoutSection}>
  <Text style={styles.aiSectionTitle}>🤖 AI Workout Generator</Text>
  <Text style={styles.aiSectionSubtitle}>
    Get a personalized workout based on your preferences and equipment
  </Text>
  
  {/* <TouchableOpacity 
    style={styles.generateWorkoutButton}
    onPress={handleGenerateNewWorkout}
  >
    <Text style={styles.generateWorkoutText}>Generate New Workout</Text>
  </TouchableOpacity> */}
  

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
  header: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  targetBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  targetText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  primaryButtonText: {
    color: 'white',
  },
  analysisNote: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  highPriorityBadge: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  priorityIndicator: {
    marginLeft: 4,
    fontSize: 10,
  },
  swipeWorkoutButton: {
    backgroundColor: '#ef4444',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  swipeWorkoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiWorkoutSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  aiSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  aiSectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  generateWorkoutButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  generateWorkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  preferencesButton: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  preferencesText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
  analysisStatus: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  analysisStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  analysisDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
