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

const API_URL = 'http://localhost:5000/api/chat';

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

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const profile = await profileService.getProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          console.log('Profile loaded for AI:', profile);
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
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const quickPrompts = useMemo(
    () => [
      userProfile ? "Suggest meals for me" : "Suggest meals for me",
      userProfile ? "Create a personalized meal plan" : "Create a personalized meal plan",
      userProfile ? "What should I eat today?" : "What should I eat today?",
      "Find restaurants near me",
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
    });

    googleMapRef.current = map;

    new google.maps.Marker({
      position: mapCenter,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4F46E5",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 3,
      },
      title: "You are here"
    });

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: mapCenter,
      radius: 5000,
      type: 'restaurant'
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
                fillColor: "#10B981",
                fillOpacity: 0.9,
                strokeColor: "#fff",
                strokeWeight: 2,
              }
            });

            bounds.extend(place.geometry.location);

            marker.addListener('click', () => {
              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div style="padding: 10px; max-width: 200px;">
                    <h3 style="margin: 0 0 6px 0; font-weight: 600; font-size: 14px;">${place.name}</h3>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${place.vicinity}</p>
                    ${place.rating ? `<p style="margin: 0 0 4px 0; font-size: 12px;">⭐ ${place.rating}</p>` : ''}
                    <p style="margin: 0; font-size: 12px; color: #4F46E5; font-weight: 600;">${distance.toFixed(2)} km away</p>
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

  const callOpenAI = async (userMessage: string, chatHistory: ChatMessage[]) => {
    const profileContext = buildProfileContext();
    const enhancedMessage = profileContext 
      ? `${userMessage}${profileContext}` 
      : userMessage;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: enhancedMessage,
        chatHistory: chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      throw new Error('AI connectivity error');
    }

    const data = await response.json();
    return { response: data.response, restaurants: [] };
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || thinking) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    setError(null);

    try {
      const result = await callOpenAI(text, messages);

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: result.response
      };

      setMessages(prev => [...prev, assistantMsg]);
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
              AI Nutritionist
            </Badge>
            {userProfile && (
              <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                Profile Active
              </Badge>
            )}
          </div>

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
                        <p className="text-xl text-primary font-medium">What can I help with?</p>
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
                placeholder="Ask anything"
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
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold mb-1">{place.name}</div>
                              <div className="text-xs text-muted-foreground mb-2">{place.vicinity}</div>
                              {distance > 0 && (
                                <div className="flex items-center gap-1 text-xs text-primary mb-1">
                                  <MapPin className="h-3 w-3" />
                                  {distance.toFixed(2)} km away
                                </div>
                              )}
                              {place.rating && (
                                <div className="text-xs">
                                  ⭐ {place.rating}
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