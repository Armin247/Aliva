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
        return {
          id: profileSnap.id,
          userId: data.userId,
          fullName: data.fullName,
          dietaryPreferences: data.dietaryPreferences || [],
          healthGoals: data.healthGoals || [],
          allergies: data.allergies || [],
          age: data.age,
          activityLevel: data.activityLevel,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
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