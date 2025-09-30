import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section id="home" className="relative min-h-[84vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden bg-primary bg-gradient-to-b from-primary/95 via-primary/90 to-primary pb-28 md:pb-40">
      {/* Clean grid background (no image) */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 md:pt-36">
        <h1 className="text-4xl md:text-[64px] lg:text-[84px] font-bold text-white leading-[1.05] tracking-tight">
          Smarter Nutrition
          <span className="block">Begins Here with Aliva</span>
        </h1>
        <p className="mt-6 text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
          Chat with an AI nutritionist, then discover restaurants or recipes that fit you.
        </p>
        <div className="mt-8 md:mt-12 flex flex-row flex-wrap items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full px-4 bg-gradient-to-b from-primary-dark to-primary/95 text-white border-0 shadow-md"
            onClick={handleGetStarted}
          >
            <MessageCircle className="w-5 h-5 mr-2" /> Get Started Now
          </Button>
        </div>

        {/* Stats */}
        
      </div>
      {/* Bottom fade-to-background gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
};

export default HeroSection;