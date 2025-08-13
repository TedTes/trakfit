export const exerciseDatabase = [
    {
      id: 'push_up_001',
      name: 'Push-ups',
      category: 'compound',
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      
      // Muscle targeting (future-proof for analytics)
      muscles: {
        primary: ['chest_pectorals'],
        secondary: ['shoulders_anterior', 'triceps'],
        stabilizers: ['core_abs', 'shoulders_posterior']
      },
      
      // Movement patterns (for smart programming)
      movement_pattern: 'horizontal_push',
      plane_of_motion: ['sagittal'],
      
      // Progression/regression options
      progression: 'decline_push_ups',
      regression: 'incline_push_ups',
      alternatives: ['chest_press_dumbbell', 'chest_fly_dumbbell'],
      
      // Training parameters
      rep_ranges: {
        strength: '3-6',
        hypertrophy: '8-12', 
        endurance: '15-25'
      },
      rest_time_seconds: {
        strength: 180,
        hypertrophy: 90,
        endurance: 60
      },
      
      // Future animation/instruction data
      animation_frames: 3,
      form_cues: [
        'Keep body in straight line',
        'Lower chest to floor',
        'Push up explosively'
      ],
      common_mistakes: [
        'Sagging hips',
        'Partial range of motion',
        'Head dropping'
      ],
      
      // Analytics-ready metadata
      metabolic_demand: 'moderate',
      joint_stress: 'low',
      skill_requirement: 'low',
      fatigue_factor: 'moderate'
    },
    
    {
      id: 'squat_bodyweight_001',
      name: 'Bodyweight Squats',
      category: 'compound',
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      
      muscles: {
        primary: ['legs_quadriceps', 'legs_glutes'],
        secondary: ['legs_hamstrings', 'legs_calves'],
        stabilizers: ['core_abs', 'back_erectors']
      },
      
      movement_pattern: 'squat',
      plane_of_motion: ['sagittal', 'frontal'],
      
      progression: 'goblet_squat',
      regression: 'box_squat',
      alternatives: ['leg_press', 'wall_squat'],
      
      rep_ranges: {
        strength: '5-8',
        hypertrophy: '12-20',
        endurance: '25-50'
      },
      rest_time_seconds: {
        strength: 120,
        hypertrophy: 75,
        endurance: 45
      },
      
      animation_frames: 3,
      form_cues: [
        'Feet shoulder-width apart',
        'Sit back and down',
        'Drive through heels'
      ],
      common_mistakes: [
        'Knees caving inward',
        'Forward lean',
        'Partial depth'
      ],
      
      metabolic_demand: 'high',
      joint_stress: 'moderate',
      skill_requirement: 'moderate',
      fatigue_factor: 'high'
    },
  
    {
      id: 'plank_001',
      name: 'Plank Hold',
      category: 'isometric',
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      
      muscles: {
        primary: ['core_abs'],
        secondary: ['core_obliques', 'back_erectors'],
        stabilizers: ['shoulders_all', 'legs_glutes']
      },
      
      movement_pattern: 'anti_extension',
      plane_of_motion: ['isometric'],
      
      progression: 'plank_up_down',
      regression: 'knee_plank',
      alternatives: ['dead_bug', 'bird_dog'],
      
      rep_ranges: {
        strength: '30-45s',
        hypertrophy: '45-60s',
        endurance: '60-120s'
      },
      rest_time_seconds: {
        strength: 90,
        hypertrophy: 60,
        endurance: 45
      },
      
      animation_frames: 1,
      form_cues: [
        'Body in straight line',
        'Engage core tight',
        'Breathe normally'
      ],
      common_mistakes: [
        'Hips too high',
        'Hips sagging',
        'Holding breath'
      ],
      
      metabolic_demand: 'low',
      joint_stress: 'low',
      skill_requirement: 'low',
      fatigue_factor: 'moderate'
    }
  ];