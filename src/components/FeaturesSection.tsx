import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, ChefHat, BarChart3, Sparkles, Shield } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Nutrition Consultation",
    description: "Get personalized dietary advice from our advanced AI powered by Gemini and ChatGPT. Ask questions, get meal plans, and receive expert guidance 24/7.",
    color: "from-primary to-primary-glow",
    delay: "0s"
  },
  {
    icon: MapPin,
    title: "Smart Restaurant Discovery",
    description: "Find healthy options at restaurants near you. Get detailed nutritional analysis and AI-recommended dishes that match your dietary goals.",
    color: "from-secondary to-secondary-glow",
    delay: "0.2s"
  },
  {
    icon: ChefHat,
    title: "Personalized Recipes",
    description: "Generate custom recipes based on your preferences, dietary restrictions, and available ingredients. Complete with step-by-step instructions.",
    color: "from-accent to-accent-glow",
    delay: "0.4s"
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your nutrition goals with beautiful charts and insights. Track calories, macros, and see your health journey unfold over time.",
    color: "from-lavender to-lavender-glow",
    delay: "0.6s"
  },
  {
    icon: Sparkles,
    title: "Meal Planning",
    description: "AI-generated weekly meal plans tailored to your lifestyle. Save time, reduce stress, and maintain consistent healthy eating habits.",
    color: "from-primary to-secondary",
    delay: "0.8s"
  },
  {
    icon: Shield,
    title: "Expert-Backed Advice",
    description: "All recommendations are based on the latest nutritional science and guidelines from registered dietitians. Trustworthy advice you can rely on.",
    color: "from-accent to-lavender",
    delay: "1s"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need for
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Optimal Nutrition
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with practical tools 
            to make healthy eating simple, enjoyable, and sustainable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white/50 backdrop-blur-sm card-hover"
                style={{ animationDelay: feature.delay }}
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  <Button variant="ghost" className="group-hover:text-primary group-hover:bg-primary/5 transition-all">
                    Learn More →
                  </Button>
                </div>
                
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Button variant="hero" size="xl">
            Start Your Health Journey
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;