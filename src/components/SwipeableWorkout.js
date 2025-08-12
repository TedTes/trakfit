import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SwipeableWorkout({ workout, onWorkoutComplete, onExit }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [workoutStartTime] = useState(new Date());

  const currentExercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;

  const completeCurrentExercise = () => {
    const completedExercise = {
      ...currentExercise,
      completedAt: new Date(),
      duration: Math.floor((new Date() - workoutStartTime) / 1000)
    };

    setCompletedExercises(prev => [...prev, completedExercise]);
    
    if (isLastExercise) {
      // Workout complete
      const workoutStats = {
        totalTime: Math.floor((new Date() - workoutStartTime) / 1000),
        exercisesCompleted: workout.exercises.length,
        averageTimePerExercise: Math.floor((new Date() - workoutStartTime) / 1000 / workout.exercises.length)
      };
      onWorkoutComplete(workoutStats);
    } else {
      // Next exercise
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const handleSkipExercise = () => {
    Alert.alert(
      'Skip Exercise',
      'Are you sure you want to skip this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: completeCurrentExercise }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentExerciseIndex + 1} / {workout.exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSkipExercise} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise Card */}
      <View style={styles.cardContainer}>
        <View style={styles.exerciseCard}>
          {/* Exercise Animation Area */}
          <View style={styles.animationContainer}>
            <ExerciseAnimation exercise={currentExercise} />
          </View>

          {/* Exercise Info */}
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.targetMuscle}>{currentExercise.target}</Text>
            
            <View style={styles.exerciseStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentExercise.sets}</Text>
                <Text style={styles.statLabel}>Sets</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentExercise.reps}</Text>
                <Text style={styles.statLabel}>Reps</Text>
              </View>
              {currentExercise.weight && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{currentExercise.weight}</Text>
                  <Text style={styles.statLabel}>Weight</Text>
                </View>
              )}
            </View>

            {/* Form Tips */}
            <View style={styles.formTips}>
              <Text style={styles.formTitle}>💡 Form Tips:</Text>
              <Text style={styles.formText}>
                {getFormTips(currentExercise.name)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.previousButton]}
          onPress={goToPreviousExercise}
          disabled={currentExerciseIndex === 0}
        >
          <Text style={styles.buttonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.completeButton]}
          onPress={completeCurrentExercise}
        >
          <Text style={styles.buttonText}>
            {isLastExercise ? 'Finish Workout 🏁' : 'Complete Exercise →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Simple Exercise Animation Component
function ExerciseAnimation({ exercise }) {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 3);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const getAnimationContent = () => {
    const animations = getExerciseAnimation(exercise.name, animationFrame);
    return animations[animationFrame] || animations[0];
  };

  return (
    <View style={styles.animationArea}>
      <Text style={styles.animationText}>{getAnimationContent()}</Text>
      <Text style={styles.animationDescription}>
        {getAnimationDescription(exercise.name, animationFrame)}
      </Text>
    </View>
  );
}

// Exercise animation data
function getExerciseAnimation(exerciseName, frame) {
  const animations = {
    "Push-ups": ["🧍‍♂️", "🤸‍♂️", "🧍‍♂️"],
    "Incline Push-ups": ["🧍‍♂️", "🤸‍♂️", "🧍‍♂️"],
    "Dumbbell Rows": ["🏋️‍♂️", "💪", "🏋️‍♂️"],
    "Squats": ["🧍‍♂️", "🤸‍♀️", "🧍‍♂️"],
    "Plank Hold": ["🤸‍♂️", "🤸‍♂️", "🤸‍♂️"],
    "Shoulder Press": ["💪", "🙌", "💪"],
    "Single-Arm Dumbbell Curls (Left Focus)": ["💪", "🔥", "💪"]
  };
  
  return animations[exerciseName] || ["🏋️‍♂️", "💪", "🏋️‍♂️"];
}

function getAnimationDescription(exerciseName, frame) {
  const descriptions = {
    "Push-ups": ["Starting position", "Lower down slowly", "Push back up"],
    "Incline Push-ups": ["Hands elevated", "Lower to surface", "Push up strong"],
    "Dumbbell Rows": ["Hold weights down", "Pull to chest", "Lower controlled"],
    "Squats": ["Stand tall", "Sit back and down", "Drive through heels"],
    "Plank Hold": ["Hold steady", "Keep core tight", "Breathe normally"],
    "Shoulder Press": ["Weights at shoulders", "Press straight up", "Lower controlled"],
    "Single-Arm Dumbbell Curls (Left Focus)": ["Left arm extended", "Curl weight up", "Lower slowly"]
  };
  
  const desc = descriptions[exerciseName] || ["Prepare", "Execute", "Return"];
  return desc[frame] || desc[0];
}

function getFormTips(exerciseName) {
  const tips = {
    "Push-ups": "Keep your body in a straight line. Lower chest to floor, push up explosively.",
    "Incline Push-ups": "Use a bench or step. Same form as push-ups but easier angle.",
    "Dumbbell Rows": "Squeeze shoulder blades together. Pull elbow back, not out to the side.",
    "Squats": "Keep chest up, knees over toes. Sit back like sitting in a chair.",
    "Plank Hold": "Keep hips level with shoulders. Engage core, breathe normally.",
    "Shoulder Press": "Press straight up, not forward. Keep core tight throughout.",
    "Single-Arm Dumbbell Curls (Left Focus)": "Focus on your left arm. Slow controlled movement, squeeze at the top."
  };
  
  return tips[exerciseName] || "Focus on controlled movement and proper breathing.";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  skipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    minHeight: screenHeight * 0.65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 24,
  },
  animationArea: {
    alignItems: 'center',
  },
  animationText: {
    fontSize: 80,
    marginBottom: 16,
  },
  animationDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
    textAlign: 'center',
  },
  exerciseInfo: {
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  targetMuscle: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 20,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    minWidth: 70,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  formTips: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginTop: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  formText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previousButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  completeButton: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});