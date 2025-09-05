import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConsultationSection = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setIsTyping(true);
    toast({
      title: "AI Consultation Starting! 🤖",
      description: "Your personal nutrition expert is analyzing your question...",
    });
    
    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      toast({
        title: "Response Ready! ✨",
        description: "Your AI nutritionist has prepared personalized advice for you.",
      });
      setMessage("");
    }, 2000);
  };

  return (
    <section id="consultation" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ask Your AI
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nutrition Expert
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get instant, personalized nutrition advice powered by advanced AI. 
            Ask about meal planning, dietary restrictions, or healthy restaurant options.
          </p>
        </div>

        <Card className="p-8 bg-white/50 backdrop-blur-sm border-0 shadow-xl">
          {/* Chat Interface Preview */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-primary/10 rounded-2xl rounded-tl-sm p-4 max-w-md">
                <p className="text-sm text-foreground">
                  Hello! I'm your AI nutrition expert. I can help you with meal planning, 
                  dietary advice, restaurant recommendations, and healthy recipes. What would you like to know?
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-accent/10 rounded-2xl rounded-tr-sm p-4 max-w-md">
                <p className="text-sm text-foreground">
                  I'm trying to lose weight but I love eating out. Can you help me find healthy options?
                </p>
              </div>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-primary/10 rounded-2xl rounded-tl-sm p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex space-x-3">
            <Input
              placeholder="Ask about nutrition, recipes, or healthy restaurants..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 h-12 bg-white/70 border-primary/20 focus:border-primary/40"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              variant="hero"
              size="lg"
              className="px-6"
            >
              {isTyping ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Quick Questions */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Plan my meals for the week",
                "Find healthy restaurants nearby",
                "Suggest a keto-friendly recipe",
                "Calculate my daily calories"
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage(question)}
                  className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ConsultationSection;