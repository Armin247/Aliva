export interface UserProfile {
  id?: string;
  userId: string;
  fullName?: string;
  dietaryPreferences?: string[];
  healthGoals?: string[];
  allergies?: string[];
  age?: number;
  activityLevel?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ACTIVITY_LEVELS = [
  'sedentary',
  'lightly_active', 
  'moderately_active',
  'very_active',
  'extremely_active'
] as const;

export type ActivityLevel = typeof ACTIVITY_LEVELS[number];