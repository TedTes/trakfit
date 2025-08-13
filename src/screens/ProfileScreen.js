import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkoutStore } from '../store/workoutStore';

export default function ProfileScreen() {
  const { getProgressSummary } = useWorkoutStore();
  const progressSummary = getProgressSummary();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
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
                  🤖 AI Generated: {progressSummary.aiWorkouts}
                </Text>
                <Text style={styles.typeStatText}>
                  📝 Manual: {progressSummary.staticWorkouts}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Recent Workouts */}
        {progressSummary.recentWorkouts && progressSummary?.recentWorkouts.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>📋 Recent Workouts</Text>
            {progressSummary.recentWorkouts.map((workout, index) => (
              <View key={workout.id} style={styles.recentWorkoutItem}>
                <Text style={styles.recentWorkoutTitle}>{workout.workoutTitle}</Text>
                <Text style={styles.recentWorkoutDetails}>
                  {new Date(workout.date).toLocaleDateString()} • 
                  {Math.round(workout.duration / (1000 * 60))}min • 
                  {workout.exerciseCount} exercises
                </Text>
                <Text style={styles.recentWorkoutSource}>
                  {workout.workoutSource === 'ai_generated' ? '🤖 AI Generated' : '📝 Manual'}
                </Text>
              </View>
            ))}
          </View>
        )}
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
    marginBottom: 40,
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
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
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
  recentSection: {
    marginTop: 16,
  },
  recentWorkoutItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentWorkoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  recentWorkoutDetails: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  recentWorkoutSource: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 8,
  },
});
