import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AnalyzeScreen() {
  
  // Event Handlers
  const handleTakePhoto = () => {
    Alert.alert(
      'Take Photo', 
      'Camera functionality will be implemented in the next step!\n\nFor now, this will simulate photo analysis.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Simulate', onPress: () => simulateAnalysis() }
      ]
    );
  };

  const simulateAnalysis = () => {
    Alert.alert('Analysis Complete', 'Photo analyzed!\n\n• Right arm slightly stronger\n• Chest needs more development\n• Overall: Good posture\n\nUpdating your workout plan...');
  };

  const handleSkipPhoto = () => {
    Alert.alert('Skip Photo', 'You can always take a photo later to get more personalized workouts!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Body Analysis</Text>
        <Text style={styles.subtitle}>Take a photo to get personalized workouts</Text>
        
        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={handleTakePhoto}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.cameraPlaceholder}
          >
            <Text style={styles.cameraIcon}>📸</Text>
            <Text style={styles.cameraText}>Tap to capture photo</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.helpText}>
          Stand naturally with good lighting for best results
        </Text>

        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkipPhoto}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
    textAlign: 'center',
  },
  cameraButton: {
    marginBottom: 20,
  },
  cameraPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cameraText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 250,
    marginBottom: 30,
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  skipButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
});