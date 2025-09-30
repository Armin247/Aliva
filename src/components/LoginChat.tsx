import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, Salad, Sparkles, User, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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

const GREEN_BUBBLE = "bg-primary/10 text-foreground";
const WHITE_BUBBLE = "bg-white text-foreground";

function extractDish(message: string): string | null {
  const lower = message.toLowerCase();
  const dishes = [
    "noodles", "jollof rice", "fried rice", "rice", "salad", "soup", 
    "oatmeal", "porridge", "yogurt", "fish", "chicken", "plantain", 
    "smoothie", "grilled fish", "pasta", "bread", "beans", "yam"
  ];
  const found = dishes.find(d => lower.includes(d));
  return found || null;
}

function isSearchTrigger(message: string): boolean {
  const lower = message.toLowerCase();
  const searchWords = ["search", "find", "order", "get me", "where", "nearby", "restaurants", "place to buy", "show me places"];
  return searchWords.some(word => lower.includes(word));
}

function makeRestaurantResults(dish: string): RestaurantResult[] {
  const base: RestaurantResult[] = [
    { name: "Green Garden Bistro", eta: "18–25 min", rating: 4.8, price: "$$", distanceKm: 2.1, dish, logo: "🥗" },
    { name: "Fresh & Fit Kitchen", eta: "12–20 min", rating: 4.6, price: "$", distanceKm: 1.3, dish, logo: "🥙" },
    { name: "Nourish Bowl Co.", eta: "20–30 min", rating: 4.9, price: "$$", distanceKm: 2.9, dish, logo: "🍜" },
  ];
  return base;
}

const LoginChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [openRestaurants, setOpenRestaurants] = useState<RestaurantResult[] | null>(null);

  useEffect(() => {
    // Initial greeting from Aliva
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm Aliva, your AI nutritionist. I'm here to help you make healthier food choices based on your needs and any health conditions you may have. Tell me how you're feeling today or what you'd like to eat, and I'll provide personalized recommendations.",
      },
    ]);
  }, []);

  useEffect(() => {
    // Auto scroll to bottom
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const quickPrompts = useMemo(
    () => [
      "I have ulcer and my stomach hurts",
      "Suggest a healthy breakfast",
      "I'm diabetic, what can I eat?",
      "Find restaurants near me",
    ],
    []
  );

  const callOpenAI = async (userMessage: string, chatHistory: ChatMessage[]) => {
    try {
      console.log('🔄 Making API call to:', 'http://localhost:5000/api/chat');
      console.log('📨 Sending message:', userMessage);
      
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: chatHistory.slice(-10) // Keep last 10 messages for context
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to get AI response`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      return data.response || data.fallbackResponse;
    } catch (error) {
      console.error('❌ Error calling OpenAI:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  };

  const getFallbackResponse = (text: string): string => {
    let fallbackResponse = "I'm here to help with your nutrition needs. ";
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('ulcer') || lowerText.includes('stomach') || lowerText.includes('acid')) {
      fallbackResponse += "For stomach issues, try bland foods like oatmeal, bananas, and lean proteins. Avoid spicy, acidic, or fried foods.";
    } else if (lowerText.includes('diabetes') || lowerText.includes('sugar')) {
      fallbackResponse += "For diabetes management, focus on high-fiber foods, lean proteins, and complex carbohydrates. Avoid refined sugars and processed foods.";
    } else if (lowerText.includes('tired') || lowerText.includes('energy') || lowerText.includes('weak')) {
      fallbackResponse += "For energy, try iron-rich foods like leafy greens, nuts, and lean meats, combined with vitamin C sources for better absorption.";
    } else {
      fallbackResponse += "Could you tell me more about your dietary needs or any health conditions I should consider?";
    }
    
    return fallbackResponse;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || thinking) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    setError(null);

    // Check if user wants to search for restaurants
    if (isSearchTrigger(text)) {
      const mentionedDish = extractDish(text);
      const dish = mentionedDish || "healthy meal";
      const results = makeRestaurantResults(dish);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: `Great! I've found some restaurants near you that offer ${dish}. I've prioritized places that typically have healthier options. You can also ask me about specific dietary modifications for any dish you're interested in.`,
          },
        ]);
        setOpenRestaurants(results);
        setThinking(false);
      }, 1000);
      return;
    }

    try {
      // Get AI response from OpenAI
      const aiResponse = await callOpenAI(text, messages);
      
      const assistantMsg: ChatMessage = { 
        role: "assistant", 
        content: aiResponse 
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setError("Sorry, I'm having trouble connecting right now. Please try again in a moment.");
      
      // Provide fallback response
      const fallbackResponse = getFallbackResponse(text);

      const assistantMsg: ChatMessage = { 
        role: "assistant", 
        content: fallbackResponse 
      };

      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      <Card className="p-0 sm:p-5 md:p-5 bg-transparent md:bg-white border-0 shadow-none md:shadow-xl rounded-none md:rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Salad className="h-4 w-4 text-white" />
          </div>
          <div className="font-semibold">Chat with Aliva</div>
          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">
            AI Nutritionist
          </Badge>
        </div>

        <Separator className="mb-3 hidden md:block" />

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="h-[260px] sm:h-[380px] md:h-[420px] rounded-lg border border-primary/10 bg-muted/10">
          <ScrollArea className="h-full w-full">
            <div ref={listRef} className="p-3 sm:p-4 space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role !== "user" && (
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback className="bg-primary text-white">
                        <Bot className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 border ${
                    m.role === "user" 
                      ? WHITE_BUBBLE + " border-primary/10" 
                      : GREEN_BUBBLE + " border-primary/20"
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                  </div>
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
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 border ${GREEN_BUBBLE} border-primary/20`}>
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

        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Tell me about your health concerns or what you'd like to eat..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="h-11 bg-white border-primary/20 focus:border-primary/40"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || thinking} 
            variant="hero" 
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {quickPrompts.map((q, i) => (
            <Button 
              key={i} 
              size="sm" 
              variant="outline" 
              className="text-xs hover:bg-primary/10 hover:text-primary border-primary/20" 
              onClick={() => setInput(q)}
              disabled={thinking}
            >
              {q}
            </Button>
          ))}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          💡 Tip: Mention any health conditions, dietary restrictions, or how you're feeling for personalized advice.
        </div>
      </Card>

      {/* Mobile bottom sheet for restaurants */}
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
    </>
  );
};

export default LoginChat;