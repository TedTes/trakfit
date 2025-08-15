const RecoveryTracker = () => {
    return (
      <View style={styles.recoveryCard}>
        <Text style={styles.pillarTitle}>🛌 Recovery</Text>
        
        {/* Sleep Quality */}
        <SleepQualityInput />
        
        {/* Stress Level */}
        <StressLevelInput />
        
        {/* Recovery Recommendations */}
        <RecoveryRecommendations />
      </View>
    );
  };