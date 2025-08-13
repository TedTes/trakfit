import { exerciseDatabase } from '../data/exerciseDatabase';

export class WorkoutGenerator {
    constructor(exerciseDatabase) {
      this.exercises = exerciseDatabase;
    }
  
    // Main workout generation function
    generateWorkout(userInputs) {
      const {
        targetMuscles = ['full_body'],
        equipment = ['bodyweight'],
        duration = 30, // minutes
        goal = 'hypertrophy', // strength, hypertrophy, endurance
        experience = 'beginner',
        previousWorkouts = []
      } = userInputs;
  
      // Step 1: Filter exercises by constraints
      const availableExercises = this.filterExercisesByConstraints({
        equipment,
        experience,
        targetMuscles
      });
  
      // Step 2: Select exercises using smart algorithm
      const selectedExercises = this.selectOptimalExercises({
        availableExercises,
        targetMuscles,
        duration,
        goal,
        previousWorkouts
      });
  
      // Step 3: Assign sets, reps, and rest periods
      const workoutPlan = this.assignTrainingParameters({
        exercises: selectedExercises,
        goal,
        duration
      });
  
      // Step 4: Add coaching guidance
      return this.addCoachingGuidance(workoutPlan, goal);
    }
  
    filterExercisesByConstraints({ equipment, experience, targetMuscles }) {
      return this.exercises.filter(exercise => {
        // Equipment match
        const hasEquipment = exercise.equipment.some(eq => equipment.includes(eq));
        
        // Difficulty appropriate for experience
        const difficultyMatch = this.isDifficultyAppropriate(exercise.difficulty, experience);
        
        // Muscle targeting (if specific muscles requested)
        const muscleMatch = targetMuscles.includes('full_body') || 
          this.doesExerciseTargetMuscles(exercise, targetMuscles);
  
        return hasEquipment && difficultyMatch && muscleMatch;
      });
    }
    findUncoveredMuscles(targetMuscles, coveredMuscleGroups) {
      if (targetMuscles.includes('full_body')) {
        // For full body, ensure we hit major muscle groups
        const majorMuscleGroups = [
          'chest_pectorals', 
          'legs_quadriceps', 
          'legs_glutes',
          'back_latissimus',
          'shoulders_anterior',
          'core_abs'
        ];
        
        return majorMuscleGroups.filter(muscle => !coveredMuscleGroups.has(muscle));
      }
      
      // For specific target muscles, return those not yet covered
      return targetMuscles.filter(muscle => !coveredMuscleGroups.has(muscle));
    }
    selectOptimalExercises({ availableExercises, targetMuscles, duration, goal, previousWorkouts }) {
      const maxExercises = Math.floor(duration / 8); // ~8 minutes per exercise
      const selected = [];
      const muscleGroups = new Set();
  
      // Priority 1: Compound movements
      const compounds = availableExercises.filter(ex => ex.category === 'compound');
      
      // Priority 2: Movement pattern diversity
      const movementPatterns = new Set();
      
      // Priority 3: Avoid recent exercises (if previous workouts provided)
      const recentExercises = this.getRecentExerciseIds(previousWorkouts);
  
      for (const exercise of compounds) {
        if (selected.length >= maxExercises) break;
  
        // Skip if done recently (avoid staleness)
        if (recentExercises.includes(exercise.id)) continue;
  
        // Prefer new movement patterns
        if (!movementPatterns.has(exercise.movement_pattern)) {
          selected.push(exercise);
          movementPatterns.add(exercise.movement_pattern);
          
          // Track muscle groups covered
          exercise.muscles.primary.forEach(muscle => muscleGroups.add(muscle));
        }
      }
  
      // Fill remaining slots with isolation/accessory work
      const accessories = availableExercises.filter(ex => 
        ex.category !== 'compound' && !selected.includes(ex)
      );
  
      // Add exercises to target uncovered muscle groups
      const uncoveredMuscles = this.findUncoveredMuscles(targetMuscles, muscleGroups);
      
      for (const muscle of uncoveredMuscles) {
        if (selected.length >= maxExercises) break;
        
        const targetingExercise = accessories.find(ex => 
          ex.muscles.primary.includes(muscle) && !recentExercises.includes(ex.id)
        );
        
        if (targetingExercise) {
          selected.push(targetingExercise);
        }
      }
  
      return selected.slice(0, maxExercises);
    }
  
    assignTrainingParameters({ exercises, goal, duration }) {
      return exercises.map((exercise, index) => {
        const repRange = exercise.rep_ranges[goal];
        const restTime = exercise.rest_time_seconds[goal];
        
        // Smart set assignment based on exercise type and position
        let sets;
        if (exercise.category === 'compound') {
          sets = goal === 'strength' ? 4 : 3;
        } else {
          sets = goal === 'endurance' ? 2 : 3;
        }
  
        // Adjust for workout position (less volume for later exercises)
        if (index >= 3) {
          sets = Math.max(2, sets - 1);
        }
  
        return {
          ...exercise,
          prescribed_sets: sets,
          prescribed_reps: repRange,
          prescribed_rest: restTime,
          order: index + 1,
          estimated_time: this.estimateExerciseTime(sets, repRange, restTime)
        };
      });
    }
  
