import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, Salad, Sparkles, User, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  logo?: string; // simple emoji/logo or image url
};

const GREEN_BUBBLE = "bg-primary/10 text-foreground";
const WHITE_BUBBLE = "bg-white text-foreground";

function extractDish(message: string): string | null {
  const lower = message.toLowerCase();
  const dishes = [
    "noodles",
    "jollof rice",
    "fried rice",
    "rice",
    "salad",
    "soup",
    "oatmeal",
    "porridge",
    "yogurt",
    "fish",
    "chicken",
    "plantain",
    "smoothie",
    "grilled fish",
  ];
  const found = dishes.find(d => lower.includes(d));
  return found || null;
}

function detectConditions(message: string): string[] {
  const lower = message.toLowerCase();
  const conditions: string[] = [];
  if (/(ulcer|acid reflux|heartburn)/.test(lower)) conditions.push("ulcer");
  if (/(diabetes|blood sugar)/.test(lower)) conditions.push("diabetes");
  if (/(hypertension|high blood pressure)/.test(lower)) conditions.push("hypertension");
  if (/(pregnan)/.test(lower)) conditions.push("pregnancy");
  return conditions;
}

function getAdvice({ conditions, desiredDish }: { conditions: string[]; desiredDish?: string | null; }): string {
  if (conditions.includes("ulcer")) {
    if (desiredDish && /noodles/.test(desiredDish)) {
      return "You mentioned an ulcer. If you choose noodles, go for soft, non‑spicy noodles with a mild broth, avoid pepper/citrus, and eat smaller portions. Would you like me to find places that offer mild noodles near you?";
    }
    return "Since you mentioned an ulcer, prefer bland options like oatmeal, bananas, yogurt bowls, rice with steamed veggies, or mild soups. If you have a dish in mind, tell me and I’ll adapt it.";
  }
  if (conditions.includes("diabetes")) {
    return "For diabetes, prioritize high‑fiber, low‑GI meals: grilled fish with veggies, salads with lean protein, brown rice bowls. Tell me what you’re craving and I’ll tailor it.";
  }
  if (conditions.includes("hypertension")) {
    return "For hypertension, look for low‑sodium options: grilled proteins, steamed veggies, fruits, whole grains. I can find heart‑friendly options nearby.";
  }
  return "Tell me how you feel or what you crave and I’ll suggest balanced options. You can say things like ‘I’m tired and want something quick’ or ‘Suggest a light dinner’.";
}

function isSearchTrigger(message: string): boolean {
  const lower = message.toLowerCase();
  return /\b(search|find|order|get me|where|nearby|restaurants|place to buy)\b/.test(lower);
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
  const [agreedDish, setAgreedDish] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [openRestaurants, setOpenRestaurants] = useState<RestaurantResult[] | null>(null);

  useEffect(() => {
    // initial greeting
    setMessages([
      {
        role: "assistant",
        content:
          "Hi, I’m Aliva. Tell me how you feel and what you’re craving. I’ll suggest meals. When you’re ready, say ‘find restaurants’ and I’ll show nearby options.",
      },
    ]);
  }, []);

  useEffect(() => {
    // auto scroll
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const quickPrompts = useMemo(
    () => [
      "I have ulcer and my stomach hurts",
      "Suggest a light dinner",
      "I’m tired, want something quick",
      "Find restaurants",
    ],
    []
  );

  const handleSend = async () => {
    const text = input.trim();
    if (!text || thinking) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    const conditions = detectConditions(text);
    const mentionedDish = extractDish(text);

    // capture agreement like: "I agree to have noodles" or "let's do noodles"
    if (mentionedDish && /(agree|let's|lets|ok|okay|fine|go with)/i.test(text)) {
      setAgreedDish(mentionedDish);
    }

    // search trigger
    if (isSearchTrigger(text)) {
      const dish = mentionedDish || agreedDish || "healthy meal";
      const results = makeRestaurantResults(dish);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: `Great. Here are places for ${dish}. I’ve prioritized healthy, mild options where possible.`,
          },
        ]);
        setOpenRestaurants(results);
        setThinking(false);
      }, 600);
      return;
    }

    const advice = getAdvice({ conditions, desiredDish: mentionedDish || agreedDish });
    const assistantMsg: ChatMessage = { role: "assistant", content: advice };

    setTimeout(() => {
      setMessages(prev => [...prev, assistantMsg]);
      setThinking(false);
    }, 450);
  };

  return (
    <>
      <Card className="p-4 sm:p-5 bg-white border-0 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Salad className="h-4 w-4 text-white" />
          </div>
          <div className="font-semibold">Chat with Aliva</div>
          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">Beta</Badge>
        </div>

        <Separator className="mb-3" />

        <div className="h-[260px] sm:h-[380px] md:h-[420px] rounded-lg border border-primary/10 bg-muted/10">
          <ScrollArea className="h-full w-full">
            <div ref={listRef} className="p-3 sm:p-4 space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role !== "user" && (
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback className="bg-primary text-white"><Bot className="h-3.5 w-3.5" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 border ${m.role === "user" ? WHITE_BUBBLE + " border-primary/10" : GREEN_BUBBLE + " border-primary/20"}`}>
                    <div className="text-sm leading-relaxed">{m.content}</div>
                  </div>
                  {m.role === "user" && (
                    <Avatar className="h-7 w-7 ml-2">
                      <AvatarFallback className="bg-primary/10 text-primary"><User className="h-3.5 w-3.5" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 border ${GREEN_BUBBLE} border-primary/20`}>
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 animate-spin text-primary" />
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Describe how you feel or what you crave..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="h-11 bg-white border-primary/20 focus:border-primary/40"
          />
          <Button onClick={handleSend} disabled={!input.trim() || thinking} variant="hero" className="px-4">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {quickPrompts.map((q, i) => (
            <Button key={i} size="sm" variant="outline" className="text-xs hover:bg-primary/10 hover:text-primary border-primary/20" onClick={() => setInput(q)}>
              {q}
            </Button>
          ))}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Tip: say <span className="font-medium text-primary">find restaurants</span> to browse places for the agreed meal.
        </div>
      </Card>

      {/* Desktop: removed modal per request */}

      {/* Mobile bottom sheet */}
      <div>
        <Sheet open={!!openRestaurants} onOpenChange={(v) => !v && setOpenRestaurants(null)}>
          <SheetContent side="bottom" className="rounded-t-2xl p-4 h-[80vh]">
            <SheetHeader>
              <SheetTitle>Restaurants</SheetTitle>
            </SheetHeader>
            <div className="space-y-3 max-h-[60vh] overflow-auto pt-2">
              {openRestaurants?.map((r, i) => (
                <div key={i} className="rounded-lg border flex overflow-hidden min-h-[116px]">
                  <div className="w-16 bg-primary/5 flex items-center justify-center rounded-l-lg text-2xl">
                    {r.logo || "🍽️"}
                  </div>
                  <div className="flex-1 p-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.dish} • {r.price} • {r.rating.toFixed(1)}★</div>
                      <div className="text-xs text-muted-foreground mt-1">Healthy picks available</div>
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
      </div>
    </>
  );
};

export default LoginChat;


