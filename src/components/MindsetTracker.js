const MindsetTracker = () => {
    return (
      <View style={styles.mindsetCard}>
        <Text style={styles.pillarTitle}>🧠 Mindset</Text>
        
        {/* Daily Motivation Check */}
        <MotivationLevelInput />
        
        {/* Habit Tracking */}
        <HabitStreakDisplay />
        
        {/* Progress Celebration */}
        <ProgressHighlights />
        
        {/* Motivational Message */}
        <AIMotivationalMessage />
      </View>
    );
  };