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


import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useWorkoutStore } from '../store/workoutStore';

export default function AnalyzeScreen() {
  const { generateNewWorkout, replaceCurrentWorkout, updateUserPreferences,userPreferences,generateMealPlan } = useWorkoutStore();
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'We need camera access to analyze your body posture.',
        [{ text: 'OK' }]
      );
    }
  };
  // Event Handlers
  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4], // Good for body photos
        quality: 0.8, // Balance between quality and file size
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
        await processPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const processPhoto = async (imageUri) => {
    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        timestamp: new Date().toISOString(),
        confidence: 87,
        posture: 'Good overall posture with minor corrections needed',
        imbalances: ['right stronger', 'shoulders uneven'],
        weakAreas: ['chest', 'core'],
        strengths: ['legs', 'back'],
        recommendations: [
          'Focus on left-side unilateral exercises',
          'Increase chest development priority', 
          'Add core stability work'
        ],
        muscleScores: { chest: 72, back: 86, shoulders: 78, arms: 81, core: 69, legs: 92 },
        // ADD nutrition recommendations:
        nutritionNeeds: {
          goalAdjustment: 'muscle_building', // Based on low muscle scores
          proteinIncrease: 15, // 15% more protein needed
          budgetRecommendation: 'prioritize_protein_sources'
        }
      };
      
      // Update workout preferences
      const workoutPreferences = {
        targetMuscles: mockAnalysis.weakAreas,
        equipment: ['bodyweight', 'dumbbells'],
        goal: 'hypertrophy', // Based on muscle building need
        experience: 'intermediate',
        duration: 45
      };
      
      // UPDATE nutrition preferences based on analysis
      const nutritionPreferences = {
        weeklyBudget: userPreferences.weeklyBudget,
        preferredStore: userPreferences.preferredStore,
        // ADD goal-based adjustments:
        goal: 'hypertrophy' // This will increase protein in meal planning
      };
      
      updateUserPreferences({ ...workoutPreferences, ...nutritionPreferences });
      
      // Generate both workout and meal plan
      const aiWorkout = generateNewWorkout();
      const mealPlan = generateMealPlan();
      
      setIsAnalyzing(false);
      showAnalysisResults(mockAnalysis, aiWorkout, mealPlan);
      
    } catch (error) {
      setIsAnalyzing(false);
      console.log(error);
      Alert.alert('Analysis Error', 'Failed to analyze photo. Please try again.');
    }
  };
  const showAnalysisResults = (analysis, generatedWorkout, mealPlan) => {
    const { confidence, recommendations, muscleScores, nutritionNeeds } = analysis;
    
    const resultMessage = `
  🎯 Analysis Complete (${confidence}% confidence)
  
  💪 Workout Plan:
  "${generatedWorkout.title}" - ${generatedWorkout.exercises.length} exercises
  
  🍽️ Nutrition Plan:
  Weekly meals: $${mealPlan.totalCost}/${mealPlan.budget}
  ${nutritionNeeds.proteinIncrease}% more protein recommended
  
  📊 Key Focus Areas:
  • ${recommendations.slice(0, 2).join('\n• ')}
  `;
  
    Alert.alert(
      'Complete Analysis', 
      resultMessage, 
      [
        { text: 'Keep Current Plans', style: 'cancel' },
        { 
          text: 'Use Both Plans', 
          onPress: () => {
            replaceCurrentWorkout(generatedWorkout);
            Alert.alert('✅ Success!', 'Both workout and nutrition plans updated based on your analysis!');
          }
        }
      ]
    );
  };


  const handleSkipPhoto = () => {
    Alert.alert('Skip Photo', 'You can always take a photo later to get more personalized workouts!');
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Body Analysis</Text>
      <Text style={styles.subtitle}>
        {capturedImage ? 'Photo captured! Processing...' : 'Take a photo to get personalized workouts'}
      </Text>
      
      {/* Show captured image or camera button */}
      {capturedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          {isAnalyzing && (
            <View style={styles.analysisOverlay}>
              <Text style={styles.analysisText}>🧠 Analyzing...</Text>
            </View>
          )}
        </View>
      ) : (
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
      )}
      
      <Text style={styles.helpText}>
        {capturedImage 
          ? 'AI is analyzing your posture and muscle balance...' 
          : 'Stand naturally with good lighting for best results'
        }
      </Text>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        {capturedImage ? (
          <TouchableOpacity 
            style={styles.retakeButton}
            onPress={() => setCapturedImage(null)}
          >
            <Text style={styles.retakeButtonText}>Take Another Photo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkipPhoto}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
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
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  capturedImage: {
    width: 200,
    height: 260,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  analysisOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  actionButtons: {
    marginTop: 10,
  },
  retakeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});