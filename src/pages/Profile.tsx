import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/services/profileService';
import { UserProfile } from '@/types/profile';
import { Loader2, Plus, X, User, Target, Shield, Activity } from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [newDietaryPref, setNewDietaryPref] = useState('');
  const [newHealthGoal, setNewHealthGoal] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Predefined options
  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Mediterranean', 
    'Low Carb', 'Low Fat', 'Gluten Free', 'Dairy Free', 'Intermittent Fasting'
  ];
  
  const healthGoalOptions = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'Improved Energy', 
    'Better Sleep', 'Reduced Inflammation', 'Heart Health', 'Digestive Health',
    'Mental Clarity', 'Athletic Performance', 'General Wellness'
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await profileService.getProfile(user.uid);
      if (profileData) {
        setProfile({
          userId: profileData.userId,
          fullName: profileData.fullName,
          dietaryPreferences: profileData.dietaryPreferences,
          healthGoals: profileData.healthGoals,
          allergies: profileData.allergies,
          age: profileData.age,
          activityLevel: profileData.activityLevel,
        });
      }
    } catch (error) {
      toast({
        title: 'Error loading profile',
        description: error instanceof Error ? error.message : 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await profileService.upsertProfile(user.uid, {
        fullName: profile.fullName,
        dietaryPreferences: profile.dietaryPreferences || [],
        healthGoals: profile.healthGoals || [],
        allergies: profile.allergies || [],
        age: profile.age,
        activityLevel: profile.activityLevel,
      });

      toast({
        title: 'Profile updated!',
        description: 'Your nutrition profile has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error saving profile',
        description: error instanceof Error ? error.message : 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type: 'dietaryPreferences' | 'healthGoals' | 'allergies', value: string) => {
    if (!value.trim()) return;
    
    const currentItems = profile[type] || [];
    if (!currentItems.includes(value)) {
      setProfile({
        ...profile,
        [type]: [...currentItems, value]
      });
    }
    
    // Reset input
    if (type === 'dietaryPreferences') setNewDietaryPref('');
    if (type === 'healthGoals') setNewHealthGoal('');
    if (type === 'allergies') setNewAllergy('');
  };

  const removeItem = (type: 'dietaryPreferences' | 'healthGoals' | 'allergies', value: string) => {
    const currentItems = profile[type] || [];
    setProfile({
      ...profile,
      [type]: currentItems.filter(item => item !== value)
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Your Nutrition Profile
          </h1>
          <p className="text-muted-foreground">
            Help us personalize your nutrition experience
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your personal details for better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName || ''}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || undefined })}
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  value={profile.activityLevel || ''}
                  onValueChange={(value) => setProfile({ ...profile, activityLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Health Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Health Goals
              </CardTitle>
              <CardDescription>
                What are you hoping to achieve?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select
                  value={newHealthGoal}
                  onValueChange={setNewHealthGoal}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a health goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthGoalOptions.map(goal => (
                      <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => addItem('healthGoals', newHealthGoal)}
                  size="sm"
                  disabled={!newHealthGoal}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(profile.healthGoals || []).map(goal => (
                  <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                    {goal}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('healthGoals', goal)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dietary Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Dietary Preferences
              </CardTitle>
              <CardDescription>
                Your eating style and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select
                  value={newDietaryPref}
                  onValueChange={setNewDietaryPref}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select dietary preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietaryOptions.map(pref => (
                      <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => addItem('dietaryPreferences', newDietaryPref)}
                  size="sm"
                  disabled={!newDietaryPref}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(profile.dietaryPreferences || []).map(pref => (
                  <Badge key={pref} variant="secondary" className="flex items-center gap-1">
                    {pref}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('dietaryPreferences', pref)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Allergies & Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Allergies & Restrictions
              </CardTitle>
              <CardDescription>
                Foods you need to avoid for safety
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Enter allergy or restriction"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addItem('allergies', newAllergy);
                    }
                  }}
                />
                <Button 
                  onClick={() => addItem('allergies', newAllergy)}
                  size="sm"
                  disabled={!newAllergy}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(profile.allergies || []).map(allergy => (
                  <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                    {allergy}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('allergies', allergy)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={saveProfile}
            disabled={saving}
            className="gradient-primary px-8 py-2"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Profile...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;