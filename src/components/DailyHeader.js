import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DailyHeader() {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  
  // Simple motivational messages based on day
  const getMotivationalMessage = () => {
    const messages = [
      "Let's make today amazing! 💪",
      "Your best self is waiting! 🌟", 
      "Small steps, big results! 🚀",
      "Today is your chance to grow! 🌱",
      "You've got this! 💯",
      "Progress over perfection! ⭐",
      "Make it count! 🔥"
    ];
    return messages[today.getDay()];
  };

  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <Text style={styles.greeting}>Good morning! 👋</Text>
        <Text style={styles.date}>{dayName}, {monthDay}</Text>
        <Text style={styles.motivation}>{getMotivationalMessage()}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    borderRadius: 16,
    margin: 20,
    marginBottom: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 8,
  },
  motivation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});