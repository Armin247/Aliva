import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Salad, Sparkles, User, AlertCircle, MapPin, RotateCcw, ChefHat, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { profileService } from "@/services/profileService";
import { UserProfile } from "@/types/profile";

type ChatMessage = {
  role: "user" | "assistant" | "restaurants";
  content: string;
  restaurants?: RestaurantResult[];
};

type RestaurantResult = {
  name: string;
  eta: string;
  rating: number;
  price: string;
  distanceKm: number;
  dish: string;
  logo?: string;
};

const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api/chat' 
  : '/api/chat';

// Fallback API URL for production
const FALLBACK_API_URL = 'https://your-vercel-app.vercel.app/api/chat';

const LoginChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [openRestaurants, setOpenRestaurants] = useState<RestaurantResult[] | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [mapRestaurants, setMapRestaurants] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  // Load user profile from database
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [adsVisible, setAdsVisible] = useState<boolean>(false);

  // Persona and safety guardrails
  const AI_PERSONA_HEADER = `You are Aliva — an AI wellness companion combining a friendly, down-to-earth tone with practical guidance.
Role: supportive friend + mental health coach + nutritionist.
Style: warm, validating, non-judgmental, concise, and actionable. Use first person plural when encouraging ("let's try...").
Boundaries: You are not a licensed clinician and cannot provide diagnosis. Encourage professional help for clinical concerns.
Safety: If user mentions intent to harm self or others, or a medical emergency, advise immediate help and crisis resources. Avoid providing instructions that could increase risk. Focus on grounding, coping skills, and seeking support.
Nutrition: Respect allergies and medical conditions. Prefer simple, budget-friendly, culturally adaptable suggestions.`;

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const profile = await profileService.getProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          console.log('Profile loaded for AI:', profile);
          // Determine paid status and ads visibility
          const expires = (profile as any).planExpiresAt;
          let isActivePaid = false;
          if (profile.plan && profile.plan !== 'FREE') {
            if (!expires) {
              isActivePaid = true;
            } else {
              const expDate = (typeof (expires as any)?.toDate === 'function')
                ? (expires as any).toDate()
                : (expires instanceof Date ? expires : new Date(expires));
              isActivePaid = expDate > new Date();
            }
          }
          setAdsVisible(!isActivePaid);
          // Load today's count
          const todayKey = `chat_count_${new Date().toISOString().slice(0,10)}`;
          const count = parseInt(localStorage.getItem(todayKey) || '0', 10);
          setDailyCount(Number.isFinite(count) ? count : 0);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();

    setMessages([
      {
        role: "assistant",
        content: "Hi, I am Aliva. What can I help with?",
      },
    ]);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.log('Could not get user location:', error)
      );
    }

    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD5SzaJLsPAqsE1t_e_6c8A0vHbxb2fcBo&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [user]);

  useEffect(() => {
    // Use setTimeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      if (listRef.current) {
        // Try multiple scroll methods for better compatibility
        listRef.current.scrollTop = listRef.current.scrollHeight;
        listRef.current.scrollTo({ 
          top: listRef.current.scrollHeight, 
          behavior: "smooth" 
        });
      }
    }, 100);
  }, [messages, thinking]);

  // Auto ads enabled globally via index.html; no manual slot loading needed

  const quickPrompts = useMemo(
    () => [
      userProfile ? "Suggest meals for me" : "Suggest meals for me",
      userProfile ? "Create a personalized meal plan" : "Create a personalized meal plan",
      userProfile ? "What should I eat today?" : "What should I eat today?",
      "Find restaurants near me",
      "Suggest local recipes",
      "What's in season here?",
    ],
    [userProfile]
  );

  const actionButtons = useMemo(
    () => [
      { label: "Start new consultation", icon: RotateCcw, action: "new" },
      { label: "Generate a recipe", icon: ChefHat, action: "recipe" },
      { label: "Edit Profile", icon: Settings, action: "profile" },
    ],
    []
  );

  const handleStartNewConsultation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi, I am Aliva. What can I help with?",
      },
    ]);
    setInput("");
    setError(null);
  };

  const handleGenerateRecipe = () => {
    setInput("Generate a healthy recipe based on my dietary profile and preferences");
  };

  const buildProfileContext = (): string => {
    if (!userProfile) return '';
    
    const parts: string[] = [];
    
    // Basic info
    if (userProfile.age) parts.push(`Age: ${userProfile.age} years`);
    if (userProfile.gender) parts.push(`Gender: ${userProfile.gender}`);
    
    // Physical measurements
    if (userProfile.heightCm && userProfile.currentWeightKg) {
      parts.push(`Height: ${userProfile.heightCm}cm, Current Weight: ${userProfile.currentWeightKg}kg`);
    }
    if (userProfile.targetWeightKg) {
      parts.push(`Target Weight: ${userProfile.targetWeightKg}kg`);
    }
    
    // Activity and goals
    if (userProfile.activityLevel) {
      const activityFormatted = userProfile.activityLevel.replace('_', ' ');
      parts.push(`Activity Level: ${activityFormatted}`);
    }
    
    if (userProfile.healthGoals && userProfile.healthGoals.length > 0) {
      parts.push(`Health Goals: ${userProfile.healthGoals.join(', ')}`);
    }
    
    // Dietary preferences and restrictions
    if (userProfile.dietaryPreferences && userProfile.dietaryPreferences.length > 0) {
      parts.push(`Dietary Preferences: ${userProfile.dietaryPreferences.join(', ')}`);
    }
    
    // Medical information
    if (userProfile.allergies && userProfile.allergies.length > 0) {
      parts.push(`IMPORTANT - Allergies: ${userProfile.allergies.join(', ')} (MUST AVOID)`);
    }
    
    if (userProfile.medicalConditions && userProfile.medicalConditions.length > 0) {
      parts.push(`Medical Conditions: ${userProfile.medicalConditions.join(', ')}`);
    }
    
    // Lifestyle factors
    if (userProfile.smokingStatus) {
      parts.push(`Smoking Status: ${userProfile.smokingStatus}`);
    }
    if (userProfile.alcoholFrequency) {
      parts.push(`Alcohol Consumption: ${userProfile.alcoholFrequency}`);
    }
    
    // Calorie target
    if (userProfile.preferredCalorieTarget) {
      parts.push(`Daily Calorie Target: ${userProfile.preferredCalorieTarget} kcal`);
    }
    
    return parts.length > 0 
      ? `\n\n[User's Health Profile - Use this to personalize all recommendations]:\n${parts.join('\n')}\n[CRITICAL: Avoid all foods listed in allergies. Consider medical conditions when recommending foods.]` 
      : '';
  };

  const initializeMap = () => {
    if (!mapRef.current || !userLocation || !(window as any).google) {
      return;
    }

    const google = (window as any).google;
    const mapCenter = {
      lat: userLocation.latitude,
      lng: userLocation.longitude
    };

    const map = new google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 15,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }]
        }
      ]
    });

    googleMapRef.current = map;

    // Add user location marker with better styling
    new google.maps.Marker({
      position: mapCenter,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#10B981",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 3,
      },
      title: "Your Location",
      zIndex: 1000
    });

    // Add info window for user location
    const userInfoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; text-align: center;">
          <div style="font-weight: 600; color: #10B981; margin-bottom: 4px;">📍 You are here</div>
          <div style="font-size: 12px; color: #666;">
            ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}
          </div>
        </div>
      `
    });

    // Show user location info window initially
    setTimeout(() => {
      userInfoWindow.open(map, new google.maps.Marker({
        position: mapCenter,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#10B981",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
        }
      }));
    }, 1000);

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: mapCenter,
      radius: 5000,
      type: 'restaurant',
      keyword: 'healthy food'
    };

    service.nearbySearch(request, (results: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setMapRestaurants(results);
        
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(mapCenter);

        results.forEach((place: any, index: number) => {
          if (place.geometry?.location) {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
              place.geometry.location
            ) / 1000;

            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: map,
              title: place.name,
              animation: google.maps.Animation.DROP,
              label: {
                text: `${index + 1}`,
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold'
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 14,
                fillColor: place.rating && place.rating >= 4 ? "#10B981" : "#F59E0B",
                fillOpacity: 0.9,
                strokeColor: "#fff",
                strokeWeight: 2,
              }
            });

            bounds.extend(place.geometry.location);

            marker.addListener('click', () => {
              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div style="padding: 12px; max-width: 220px;">
                    <h3 style="margin: 0 0 6px 0; font-weight: 600; font-size: 14px; color: #1F2937;">${place.name}</h3>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${place.vicinity}</p>
                    ${place.rating ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #F59E0B;">⭐ ${place.rating}${place.user_ratings_total ? ` (${place.user_ratings_total} reviews)` : ''}</p>` : ''}
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #10B981; font-weight: 600;">📍 ${distance.toFixed(2)} km away</p>
                    ${place.price_level ? `<p style="margin: 0; font-size: 11px; color: #6B7280;">💰 ${'$'.repeat(place.price_level)}</p>` : ''}
                  </div>
                `
              });
              infoWindow.open(map, marker);
            });

            markersRef.current.push(marker);
          }
        });

        map.fitBounds(bounds);
      }
    });
  };

  const handleFindRestaurants = () => {
    if (!userLocation) {
      setError("Please enable location access to find nearby restaurants");
      return;
    }
    
    if (!(window as any).google) {
      setError("Google Maps is still loading. Please wait a moment.");
      return;
    }
    
    setShowMapDialog(true);
    setError(null);
    setTimeout(initializeMap, 300);
  };

  const callOpenAI = async (userMessage: string, chatHistory: ChatMessage[], useFallback = false) => {
    const profileContext = buildProfileContext();
    const enhancedMessage = `${AI_PERSONA_HEADER}\n\n[User message]: ${userMessage}${profileContext}`;

    // Client-side free tier guard (3/day)
    let isActivePaid = false;
    if (userProfile?.plan && userProfile.plan !== 'FREE') {
      const expires = (userProfile as any).planExpiresAt;
      if (!expires) {
        isActivePaid = true;
      } else {
        const expDate = (typeof (expires as any)?.toDate === 'function')
          ? (expires as any).toDate()
          : (expires instanceof Date ? expires : new Date(expires));
        isActivePaid = expDate > new Date();
      }
    }
    if (!isActivePaid && dailyCount >= 3) {
      setError('Daily limit reached on Free plan. Upgrade to continue.');
      return { response: 'You have reached the daily limit for the free plan. Please upgrade to continue unlimited chats.', restaurants: [] };
    }

    const url = useFallback ? FALLBACK_API_URL : API_URL;
    console.log('Making API call to:', url);
    console.log('Environment:', import.meta.env.DEV ? 'development' : 'production');
    console.log('Using fallback:', useFallback);
    console.log('User location:', userLocation);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: enhancedMessage,
          chatHistory: chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userId: user?.uid,
          location: userLocation ? {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          } : undefined
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      // Increment daily count for free users
      if (!isActivePaid) {
        const todayKey = `chat_count_${new Date().toISOString().slice(0,10)}`;
        const next = dailyCount + 1;
        localStorage.setItem(todayKey, String(next));
        setDailyCount(next);
      }
      console.log('API Response:', data);
      return { response: data.response, restaurants: [] };
    } catch (error) {
      console.error('Fetch error details:', error);
      
      // If this is the first attempt and we're in production, try the fallback
      if (!useFallback && !import.meta.env.DEV) {
        console.log('Trying fallback URL...');
        return callOpenAI(userMessage, chatHistory, true);
      }
      
      throw error;
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) {
        // Try multiple scroll methods for better compatibility
        listRef.current.scrollTop = listRef.current.scrollHeight;
        listRef.current.scrollTo({ 
          top: listRef.current.scrollHeight, 
          behavior: "smooth" 
        });
      }
    }, 100);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || thinking) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    setError(null);

    // Scroll after user message
    scrollToBottom();

    // Lightweight crisis detection
    const crisisPatterns = [
      /suicid(e|al)|kill myself|end my life|want to die/i,
      /self[-\s]?harm|hurt myself|cutting|overdose/i,
      /hurt (someone|others)|kill (someone|them)/i,
      /i can't go on|no reason to live|i am a danger/i
    ];
    const isCrisis = crisisPatterns.some(rx => rx.test(text));
    if (isCrisis) {
      const crisisResponse = `I'm really glad you reached out. Your feelings matter, and you don't have to face this alone.\n\nIf you feel at immediate risk, please contact your local emergency number right now. If you're in the U.S., call or text 988 (Suicide & Crisis Lifeline). In the U.K., call Samaritans at 116 123. If you're elsewhere, your local health services can connect you to 24/7 support.\n\nFor right now, can we try a quick grounding exercise together? Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Take slow breaths: in 4 seconds, hold 4, out 6.\n\nWould you like help finding professional support in your area, or to talk through what you're feeling in a safer way?`;
      const assistantMsg: ChatMessage = { role: "assistant", content: crisisResponse };
      setMessages(prev => [...prev, assistantMsg]);
      setThinking(false);
      return;
    }

    try {
      const result = await callOpenAI(text, messages);

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: result.response
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      // Scroll after AI response
      scrollToBottom();
    } catch (error: any) {
      setError(error.message || "Sorry, I'm having trouble connecting right now.");
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full h-screen flex flex-col bg-white">
        <div className="w-full max-w-2xl mx-auto flex flex-col h-full py-4 px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Salad className="h-4 w-4 text-white" />
            </div>
            <div className="font-semibold">Chat with Aliva</div>
            <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">
              AI Wellness Companion
            </Badge>
            {userProfile && (
              <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                Profile Active
              </Badge>
            )}
            {userLocation && (
              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                <MapPin className="h-3 w-3 mr-1" />
                Location Active
              </Badge>
            )}
          </div>

          {/* Auto ads enabled globally; no manual ad unit rendered here */}

          {!userProfile && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1 text-sm text-blue-700">
                  <p className="font-medium mb-1">Get Personalized Recommendations</p>
                  <p className="text-xs">Complete your health profile to receive tailored nutrition advice based on your goals, allergies, and dietary needs.</p>
                  <Button 
                    size="sm" 
                    className="mt-2 h-7 text-xs" 
                    onClick={() => navigate('/profile')}
                  >
                    Complete Profile
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div ref={listRef} className="p-4 space-y-4 min-h-full flex flex-col justify-end">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} ${idx === 0 ? 'items-center min-h-[50vh]' : ''}`}>
                    {m.role !== "user" && idx !== 0 && (
                      <Avatar className="h-7 w-7 mr-2">
                        <AvatarFallback className="bg-primary text-white">
                          <Bot className="h-3.5 w-3.5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {idx === 0 ? (
                      <div className="text-center w-full">
                        <h2 className="text-3xl font-semibold mb-2">Hi, I am Aliva.</h2>
                        <p className="text-xl text-primary font-medium">Your friendly wellness companion — how can I support you today?</p>
                      </div>
                    ) : (
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        m.role === "user" 
                          ? "bg-white shadow-sm border border-gray-200" 
                          : "bg-primary/10 border border-primary/20"
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                      </div>
                    )}
                    {m.role === "user" && idx !== 0 && (
                      <Avatar className="h-7 w-7 ml-2">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-3.5 w-3.5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {thinking && (
                  <div className="flex justify-start">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback className="bg-primary text-white">
                        <Bot className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 animate-spin text-primary" />
                        Aliva is thinking...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4 mt-4">
              {quickPrompts.map((q, i) => (
                <Button 
                  key={i} 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full text-xs hover:bg-primary/10 hover:text-primary border-primary/20 px-4 py-2" 
                  onClick={() => {
                    if (q === "Find restaurants near me") {
                      handleFindRestaurants();
                    } else if (q === "Suggest local recipes") {
                      setInput("Suggest some healthy local recipes based on my location and dietary preferences");
                    } else if (q === "What's in season here?") {
                      setInput("What fruits and vegetables are in season in my area right now?");
                    } else {
                      setInput(q);
                    }
                  }}
                  disabled={thinking}
                >
                  {q === "Find restaurants near me" && <MapPin className="h-3 w-3 mr-1" />}
                  {q}
                </Button>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4 pb-2">
            <div className="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2.5 border border-gray-200">
              <Input
                placeholder="Ask about nutrition, mindset, or life — I'm here for you"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 px-0"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || thinking} 
                size="icon"
                className="rounded-full h-9 w-9 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {messages.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {actionButtons.map((btn, i) => (
                  <Button 
                    key={i} 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs text-primary hover:text-primary hover:bg-primary/10" 
                    onClick={() => {
                      if (btn.action === "new") {
                        handleStartNewConsultation();
                      } else if (btn.action === "recipe") {
                        handleGenerateRecipe();
                      } else if (btn.action === "profile") {
                        navigate('/profile');
                      }
                    }}
                    disabled={thinking}
                  >
                    <btn.icon className="h-3 w-3 mr-1" />
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold">Nearby Restaurants</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row h-[calc(100%-60px)] overflow-hidden">
            <div className="flex-1 relative">
              <div ref={mapRef} className="w-full h-full" />
            </div>
            
            <div className="w-full md:w-96 border-l bg-white">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {mapRestaurants.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Searching for restaurants...</p>
                    </div>
                  ) : (
                    mapRestaurants.map((place, index) => {
                      let distance = 0;
                      if (userLocation && place.geometry?.location && (window as any).google?.maps?.geometry) {
                        const google = (window as any).google;
                        distance = google.maps.geometry.spherical.computeDistanceBetween(
                          new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
                          place.geometry.location
                        ) / 1000;
                      }

                      const placeLatLng = place.geometry?.location;
                      const googleMapsUrl = placeLatLng 
                        ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.latitude},${userLocation?.longitude}&destination=${placeLatLng.lat()},${placeLatLng.lng()}&travelmode=driving`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.vicinity)}`;
                      
                      return (
                        <div 
                          key={index} 
                          className="p-4 border rounded-xl hover:shadow-md hover:border-primary/50 cursor-pointer transition-all bg-white"
                          onClick={() => {
                            if (place.geometry?.location && googleMapRef.current) {
                              googleMapRef.current.panTo(place.geometry.location);
                              googleMapRef.current.setZoom(17);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold ${
                              place.rating && place.rating >= 4 ? 'bg-green-500' : 'bg-amber-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold mb-1">{place.name}</div>
                              <div className="text-xs text-muted-foreground mb-2">{place.vicinity}</div>
                              <div className="flex items-center gap-3 text-xs mb-2">
                                {distance > 0 && (
                                  <div className="flex items-center gap-1 text-primary">
                                    <MapPin className="h-3 w-3" />
                                    {distance.toFixed(2)} km
                                  </div>
                                )}
                                {place.rating && (
                                  <div className="flex items-center gap-1 text-amber-600">
                                    <span>⭐</span>
                                    <span>{place.rating}</span>
                                    {place.user_ratings_total && (
                                      <span className="text-gray-500">({place.user_ratings_total})</span>
                                    )}
                                  </div>
                                )}
                                {place.price_level && (
                                  <div className="text-gray-600">
                                    {Array(place.price_level).fill('$').join('')}
                                  </div>
                                )}
                              </div>
                              {place.types && place.types.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {place.types.slice(0, 3).map((type: string, typeIndex: number) => (
                                    <span 
                                      key={typeIndex}
                                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                    >
                                      {type.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(googleMapsUrl, '_blank');
                            }}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Get Directions
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginChat;