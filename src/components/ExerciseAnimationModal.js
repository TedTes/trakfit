import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

export default function ExerciseAnimationModal({ visible, exercise, onClose }) {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 3);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!exercise) return null;

  const animations = getExerciseAnimation(exercise.name);
  const descriptions = getAnimationDescriptions(exercise.name);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{exercise.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.animationContainer}>
          <View style={styles.animationArea}>
            <Text style={styles.animationIcon}>{animations[animationFrame]}</Text>
            <Text style={styles.animationDescription}>
              {descriptions[animationFrame]}
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, !isPlaying && styles.playButton]}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Text style={styles.controlText}>{isPlaying ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Exercise Instructions</Text>
          
          <View style={styles.targetMuscles}>
            <Text style={styles.targetTitle}>Target: {exercise.target}</Text>
            <Text style={styles.setsReps}>{exercise.sets} sets × {exercise.reps} reps</Text>
          </View>

          <View style={styles.stepsList}>
            {getExerciseSteps(exercise.name).map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.formTips}>
            <Text style={styles.formTipsTitle}>💡 Form Tips</Text>
            {getFormTips(exercise.name).map((tip, index) => (
              <Text key={index} style={styles.formTip}>• {tip}</Text>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// Animation data for different exercises
function getExerciseAnimation(exerciseName) {
  const animations = {
    'Push-ups': ['🧍‍♂️', '🤸‍♂️', '🧍‍♂️'],
    'Incline Push-ups': ['🧍‍♂️', '📐', '🧍‍♂️'],
    'Bodyweight Squats': ['🧍‍♂️', '🪑', '🧍‍♂️'],
    'Plank Hold': ['🤸‍♂️', '🤸‍♂️', '🤸‍♂️'],
    'Dumbbell Rows': ['🏋️‍♂️', '💪', '🏋️‍♂️'],
    'Shoulder Press': ['💪', '🙌', '💪'],
  };
  return animations[exerciseName] || ['🏋️‍♂️', '💪', '🏋️‍♂️'];
}

function getAnimationDescriptions(exerciseName) {
  const descriptions = {
    'Push-ups': ['Starting position', 'Lower to floor', 'Push back up'],
    'Incline Push-ups': ['Hands elevated', 'Lower down', 'Push up'],
    'Bodyweight Squats': ['Stand tall', 'Squat down', 'Stand back up'],
    'Plank Hold': ['Hold steady', 'Keep core tight', 'Maintain position'],
    'Dumbbell Rows': ['Arms extended', 'Pull to chest', 'Lower slowly'],
    'Shoulder Press': ['Weights at shoulders', 'Press overhead', 'Lower down'],
  };
  return descriptions[exerciseName] || ['Prepare', 'Execute', 'Return'];
}

function getExerciseSteps(exerciseName) {
  const steps = {
    'Push-ups': [
      'Start in plank position with hands under shoulders',
      'Lower your body until chest nearly touches floor',
      'Push back up to starting position',
      'Keep body in straight line throughout'
    ],
    'Bodyweight Squats': [
      'Stand with feet shoulder-width apart',
      'Sit back and down as if sitting in a chair',
      'Lower until thighs are parallel to floor',
      'Drive through heels to return to start'
    ],
    'Plank Hold': [
      'Start in push-up position',
      'Keep body in straight line from head to heels',
      'Engage core muscles',
      'Hold position while breathing normally'
    ]
  };
  return steps[exerciseName] || [
    'Set up in proper starting position',
    'Execute the movement with control',
    'Return to starting position',
    'Repeat for prescribed reps'
  ];
}

function getFormTips(exerciseName) {
  const tips = {
    'Push-ups': [
      'Keep core engaged throughout',
      'Don\'t let hips sag or pike up',
      'Control the descent'
    ],
    'Bodyweight Squats': [
      'Keep chest up and proud',
      'Don\'t let knees cave inward',
      'Full range of motion'
    ],
    'Plank Hold': [
      'Don\'t hold your breath',
      'Keep hips level',
      'Engage glutes and core'
    ]
  };
  return tips[exerciseName] || [
    'Focus on proper form over speed',
    'Breathe consistently',
    'Stop if form breaks down'
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#64748b',
  },
  animationContainer: {
    backgroundColor: '#1e293b',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  animationArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  animationIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  animationDescription: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: '#22c55e',
  },
  controlText: {
    fontSize: 20,
  },
  instructionsContainer: {
    flex: 1,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  targetMuscles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  setsReps: {
    fontSize: 14,
    color: '#64748b',
  },
  stepsList: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  formTips: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
  },
  formTipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  formTip: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 4,
    lineHeight: 18,
  },
});