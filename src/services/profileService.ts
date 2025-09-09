import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  DocumentReference 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/types/profile';

export class ProfileService {
  private getProfileRef(userId: string): DocumentReference {
    return doc(db, 'profiles', userId);
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profileRef = this.getProfileRef(userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        const profile: UserProfile = {
          id: profileSnap.id,
          userId: data.userId,
          fullName: data.fullName,
          dietaryPreferences: data.dietaryPreferences || [],
          healthGoals: data.healthGoals || [],
          allergies: data.allergies || [],
          age: data.age,
          activityLevel: data.activityLevel,
          gender: data.gender || undefined,
          heightCm: data.heightCm || undefined,
          currentWeightKg: data.currentWeightKg || undefined,
          targetWeightKg: data.targetWeightKg || undefined,
          medicalConditions: data.medicalConditions || [],
          smokingStatus: data.smokingStatus || undefined,
          alcoholFrequency: data.alcoholFrequency || undefined,
          weightHistory: (data.weightHistory || []).map((w: any) => ({
            date: w.date?.toDate ? w.date.toDate() : new Date(w.date),
            weightKg: w.weightKg,
          })),
          preferredCalorieTarget: data.preferredCalorieTarget || undefined,
          photoURL: data.photoURL || undefined,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
        return profile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async createProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const profileRef = this.getProfileRef(userId);
      await setDoc(profileRef, {
        userId,
        fullName: profileData.fullName || '',
        dietaryPreferences: profileData.dietaryPreferences || [],
        healthGoals: profileData.healthGoals || [],
        allergies: profileData.allergies || [],
        age: profileData.age || null,
        activityLevel: profileData.activityLevel || null,
        gender: profileData.gender || null,
        heightCm: profileData.heightCm || null,
        currentWeightKg: profileData.currentWeightKg || null,
        targetWeightKg: profileData.targetWeightKg || null,
        medicalConditions: profileData.medicalConditions || [],
        smokingStatus: profileData.smokingStatus || null,
        alcoholFrequency: profileData.alcoholFrequency || null,
        weightHistory: (profileData.weightHistory || []).map(w => ({
          date: w.date,
          weightKg: w.weightKg,
        })),
        preferredCalorieTarget: profileData.preferredCalorieTarget || null,
        photoURL: profileData.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const profileRef = this.getProfileRef(userId);
      await updateDoc(profileRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async upsertProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const existingProfile = await this.getProfile(userId);
      
      if (existingProfile) {
        await this.updateProfile(userId, profileData);
      } else {
        await this.createProfile(userId, profileData);
      }
    } catch (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();