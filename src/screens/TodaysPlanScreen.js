import { AICoachEngine } from '../engine/AICoachEngine';
import RecoveryTracker from '../components/RecoveryTracker';
import MindsetTracker from '../components/MindsetTracker';

export const TodaysPlanScreen = () => {
  const userProfile = useUserProfileStore(state => state.profile);
  const aiEngine = new AICoachEngine(userProfile);
  const todaysPlan = aiEngine.generateTodaysPlan();

  return (
    <ScrollView style={styles.container}>
      <DailyHeader />
      
      {/* Training Pillar */}
      <WorkoutPillar plan={todaysPlan.workout} />
      
      {/* Nutrition Pillar */}
      <NutritionPillar plan={todaysPlan.nutrition} />
      
      {/* Recovery Pillar */}
      <RecoveryTracker />
      
      {/* Mindset Pillar */}
      <MindsetTracker />
    </ScrollView>
  );
};