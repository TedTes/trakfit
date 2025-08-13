import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WorkoutStatsModal({
  visible,
  workoutStats,
  onClose,
  onNewWorkout
}) {
  if (!workoutStats) return null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#22c55e', '#16a34a']}
          style={styles.header}
        >
          <Text style={styles.celebrationIcon}>🎉</Text>
          <Text style={styles.headerTitle}>Workout Complete!</Text>
          <Text style={styles.headerSubtitle}>Great job crushing your session</Text>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatTime(workoutStats.totalTime)}</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{workoutStats.exercisesCompleted}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatTime(workoutStats.averageTimePerExercise)}</Text>
            <Text style={styles.statLabel}>Avg per Exercise</Text>
          </View>
        </View>

        <View style={styles.achievements}>
  <Text style={styles.achievementTitle}>🏆 Achievements</Text>
  <Text style={styles.achievementText}>• Completed AI-optimized workout</Text>
  <Text style={styles.achievementText}>• Following personalized nutrition plan</Text>
  <Text style={styles.achievementText}>• Building data for better recommendations</Text>
  {/* TODO:  if it was an AI workout: */}
  <Text style={styles.achievementText}>• 🤖 AI workout completed successfully</Text>
</View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.newWorkoutButton} onPress={onNewWorkout}>
            <Text style={styles.newWorkoutText}>Start New Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 40,
    alignItems: 'center',
  },
  celebrationIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 100,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  achievements: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  achievementText: {
    fontSize: 14,
    color: '#22c55e',
    marginBottom: 8,
    fontWeight: '500',
  },
  actionButtons: {
    padding: 20,
    gap: 12,
  },
  newWorkoutButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newWorkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});