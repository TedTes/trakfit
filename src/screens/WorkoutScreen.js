import React from 'react';
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

export default function WorkoutScreen() {
  
  // Event Handlers
  const handleSwapExercise = (exerciseName) => {
    Alert.alert('Swap Exercise', `Would you like to swap ${exerciseName}?`);
  };

  const handleShowDemo = (exerciseName) => {
    Alert.alert('Exercise Demo', `Showing ${exerciseName} demonstration`);
  };

  const handleStartExercise = (exerciseName) => {
    Alert.alert('Start Exercise', `Starting ${exerciseName} workout!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Today's Workout</Text>
          <Text style={styles.headerSubtitle}>Upper Body Focus • 45 minutes</Text>
        </LinearGradient>

        {/* Exercise Card 1 - Push-ups */}
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>Push-ups</Text>
            <View style={styles.targetBadge}>
              <Text style={styles.targetText}>CHEST</Text>
            </View>
          </View>
          
          <View style={styles.exerciseDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>3</Text>
              <Text style={styles.detailLabel}>Sets</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>8-12</Text>
              <Text style={styles.detailLabel}>Reps</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>60s</Text>
              <Text style={styles.detailLabel}>Rest</Text>
            </View>
          </View>

          <View style={styles.exerciseActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSwapExercise('Push-ups')}
            >
              <Text style={styles.actionButtonText}>Swap</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShowDemo('Push-ups')}
            >
              <Text style={styles.actionButtonText}>Demo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleStartExercise('Push-ups')}
            >
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Exercise Card 2 - Dumbbell Rows */}
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>Dumbbell Rows</Text>
            <View style={[styles.targetBadge, { backgroundColor: '#f59e0b' }]}>
              <Text style={styles.targetText}>BACK</Text>
            </View>
          </View>
          
          <View style={styles.exerciseDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>3</Text>
              <Text style={styles.detailLabel}>Sets</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>10-12</Text>
              <Text style={styles.detailLabel}>Reps</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>25lbs</Text>
              <Text style={styles.detailLabel}>Weight</Text>
            </View>
          </View>

          <View style={styles.exerciseActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSwapExercise('Dumbbell Rows')}
            >
              <Text style={styles.actionButtonText}>Swap</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShowDemo('Dumbbell Rows')}
            >
              <Text style={styles.actionButtonText}>Demo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleStartExercise('Dumbbell Rows')}
            >
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Exercise Card 3 - Shoulder Press */}
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>Shoulder Press</Text>
            <View style={[styles.targetBadge, { backgroundColor: '#8b5cf6' }]}>
              <Text style={styles.targetText}>SHOULDERS</Text>
            </View>
          </View>
          
          <View style={styles.exerciseDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>3</Text>
              <Text style={styles.detailLabel}>Sets</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>8-10</Text>
              <Text style={styles.detailLabel}>Reps</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>20lbs</Text>
              <Text style={styles.detailLabel}>Weight</Text>
            </View>
          </View>

          <View style={styles.exerciseActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSwapExercise('Shoulder Press')}
            >
              <Text style={styles.actionButtonText}>Swap</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShowDemo('Shoulder Press')}
            >
              <Text style={styles.actionButtonText}>Demo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleStartExercise('Shoulder Press')}
            >
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Start</Text>
            </TouchableOpacity>
          </View>
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
});
