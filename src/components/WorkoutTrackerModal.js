import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';

export default function WorkoutTrackerModal({
  visible,
  exercise,
  onClose,
  onSetComplete,
  onExerciseComplete
}) {
  const [currentSet, setCurrentSet] = useState(1);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState(exercise?.weight || '');
  const [completedSets, setCompletedSets] = useState([]);

  useEffect(() => {
    if (exercise) {
      setWeight(exercise.weight || '');
      setCurrentSet(1);
      setCompletedSets([]);
      setReps('');
    }
  }, [exercise]);

  const handleCompleteSet = () => {
    if (!reps) {
      Alert.alert('Missing Info', 'Please enter reps completed');
      return;
    }

    const setData = {
      setNumber: currentSet,
      reps: parseInt(reps),
      weight: weight || null
    };

    setCompletedSets([...completedSets, setData]);
    onSetComplete(exercise.id, currentSet, parseInt(reps), weight);

    if (currentSet >= exercise.sets) {
      // Exercise complete
      Alert.alert(
        'Exercise Complete!',
        `Great job on ${exercise.name}!\n\nCompleted ${exercise.sets} sets`,
        [{ text: 'Next Exercise', onPress: onExerciseComplete }]
      );
    } else {
      // Next set
      setCurrentSet(currentSet + 1);
      setReps('');
    }
  };

  if (!exercise) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.targetMuscle}>{exercise.target}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.setProgress}>
            <Text style={styles.setTitle}>
              Set {currentSet} of {exercise.sets}
            </Text>
            <Text style={styles.targetReps}>
              Target: {exercise.reps} reps
            </Text>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reps Completed</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
                placeholder="8"
              />
            </View>

            {exercise.weight && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight Used</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="25lbs"
                />
              </View>
            )}
          </View>

          <View style={styles.completedSets}>
            <Text style={styles.completedTitle}>Completed Sets:</Text>
            {completedSets.map((set, index) => (
              <View key={index} style={styles.completedSet}>
                <Text style={styles.completedSetText}>
                  Set {set.setNumber}: {set.reps} reps
                  {set.weight && ` @ ${set.weight}`}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>End Exercise</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={handleCompleteSet}
          >
            <Text style={styles.completeText}>
              {currentSet >= exercise.sets ? 'Complete Exercise' : 'Complete Set'}
            </Text>
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
    padding: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  targetMuscle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  setProgress: {
    alignItems: 'center',
    marginBottom: 30,
  },
  setTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  targetReps: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  completedSets: {
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  completedSet: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  completedSetText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#6b7280',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flex: 2,
    padding: 16,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    alignItems: 'center',
  },
  completeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});