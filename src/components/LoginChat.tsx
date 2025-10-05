import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Salad, Sparkles, User, AlertCircle, MapPin, RotateCcw, ChefHat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Restaurant = {
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { open_now: boolean };
  geometry?: { location: any };
  place_id?: string;
};

const API_URL = 'http://localhost:5000/api/chat';
const GOOGLE_MAPS_KEY = 'AIzaSyD5SzaJLsPAqsE1t_e_6c8A0vHbxb2fcBo';

const QUICK_PROMPTS = [
  "I have ulcer and my stomach hurts",
  "Suggest a healthy breakfast",
  "I'm diabetic, what can I eat?",
];

const LoginChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi, I am Aliva. What can I help with?" }
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  const listRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Initialize location and Google Maps
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }

    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps.api/js?key=${GOOGLE_MAPS_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // API call to chat
  const sendMessage = async (userMessage: string): Promise<string> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        chatHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from AI');
    }

    const data = await response.json();
    return data.response;
  };

  // Handle send button
  const handleSend = async () => {
    const text = input.trim();
    if (!text || thinking) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setThinking(true);
    setError(null);

    try {
      const response = await sendMessage(text);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error: any) {
      setError(error.message || "Sorry, I'm having trouble connecting right now.");
    } finally {
      setThinking(false);
    }
  };

  // Initialize Google Map
  const initializeMap = () => {
    if (!mapRef.current || !userLocation || !(window as any).google) return;

    const google = (window as any).google;
    const map = new google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      mapTypeControl: true,
      fullscreenControl: true,
    });

    googleMapRef.current = map;

    // User location marker
    new google.maps.Marker({
      position: userLocation,
      map,
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

    // Search for nearby restaurants
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: userLocation,
        radius: 5000,
        type: 'restaurant'
      },
      (results: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setRestaurants(results);
          
          // Clear old markers
          markersRef.current.forEach(marker => marker.setMap(null));
          markersRef.current = [];

          const bounds = new google.maps.LatLngBounds();
          bounds.extend(userLocation);

          // Add restaurant markers
          results.forEach((place: any, index: number) => {
            if (place.geometry?.location) {
              const marker = new google.maps.Marker({
                position: place.geometry.location,
                map,
                title: place.name,
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

              const distance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(userLocation.lat, userLocation.lng),
                place.geometry.location
              ) / 1000;

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
          const listener = google.maps.event.addListener(map, "idle", () => {
            if (map.getZoom() > 16) map.setZoom(16);
            google.maps.event.removeListener(listener);
          });
        } else {
          setError('Could not find restaurants nearby.');
        }
      }
    );
  };

  // Handle restaurant search
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

  const handleNewConsultation = () => {
    setMessages([{ role: "assistant", content: "Hi, I am Aliva. What can I help with?" }]);
    setInput("");
    setError(null);
  };

  const calculateDistance = (place: Restaurant): number => {
    if (!userLocation || !place.geometry?.location || !(window as any).google?.maps?.geometry) return 0;
    const google = (window as any).google;
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(userLocation.lat, userLocation.lng),
      place.geometry.location
    ) / 1000;
  };

  const getDirectionsUrl = (place: Restaurant): string => {
    const placeLatLng = place.geometry?.location;
    return placeLatLng 
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${placeLatLng.lat()},${placeLatLng.lng()}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.vicinity)}`;
  };

  return (
    <>
      <div className="mx-auto w-full h-screen flex flex-col bg-white">
        <div className="w-full max-w-2xl mx-auto flex flex-col h-full py-4 px-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Salad className="h-4 w-4 text-white" />
            </div>
            <div className="font-semibold">Chat with Aliva</div>
            <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">
              AI Nutritionist
            </Badge>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div ref={listRef} className="p-4 space-y-4 min-h-full flex flex-col justify-end">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} ${idx === 0 ? 'items-center min-h-[50vh]' : ''}`}>
                    {m.role === "assistant" && idx !== 0 && (
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
                    {m.role === "user" && (
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

          {/* Quick Prompts - only on first message */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4 mt-4">
              {QUICK_PROMPTS.map((prompt, i) => (
                <Button 
                  key={i} 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full text-xs hover:bg-primary/10 hover:text-primary border-primary/20 px-4 py-2" 
                  onClick={() => setInput(prompt)}
                  disabled={thinking}
                >
                  {prompt}
                </Button>
              ))}
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full text-xs hover:bg-primary/10 hover:text-primary border-primary/20 px-4 py-2" 
                onClick={handleFindRestaurants}
                disabled={thinking}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Find restaurants near me
              </Button>
            </div>
          )}

          {/* Input Area */}
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
            
            {/* Action Buttons */}
            {messages.length > 1 && (
              <div className="flex gap-2 justify-center mt-3">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs text-primary hover:text-primary hover:bg-primary/10" 
                  onClick={handleNewConsultation}
                  disabled={thinking}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Start new consultation
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs text-primary hover:text-primary hover:bg-primary/10" 
                  onClick={() => setInput("Generate a healthy recipe based on ingredients I have")}
                  disabled={thinking}
                >
                  <ChefHat className="h-3 w-3 mr-1" />
                  Generate a recipe
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Map Dialog */}
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
                  {restaurants.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Searching for restaurants...</p>
                    </div>
                  ) : (
                    restaurants.map((place, index) => {
                      const distance = calculateDistance(place);
                      const directionsUrl = getDirectionsUrl(place);
                      
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
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-base mb-1 line-clamp-1">{place.name}</div>
                              <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{place.vicinity}</div>
                              
                              {distance > 0 && (
                                <div className="flex items-center gap-1 text-xs font-medium text-primary mb-1">
                                  <MapPin className="h-3 w-3" />
                                  {distance.toFixed(2)} km away
                                </div>
                              )}
                              
                              <div className="flex items-center gap-3 flex-wrap">
                                {place.rating && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="font-medium">{place.rating}</span>
                                    {place.user_ratings_total && (
                                      <span className="text-muted-foreground">({place.user_ratings_total})</span>
                                    )}
                                  </div>
                                )}
                                
                                {place.opening_hours && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <span className={`w-2 h-2 rounded-full ${place.opening_hours.open_now ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className={`font-medium ${place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                                      {place.opening_hours.open_now ? 'Open now' : 'Closed'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(directionsUrl, '_blank');
                              }}
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              Get Directions
                            </Button>
                            {place.place_id && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-8 px-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://www.google.com/maps/place/?q=place_id:${place.place_id}`, '_blank');
                                }}
                              >
                                View Details
                              </Button>
                            )}
                          </div>
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