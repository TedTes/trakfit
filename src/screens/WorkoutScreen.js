import React, { useState, useEffect } from 'react';
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
import { useWorkoutStore } from '../store/workoutStore';
import { useUserProfileStore } from '../store/userProfileStore';

export default function WorkoutScreen() {
  const { 
    currentWorkout, 
    lastAnalysis,
    startWorkout,
    completeSet,
    nextExercise,
    completeWorkout,
    isWorkoutActive,
    currentExerciseIndex,
    completedSets,
    generateAIWorkout,
    swapExercise,
    getAlternativeExercises
  } = useWorkoutStore();

  const profile = useUserProfileStore(state => state.profile);
  const [currentSetCount, setCurrentSetCount] = useState({});
  const [showAlternatives, setShowAlternatives] = useState(null);

  useEffect(() => {
    // Initialize workout if empty
    if (!currentWorkout.exercises || currentWorkout.exercises.length === 0) {
      generateAIWorkout();
    }
  }, []);

  const handleStartWorkout = () => {
    if (!isWorkoutActive) {
      startWorkout();
      Alert.alert(
        '🚀 Workout Started!',
        'Your AI-generated workout is now active. Track your sets as you go!',
        [{ text: 'Let\'s Go!' }]
      );
    }
  };

  const handleCompleteSet = (exerciseId, exercise) => {
    const setNumber = (currentSetCount[exerciseId] || 0) + 1;
    
    // Simple set completion - in a real app you'd want reps/weight input
    completeSet(exerciseId, setNumber, exercise.reps, exercise.weight);
    
    setCurrentSetCount(prev => ({
      ...prev,
      [exerciseId]: setNumber
    }));

    // Check if exercise is complete
    if (setNumber >= exercise.sets) {
      Alert.alert(
        '✅ Exercise Complete!',
        `Great job on ${exercise.name}!`,
        [
          { text: 'Next Exercise', onPress: () => nextExercise() },
          { text: 'Keep Going', style: 'cancel' }
        ]
      );
    }
  };

  const handleCompleteWorkout = () => {
    Alert.alert(
      '🎉 Complete Workout?',
      'Are you finished with your workout session?',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            const stats = completeWorkout();
            Alert.alert(
              '🏆 Workout Complete!',
              `Great session! You completed ${stats.exerciseCount} exercises in ${Math.round(stats.duration / 60000)} minutes.`,
              [{ text: 'Awesome!' }]
            );
          }
        }
      ]
    );
  };

  const handleSwapExercise = async (exercise) => {
    const alternatives = getAlternativeExercises(exercise.target, exercise.name);
    
    if (alternatives.length === 0) {
      Alert.alert('No Alternatives', 'No alternative exercises found for this muscle group.');
      return;
    }

    setShowAlternatives({ exercise, alternatives });
  };

  const handleSelectAlternative = (originalExercise, newExercise) => {
    swapExercise(originalExercise.id, newExercise);
    setShowAlternatives(null);
    Alert.alert(
      '🔄 Exercise Swapped!',
      `Replaced "${originalExercise.name}" with "${newExercise.name}"`
    );
  };

  const handleGenerateNewWorkout = () => {
    Alert.alert(
      '🤖 Generate New Workout?',
      'This will create a fresh AI workout based on your current profile and goals.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate',
          onPress: () => {
            const newWorkout = generateAIWorkout();
            Alert.alert(
              '✨ New Workout Generated!',
              `"${newWorkout.title}" is ready with ${newWorkout.exercises.length} exercises.`
            );
          }
        }
      ]
    );
  };

  const getExerciseProgress = (exercise) => {
    const completedSetsCount = currentSetCount[exercise.id] || 0;
    return `${completedSetsCount}/${exercise.sets}`;
  };

  const isExerciseComplete = (exercise) => {
    return (currentSetCount[exercise.id] || 0) >= exercise.sets;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Analysis Status */}
        {lastAnalysis && (
          <View style={styles.analysisStatus}>
            <Text style={styles.analysisStatusText}>
              🎯 Workout optimized for your analysis
            </Text>
            <Text style={styles.analysisDate}>
              {new Date(lastAnalysis.timestamp).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* AI Workout Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>{currentWorkout.title}</Text>
          <Text style={styles.headerSubtitle}>{currentWorkout.subtitle}</Text>
          <Text style={styles.aiLabel}>🤖 AI-Generated</Text>
          {lastAnalysis && (
            <Text style={styles.analysisNote}>
              📸 Based on your photo analysis
            </Text>
          )}
        </LinearGradient>

        {/* Workout Controls */}
        <View style={styles.controlsSection}>
          {!isWorkoutActive ? (
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartWorkout}
            >
              <Text style={styles.startButtonText}>🚀 Start Workout</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <Text style={styles.activeStatus}>💪 Workout Active</Text>
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={handleCompleteWorkout}
              >
                <Text style={styles.completeButtonText}>✅ Complete Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Exercise Cards */}
        {currentWorkout.exercises.map((exercise, index) => (
          <View key={exercise.id || index} style={[
            styles.exerciseCard,
            isExerciseComplete(exercise) && styles.completedCard,
            index === currentExerciseIndex && isWorkoutActive && styles.activeCard
          ]}>
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
                <Text style={styles.detailValue}>{getExerciseProgress(exercise)}</Text>
                <Text style={styles.detailLabel}>Sets</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>{exercise.reps}</Text>
                <Text style={styles.detailLabel}>Reps</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>{exercise.weight || exercise.rest}</Text>
                <Text style={styles.detailLabel}>{exercise.weight ? 'Weight' : 'Rest'}</Text>
              </View>
            </View>

            <View style={styles.exerciseActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleSwapExercise(exercise)}
              >
                <Text style={styles.actionButtonText}>🔄 Swap</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.primaryButton,
                  isExerciseComplete(exercise) && styles.completedButton
                ]}
                onPress={() => handleCompleteSet(exercise.id, exercise)}
                disabled={!isWorkoutActive || isExerciseComplete(exercise)}
              >
                <Text style={[
                  styles.actionButtonText, 
                  styles.primaryButtonText,
                  isExerciseComplete(exercise) && styles.completedButtonText
                ]}>
                  {isExerciseComplete(exercise) ? '✅ Done' : '+ Complete Set'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* AI Workout Controls */}
        <View style={styles.aiWorkoutSection}>
          <Text style={styles.aiSectionTitle}>🤖 AI Workout Generator</Text>
          <Text style={styles.aiSectionSubtitle}>
            Personalized workouts based on your {profile.personalProfile.age}yr profile, 
            {profile.fitnessGoals.primary} goal, and available equipment
          </Text>
          
          <TouchableOpacity 
            style={styles.generateWorkoutButton}
            onPress={handleGenerateNewWorkout}
          >
            <Text style={styles.generateWorkoutText}>✨ Generate New Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Alternatives Modal Replacement */}
        {showAlternatives && (
          <View style={styles.alternativesSection}>
            <Text style={styles.alternativesTitle}>
              🔄 Alternatives for {showAlternatives.exercise.name}
            </Text>
            {showAlternatives.alternatives.map((alt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.alternativeButton}
                onPress={() => handleSelectAlternative(showAlternatives.exercise, alt)}
              >
                <Text style={styles.alternativeText}>{alt.name}</Text>
                <Text style={styles.alternativeTarget}>{alt.target}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelAlternatives}
              onPress={() => setShowAlternatives(null)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
  header: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 4,
  },
  aiLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  analysisNote: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
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
  controlsSection: {
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    padding: 16,
    borderRadius: 12,
  },
  activeStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
  },
  completeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  activeCard: {
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  completedCard: {
    backgroundColor: '#f0f9ff',
    opacity: 0.8,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  targetText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  highPriorityBadge: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  priorityIndicator: {
    marginLeft: 4,
    fontSize: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
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
    flex: 2,
  },
  primaryButtonText: {
    color: 'white',
  },
  completedButton: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  completedButtonText: {
    color: 'white',
  },
  aiWorkoutSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
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
  },
  generateWorkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  alternativesSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  alternativeButton: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  alternativeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  alternativeTarget: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 2,
  },
  cancelAlternatives: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 14,
    color: '#6b7280',
  },
});