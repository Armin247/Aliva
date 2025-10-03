export interface UserProfile {
  id?: string;
  userId: string;
  fullName?: string;
  dietaryPreferences?: string[];
  healthGoals?: string[];
  allergies?: string[];
  age?: number;
  activityLevel?: string;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  medicalConditions?: string[];
  smokingStatus?: 'never' | 'former' | 'current';
  alcoholFrequency?: 'never' | 'occasional' | 'regular';
  weightHistory?: Array<{ date: Date; weightKg: number }>;
  preferredCalorieTarget?: number;
  photoURL?: string;
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