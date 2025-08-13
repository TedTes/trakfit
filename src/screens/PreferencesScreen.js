import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useWorkoutStore } from '../store/workoutStore';

export default function PreferencesScreen({ onClose }) {
  const { userPreferences, updateUserPreferences,generateNewWorkout } = useWorkoutStore();
  const [localPrefs, setLocalPrefs] = useState(userPreferences);

  const handleSave = () => {
    updateUserPreferences(localPrefs);
    onClose();
  };

  const updatePref = (key, value) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Workout Preferences</Text>
        
        {/* Goal Selection */}
        <Text style={styles.sectionTitle}>Goal</Text>
        <View style={styles.optionRow}>
          {['strength', 'hypertrophy', 'endurance'].map(goal => (
            <TouchableOpacity 
              key={goal}
              style={[styles.option, localPrefs.goal === goal && styles.selectedOption]}
              onPress={() => updatePref('goal', goal)}
            >
              <Text style={[styles.optionText, localPrefs.goal === goal && styles.selectedText]}>
                {goal.charAt(0).toUpperCase() + goal.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Experience Level */}
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.optionRow}>
          {['beginner', 'intermediate', 'advanced'].map(exp => (
            <TouchableOpacity 
              key={exp}
              style={[styles.option, localPrefs.experience === exp && styles.selectedOption]}
              onPress={() => updatePref('experience', exp)}
            >
              <Text style={[styles.optionText, localPrefs.experience === exp && styles.selectedText]}>
                {exp.charAt(0).toUpperCase() + exp.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.sectionTitle}>Duration (minutes)</Text>
        <View style={styles.optionRow}>
          {[20, 30, 45, 60].map(duration => (
            <TouchableOpacity 
              key={duration}
              style={[styles.option, localPrefs.duration === duration && styles.selectedOption]}
              onPress={() => updatePref('duration', duration)}
            >
              <Text style={[styles.optionText, localPrefs.duration === duration && styles.selectedText]}>
                {duration}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Available Equipment</Text>
<View style={styles.equipmentGrid}>
  {[
    { key: 'bodyweight', label: 'Bodyweight', icon: '🤸‍♂️' },
    { key: 'dumbbells', label: 'Dumbbells', icon: '🏋️‍♂️' },
    { key: 'resistance_bands', label: 'Bands', icon: '🎯' },
    { key: 'pull_up_bar', label: 'Pull-up Bar', icon: '🏗️' },
    { key: 'gym', label: 'Full Gym', icon: '🏢' }
  ].map(equipment => (
    <TouchableOpacity 
      key={equipment.key}
      style={[
        styles.equipmentOption, 
        localPrefs.equipment.includes(equipment.key) && styles.selectedEquipment
      ]}
      onPress={() => {
        const currentEquipment = localPrefs.equipment;
        const isSelected = currentEquipment.includes(equipment.key);
        
        if (isSelected) {
          // Remove equipment (but keep at least one)
          if (currentEquipment.length > 1) {
            updatePref('equipment', currentEquipment.filter(eq => eq !== equipment.key));
          }
        } else {
          // Add equipment
          updatePref('equipment', [...currentEquipment, equipment.key]);
        }
      }}
    >
      <Text style={styles.equipmentIcon}>{equipment.icon}</Text>
      <Text style={[
        styles.equipmentText, 
        localPrefs.equipment.includes(equipment.key) && styles.selectedEquipmentText
      ]}>
        {equipment.label}
      </Text>
    </TouchableOpacity>
  ))}
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 20 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { padding: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, backgroundColor: 'white' },
  selectedOption: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  optionText: { fontSize: 14, color: '#374151' },
  selectedText: { color: 'white' },
  footer: { flexDirection: 'row', padding: 20, gap: 12 },
  cancelButton: { flex: 1, padding: 16, backgroundColor: '#6b7280', borderRadius: 8, alignItems: 'center' },
  saveButton: { flex: 1, padding: 16, backgroundColor: '#22c55e', borderRadius: 8, alignItems: 'center' },
  cancelText: { color: 'white', fontSize: 16, fontWeight: '600' },
  saveText: { color: 'white', fontSize: 16, fontWeight: '600' },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  equipmentOption: {
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    minWidth: 80,
  },
  selectedEquipment: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  equipmentIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  equipmentText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  selectedEquipmentText: {
    color: 'white',
  }
});