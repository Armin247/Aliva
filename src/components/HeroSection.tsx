import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, Heart, Zap } from "lucide-react";
import heroImage from "@/assets/hero-nutrition.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Fresh nutritious foods - healthy lifestyle" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center float-animation">
          <Heart className="w-8 h-8 text-white/80" />
        </div>
        <div className="absolute top-32 right-20 w-12 h-12 bg-accent/20 backdrop-blur-sm rounded-full flex items-center justify-center float-animation" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-6 h-6 text-white/80" />
        </div>
        <div className="absolute bottom-32 left-20 w-14 h-14 bg-lavender/20 backdrop-blur-sm rounded-full flex items-center justify-center float-animation" style={{ animationDelay: '0.5s' }}>
          <Zap className="w-7 h-7 text-white/80" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-accent-glow to-lavender-glow bg-clip-text text-transparent">
              Nutrition Expert
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized dietary advice, discover healthy restaurants, and master home cooking 
            with the power of advanced AI. Your journey to optimal health starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="glass" size="xl" className="group">
              <MessageCircle className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start AI Consultation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="glass rounded-xl p-6 backdrop-blur-md">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/80">Happy Users</div>
            </div>
            <div className="glass rounded-xl p-6 backdrop-blur-md">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/80">Healthy Recipes</div>
            </div>
            <div className="glass rounded-xl p-6 backdrop-blur-md">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;