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
import { useWorkoutStore } from '../store/workoutStore';
import ExerciseSwapModal from '../components/ExerciseSwapModal';
import WorkoutTrackerModal from '../components/WorkoutTrackerModal';
import { useState } from 'react';
import SwipeableWorkout from '../components/SwipeableWorkout';
import WorkoutStatsModal from '../components/WorkoutStatsModal';
import PreferencesScreen from '../screens/PreferencesScreen';
import ExerciseAnimationModal from '../components/ExerciseAnimationModal';

export default function WorkoutScreen() {
  const { 
    currentWorkout, 
    lastAnalysis, 
    getAlternativeExercises, 
    swapExercise,
    startWorkout,
    completeSet,
    nextExercise,
    completeWorkout,
    userPreferences,
    generator,
    replaceCurrentWorkout ,
    generateNewWorkout,
    formatWorkoutForDisplay,
    getProgressSummary
  } = useWorkoutStore();

  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [trackerModalVisible, setTrackerModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAnimationModal, setShowAnimationModal] = useState(false);
  const [animationExercise, setAnimationExercise] = useState(null);
  // Event Handlers
  const handleSwapExercise = (exerciseName) => {
    const exercise = currentWorkout.exercises.find(ex => ex.name === exerciseName);
    const alts = getAlternativeExercises(exercise.target, exerciseName);
    
    setSelectedExercise(exercise);
    setAlternatives(alts);
    setSwapModalVisible(true);
  };

  const handleStartSwipeWorkout = () => {
    setIsSwipeMode(true);
  };

  const handleGenerateNewWorkout = () => {
  const newWorkout = generateNewWorkout();
  
  Alert.alert(
    '🤖 AI Workout Generated!',
    `"${newWorkout.title}"\n${newWorkout.exercises.length} exercises • ${Math.round(newWorkout.estimated_total_time)} minutes\n\nThis workout is customized for your preferences and equipment.`,
    [
      { text: 'Keep Current Workout', style: 'cancel' },
      { 
        text: 'Use New Workout', 
        onPress: () => {
          replaceCurrentWorkout(newWorkout);
          Alert.alert('✅ Workout Updated!', 'Your new AI-generated workout is ready.');
        }
      }
    ]
  );
};
  const handleWorkoutComplete = (stats) => {
    setWorkoutStats(stats);
    setShowStatsModal(true);
    setIsSwipeMode(false);
  };

  const handleExitSwipeMode = () => {
    setIsSwipeMode(false);
  };
  const handleSwapConfirm = (newExercise) => {
    swapExercise(selectedExercise.id, newExercise, selectedExercise.target);
    setSwapModalVisible(false);
    Alert.alert('Exercise Swapped!', `Replaced "${selectedExercise.name}" with "${newExercise.name}"`);
  };

  const handleStartExercise = (exerciseName) => {
    const exercise = currentWorkout.exercises.find(ex => ex.name === exerciseName);
    setSelectedExercise(exercise);
    setTrackerModalVisible(true);
  };
  const handleExerciseComplete = () => {
    setTrackerModalVisible(false);
    nextExercise();
    Alert.alert('Great job!', 'Move on to your next exercise when ready.');
  };
  const handleSetComplete = (exerciseId, setNumber, reps, weight) => {
    completeSet(exerciseId, setNumber, reps, weight);
  };
  const handleShowDemo = (exerciseName) => {
    const exercise = currentWorkout.exercises.find(ex => ex.name === exerciseName);
    setAnimationExercise(exercise);
    setShowAnimationModal(true);
  };

  

  return (
    <SafeAreaView style={styles.container}>

    { isSwipeMode ? (
        <SwipeableWorkout
          workout={currentWorkout}
          onWorkoutComplete={handleWorkoutComplete}
          onExit={handleExitSwipeMode}
        />
      ) :(
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
              style={styles.actionButton}
              onPress={() => handleSwapExercise(exercise.name)}
            >
              <Text style={styles.actionButtonText}>Swap</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShowDemo(exercise.name)}
            >
              <Text style={styles.actionButtonText}>Demo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleStartExercise(exercise.name)}
            >
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
                Start
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
 <View style={styles.aiWorkoutSection}>
  <Text style={styles.aiSectionTitle}>🤖 AI Workout Generator</Text>
  <Text style={styles.aiSectionSubtitle}>
    Get a personalized workout based on your preferences and equipment
  </Text>
  
  <TouchableOpacity 
    style={styles.generateWorkoutButton}
    onPress={handleGenerateNewWorkout}
  >
    <Text style={styles.generateWorkoutText}>Generate New Workout</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={styles.preferencesButton}
    onPress={() => setShowPreferences(true)}
  >
    <Text style={styles.preferencesText}>⚙️ Workout Preferences</Text>
  </TouchableOpacity>
</View>
    <TouchableOpacity 
            style={styles.swipeWorkoutButton}
            onPress={handleStartSwipeWorkout}
          >
            <Text style={styles.swipeWorkoutText}>🔥 Start Swipe Workout</Text>
          </TouchableOpacity>
          </ScrollView>)}
    <ExerciseSwapModal
        visible={swapModalVisible}
        onClose={() => setSwapModalVisible(false)}
        exerciseToSwap={selectedExercise}
        alternatives={alternatives}
        onSwapConfirm={handleSwapConfirm}
      />

      <WorkoutTrackerModal
        visible={trackerModalVisible}
        exercise={selectedExercise}
        onClose={() => setTrackerModalVisible(false)}
        onSetComplete={handleSetComplete}
        onExerciseComplete={handleExerciseComplete}
      />
        <WorkoutStatsModal
        visible={showStatsModal}
        workoutStats={workoutStats}
        onClose={() => setShowStatsModal(false)}
        onNewWorkout={() => {
          setShowStatsModal(false);
          setIsSwipeMode(true);
        }}
      />
      {showPreferences && (
  <View style={StyleSheet.absoluteFill}>
    <PreferencesScreen onClose={() => setShowPreferences(false)} />
  </View>
)}
<ExerciseAnimationModal
  visible={showAnimationModal}
  exercise={animationExercise}
  onClose={() => setShowAnimationModal(false)}
/>
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
