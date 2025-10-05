import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Salad, Sparkles, User, AlertCircle, MapPin, RotateCcw, ChefHat } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  useEffect(() => {
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
          console.log('📍 User location obtained:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('❌ Could not get user location:', error);
          setError("Please enable location access to find nearby restaurants");
        }
      );
    }

    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD5SzaJLsPAqsE1t_e_6c8A0vHbxb2fcBo&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const quickPrompts = useMemo(
    () => [
      "Help me plan a healthy meal",
      "What should I eat for weight loss?",
      "Suggest protein-rich foods",
      "Find restaurants near me",
    ],
    []
  );

  const actionButtons = useMemo(
    () => [
      { label: "Start new consultation", icon: RotateCcw, action: "new" },
      { label: "Generate a recipe", icon: ChefHat, action: "recipe" },
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
    setInput("Generate a healthy recipe based on ingredients I have or suggest a nutritious meal for my condition");
  };

  const initializeMap = () => {
    if (!mapRef.current || !userLocation || !(window as any).google) {
      console.log('Map initialization failed:', { 
        hasMapRef: !!mapRef.current, 
        hasLocation: !!userLocation, 
        hasGoogle: !!(window as any).google 
      });
      return;
    }

    const google = (window as any).google;
    const mapCenter = {
      lat: userLocation.latitude,
      lng: userLocation.longitude
    };

    console.log('Initializing map at:', mapCenter);

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

    new google.maps.Circle({
      strokeColor: "#4F46E5",
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: "#4F46E5",
      fillOpacity: 0.1,
      map: map,
      center: mapCenter,
      radius: 100,
    });

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: mapCenter,
      radius: 5000,
      type: 'restaurant'
    };

    console.log('Searching for restaurants...');

    service.nearbySearch(request, (results: any, status: any) => {
      console.log('Search status:', status);
      console.log('Results found:', results?.length || 0);
      
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
                    ${place.rating ? `<p style="margin: 0 0 4px 0; font-size: 12px;">⭐ ${place.rating} (${place.user_ratings_total || 0} reviews)</p>` : ''}
                    <p style="margin: 0; font-size: 12px; color: #4F46E5; font-weight: 600;">${distance.toFixed(2)} km away</p>
                    ${place.opening_hours ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: ${place.opening_hours.open_now ? '#10B981' : '#EF4444'};">
                      ${place.opening_hours.open_now ? '🟢 Open now' : '🔴 Closed'}
                    </p>` : ''}
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
        console.error('Failed to find restaurants:', status);
        setError('Could not find restaurants nearby. Please try again.');
      }
    });
  };

  const handleFindRestaurants = () => {
    if (!userLocation) {
      setError("Please enable location access to find nearby restaurants");
      return;
    }
    
    if (!(window as any).google) {
      setError("Google Maps is still loading. Please wait a moment and try again.");
      return;
    }
    
    setShowMapDialog(true);
    setError(null);
    setTimeout(() => {
      initializeMap();
    }, 300);
  };

  const callOpenAI = async (userMessage: string, chatHistory: ChatMessage[]) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        chatHistory: chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from AI');
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

      if (result.restaurants && result.restaurants.length > 0) {
        const formattedRestaurants: RestaurantResult[] = result.restaurants.map((r: any) => ({
          name: r.name,
          eta: `${Math.round(parseFloat(r.distance) * 2)}-${Math.round(parseFloat(r.distance) * 3)} min`,
          rating: r.rating,
          price: r.priceLevel,
          distanceKm: parseFloat(r.distance),
          dish: "healthy meal",
          logo: "🍽️"
        }));
        setOpenRestaurants(formattedRestaurants);
      }
    } catch (error: any) {
      setError(error.message || "Sorry, I'm having trouble connecting right now. Please try again in a moment.");
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
          </div>

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

      <Sheet open={!!openRestaurants} onOpenChange={(v) => !v && setOpenRestaurants(null)}>
        <SheetContent side="bottom" className="rounded-t-2xl p-4 h-[80vh]">
          <SheetHeader>
            <SheetTitle>Recommended Restaurants</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 max-h-[60vh] overflow-auto pt-2">
            {openRestaurants?.map((r, i) => (
              <div key={i} className="rounded-lg border flex overflow-hidden min-h-[116px] hover:shadow-md transition-shadow">
                <div className="w-16 bg-primary/5 flex items-center justify-center rounded-l-lg text-2xl">
                  {r.logo || "🍽️"}
                </div>
                <div className="flex-1 p-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.dish} • {r.price} • {r.rating.toFixed(1)}★
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Healthy options available
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{r.eta}</div>
                    <div>{r.distanceKm.toFixed(1)} km</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

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
                        >
                          <div 
                            className="flex items-start gap-3"
                            onClick={() => {
                              if (place.geometry?.location && googleMapRef.current) {
                                googleMapRef.current.panTo(place.geometry.location);
                                googleMapRef.current.setZoom(17);
                              }
                            }}
                          >
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-base mb-1 line-clamp-1">{place.name}</div>
                              <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{place.vicinity}</div>
                              
                              {distance > 0 && (
                                <div className="flex items-center gap-1 text-xs font-medium text-pink-600 mb-1">
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
                                window.open(googleMapsUrl, '_blank');
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