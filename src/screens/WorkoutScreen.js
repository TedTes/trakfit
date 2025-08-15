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
    startWorkout,
    completeSet,
    nextExercise,
    completeWorkout,
    isWorkoutActive,
    currentExerciseIndex,
    completedSets,
    generateAIWorkout
  } = useWorkoutStore();

  const profile = useUserProfileStore(state => state.profile);
  const [currentSetCounts, setCurrentSetCounts] = useState({});
  const [workoutStartTime, setWorkoutStartTime] = useState(null);

  useEffect(() => {
    // Initialize workout if empty or ensure we have an AI workout
    if (!currentWorkout.exercises || currentWorkout.exercises.length === 0) {
      generateAIWorkout();
    }
  }, []);

  const currentExercise = currentWorkout.exercises?.[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex >= (currentWorkout.exercises?.length - 1);
  const totalExercises = currentWorkout.exercises?.length || 0;

  const handleStartWorkout = () => {
    if (!isWorkoutActive) {
      startWorkout();
      setWorkoutStartTime(Date.now());
    }
  };

  const handleCompleteSet = (exerciseId, exercise) => {
    const currentSetForExercise = (currentSetCounts[exerciseId] || 0) + 1;
    
    // Update local set counter
    setCurrentSetCounts(prev => ({
      ...prev,
      [exerciseId]: currentSetForExercise
    }));

    // Record set completion in store
    completeSet(exerciseId, currentSetForExercise, exercise.reps, exercise.weight);

    // Check if all sets for this exercise are complete
    if (currentSetForExercise >= exercise.sets) {
      // Auto-advance to next exercise after brief pause
      setTimeout(() => {
        if (!isLastExercise) {
          nextExercise();
        } else {
          // Workout complete
          handleWorkoutComplete();
        }
      }, 1000);
    }
  };

  const handleWorkoutComplete = () => {
    const workoutTime = workoutStartTime ? Math.round((Date.now() - workoutStartTime) / 60000) : 0;
    
    Alert.alert(
      '🎉 Workout Complete!',
      `Great session! You completed ${totalExercises} exercises in ${workoutTime} minutes.`,
      [
        {
          text: 'Finish',
          onPress: () => {
            completeWorkout();
            // Reset local state
            setCurrentSetCounts({});
            setWorkoutStartTime(null);
          }
        }
      ]
    );
  };

  const handleSkipExercise = () => {
    if (!isLastExercise) {
      nextExercise();
    } else {
      handleWorkoutComplete();
    }
  };

  const getCompletedSetsForExercise = (exerciseId) => {
    return currentSetCounts[exerciseId] || 0;
  };

  const getProgressPercentage = () => {
    if (!totalExercises || !isWorkoutActive) return 0;
    
    const completedExercises = currentExerciseIndex;
    const currentExerciseProgress = currentExercise ? 
      (getCompletedSetsForExercise(currentExercise.id) / currentExercise.sets) : 0;
    
    return Math.round(((completedExercises + currentExerciseProgress) / totalExercises) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentWorkout.exercises || currentWorkout.exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingTitle}>🤖 Generating Your Workout</Text>
          <Text style={styles.loadingSubtitle}>Creating a personalized plan based on your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Workout Header */}
        <LinearGradient
          colors={isWorkoutActive ? ['#22c55e', '#16a34a'] : ['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>
            {isWorkoutActive ? '🔥 Workout Active' : currentWorkout.title}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isWorkoutActive ? 
              `Exercise ${currentExerciseIndex + 1} of ${totalExercises} • ${getProgressPercentage()}% Complete` :
              currentWorkout.subtitle
            }
          </Text>
          
          {isWorkoutActive && (
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} />
              </View>
            </View>
          )}
        </LinearGradient>

        {/* Pre-Workout State */}
        {!isWorkoutActive && (
          <View style={styles.preWorkoutSection}>
            
            {/* Workout Overview */}
            <View style={styles.overviewCard}>
              <Text style={styles.overviewTitle}>📋 Workout Overview</Text>
              <View style={styles.overviewStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{totalExercises}</Text>
                  <Text style={styles.statLabel}>Exercises</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{currentWorkout.estimated_total_time}m</Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{currentWorkout.goal}</Text>
                  <Text style={styles.statLabel}>Focus</Text>
                </View>
              </View>
            </View>

            {/* Exercise Preview */}
            <View style={styles.exerciseListCard}>
              <Text style={styles.cardTitle}>Today's Exercises</Text>
              {currentWorkout.exercises.map((exercise, index) => (
                <View key={exercise.id} style={styles.exercisePreviewItem}>
                  <View style={[styles.exerciseColorBar, { backgroundColor: exercise.color }]} />
                  <View style={styles.exercisePreviewContent}>
                    <Text style={styles.exercisePreviewName}>{exercise.name}</Text>
                    <Text style={styles.exercisePreviewDetails}>
                      {exercise.sets} sets • {exercise.reps} reps • {exercise.rest} rest
                    </Text>
                  </View>
                  <Text style={styles.exerciseTarget}>{exercise.target}</Text>
                </View>
              ))}
            </View>

            {/* Coaching Notes */}
            {currentWorkout.coaching_notes && currentWorkout.coaching_notes.length > 0 && (
              <View style={styles.coachingCard}>
                <Text style={styles.cardTitle}>🤖 AI Coach Notes</Text>
                {currentWorkout.coaching_notes.map((note, index) => (
                  <Text key={index} style={styles.coachingNote}>• {note}</Text>
                ))}
              </View>
            )}

            {/* Start Button */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartWorkout}
            >
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>🚀 Start Workout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Workout State */}
        {isWorkoutActive && currentExercise && (
          <View style={styles.activeWorkoutSection}>
            
            {/* Current Exercise Card */}
            <View style={styles.currentExerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={[styles.exerciseBadge, { backgroundColor: currentExercise.color }]}>
                  <Text style={styles.exerciseBadgeText}>{currentExercise.target}</Text>
                </View>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkipExercise}
                >
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.currentExerciseName}>{currentExercise.name}</Text>
              
              {currentExercise.instructions && (
                <Text style={styles.exerciseInstructions}>{currentExercise.instructions}</Text>
              )}

              {/* Set Progress */}
              <View style={styles.setProgressSection}>
                <Text style={styles.setProgressTitle}>
                  Set Progress: {getCompletedSetsForExercise(currentExercise.id)} / {currentExercise.sets}
                </Text>
                
                <View style={styles.setDotsContainer}>
                  {Array.from({ length: currentExercise.sets }, (_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.setDot,
                        index < getCompletedSetsForExercise(currentExercise.id) && styles.setDotCompleted
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Exercise Details */}
              <View style={styles.exerciseDetailsGrid}>
                <View style={styles.exerciseDetailItem}>
                  <Text style={styles.exerciseDetailLabel}>Target Reps</Text>
                  <Text style={styles.exerciseDetailValue}>{currentExercise.reps}</Text>
                </View>
                <View style={styles.exerciseDetailItem}>
                  <Text style={styles.exerciseDetailLabel}>Rest Time</Text>
                  <Text style={styles.exerciseDetailValue}>{currentExercise.rest}</Text>
                </View>
              </View>

              {/* Complete Set Button */}
              <TouchableOpacity
                style={styles.completeSetButton}
                onPress={() => handleCompleteSet(currentExercise.id, currentExercise)}
                disabled={getCompletedSetsForExercise(currentExercise.id) >= currentExercise.sets}
              >
                <LinearGradient
                  colors={getCompletedSetsForExercise(currentExercise.id) >= currentExercise.sets ? 
                    ['#9ca3af', '#6b7280'] : ['#3b82f6', '#1d4ed8']}
                  style={styles.completeSetButtonGradient}
                >
                  <Text style={styles.completeSetButtonText}>
                    {getCompletedSetsForExercise(currentExercise.id) >= currentExercise.sets ?
                      '✅ Exercise Complete' : 
                      `Complete Set ${getCompletedSetsForExercise(currentExercise.id) + 1}`
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Next Exercise Preview */}
            {!isLastExercise && (
              <View style={styles.nextExerciseCard}>
                <Text style={styles.nextExerciseTitle}>Next Exercise</Text>
                <View style={styles.nextExercisePreview}>
                  <View style={[styles.nextExerciseColorBar, 
                    { backgroundColor: currentWorkout.exercises[currentExerciseIndex + 1]?.color }]} />
                  <Text style={styles.nextExerciseName}>
                    {currentWorkout.exercises[currentExerciseIndex + 1]?.name}
                  </Text>
                </View>
              </View>
            )}

            {/* Finish Workout Button (when all exercises complete) */}
            {isLastExercise && getCompletedSetsForExercise(currentExercise.id) >= currentExercise.sets && (
              <TouchableOpacity
                style={styles.finishButton}
                onPress={handleWorkoutComplete}
              >
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.finishButtonGradient}
                >
                  <Text style={styles.finishButtonText}>🏁 Finish Workout</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  preWorkoutSection: {
    padding: 20,
  },
  overviewCard: {
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
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  exerciseListCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  exercisePreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  exerciseColorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  exercisePreviewContent: {
    flex: 1,
  },
  exercisePreviewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  exercisePreviewDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  exerciseTarget: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coachingCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  coachingNote: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 8,
    lineHeight: 20,
  },
  startButton: {
    marginBottom: 20,
  },
  startButtonGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeWorkoutSection: {
    padding: 20,
  },
  currentExerciseCard: {
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
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  exerciseBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  skipButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  currentExerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  exerciseInstructions: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 22,
  },
  setProgressSection: {
    marginBottom: 20,
  },
  setProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  setDotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  setDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  setDotCompleted: {
    backgroundColor: '#22c55e',
  },
  exerciseDetailsGrid: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 20,
  },
  exerciseDetailItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  exerciseDetailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  exerciseDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  completeSetButton: {
    marginBottom: 12,
  },
  completeSetButtonGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeSetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextExerciseCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  nextExerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  nextExercisePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextExerciseColorBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  nextExerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  finishButton: {
    marginTop: 20,
  },
  finishButtonGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});