    addCoachingGuidance(workoutPlan, goal) {
      const totalTime = workoutPlan.reduce((sum, ex) => sum + ex.estimated_time, 0);
      
      const coachingNotes = this.generateCoachingNotes(goal, workoutPlan);
      
      return {
        id: `workout_${Date.now()}`,
        title: this.generateWorkoutTitle(workoutPlan, goal),
        subtitle: `${workoutPlan.length} exercises • ${Math.round(totalTime)} minutes`,
        goal: goal,
        exercises: workoutPlan,
        coaching_notes: coachingNotes,
        warm_up_required: true,
        cool_down_required: true,
        estimated_total_time: totalTime
      };
    }
  
    // Helper methods
    isDifficultyAppropriate(exerciseDifficulty, userExperience) {
      const difficultyLevels = {
        'beginner': ['beginner'],
        'intermediate': ['beginner', 'intermediate'], 
        'advanced': ['beginner', 'intermediate', 'advanced']
      };
      
      return difficultyLevels[userExperience]?.includes(exerciseDifficulty) || false;
    }
  
    doesExerciseTargetMuscles(exercise, targetMuscles) {
      const allTargeted = [
        ...exercise.muscles.primary,
        ...exercise.muscles.secondary
      ];
      
      return targetMuscles.some(muscle => 
        allTargeted.some(targeted => targeted.includes(muscle))
      );
    }
  
    getRecentExerciseIds(previousWorkouts, daysBack = 3) {
      // Return exercise IDs from recent workouts to avoid repetition
      return previousWorkouts
        .filter(workout => this.isWithinDays(workout.date, daysBack))
        .flatMap(workout => workout.exercises.map(ex => ex.id));
    }
  
    generateWorkoutTitle(exercises, goal) {
      const patterns = exercises.map(ex => ex.movement_pattern);
      const uniquePatterns = [...new Set(patterns)];
      
      if (uniquePatterns.includes('squat') && uniquePatterns.includes('horizontal_push')) {
        return 'Upper & Lower Power';
      } else if (patterns.filter(p => p.includes('push')).length >= 2) {
        return 'Push Focus Session';
      } else if (exercises.length <= 3) {
        return 'Quick & Effective';
      } else {
        return `${goal.charAt(0).toUpperCase() + goal.slice(1)} Builder`;
      }
    }
  
    generateCoachingNotes(goal, exercises) {
      const notes = [];
      
      if (goal === 'strength') {
        notes.push('Focus on heavy weight, perfect form. Rest fully between sets.');
      } else if (goal === 'hypertrophy') {
        notes.push('Controlled movement, mind-muscle connection. Moderate rest periods.');
      } else {
        notes.push('Keep intensity high, minimize rest. Focus on conditioning.');
      }
  
      if (exercises.some(ex => ex.category === 'compound')) {
        notes.push('Compound exercises first when you\'re fresh.');
      }
  
      return notes;
    }
  
    estimateExerciseTime(sets, repRange, restTime) {
      // Rough estimation: set time + rest time
      const avgReps = this.parseRepRange(repRange);
      const setDuration = avgReps * 3; // ~3 seconds per rep
      const totalRestTime = (sets - 1) * (restTime / 60); // convert to minutes
      const totalSetTime = sets * (setDuration / 60); // convert to minutes
      
      return totalSetTime + totalRestTime;
    }
  
    parseRepRange(repRange) {
      if (repRange.includes('-')) {
        const [min, max] = repRange.split('-').map(n => parseInt(n));
        return (min + max) / 2;
      }
      return parseInt(repRange) || 10;
    }
  }
  
  // ===========================================
  // STEP 3: Usage Example
  // ===========================================
  
  // Initialize the generator
  const generator = new WorkoutGenerator(exerciseDatabase);
  
  // Example workout generation
  const userInput = {
    targetMuscles: ['chest', 'legs'], 
    equipment: ['bodyweight', 'dumbbells'],
    duration: 45,
    goal: 'hypertrophy',
    experience: 'intermediate',
    previousWorkouts: [] // Would come from user's workout history
  };
  
  const generatedWorkout = generator.generateWorkout(userInput);
  
  console.log('Generated Workout:', generatedWorkout);
  
  // This will output a complete workout plan with:
  // - Exercise selection based on constraints
  // - Sets, reps, rest periods
  // - Coaching guidance
  // - Time estimates
  // - Progressive difficulty
  
  export default WorkoutGenerator;