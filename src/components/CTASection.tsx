import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <Sparkles className="w-16 h-16 text-white/80 mx-auto mb-6 animate-pulse-glow" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Start Your Health Transformation
            <span className="block text-white/90">Today</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of people who've already transformed their relationship with food. 
            Your AI nutrition expert is ready to help you achieve your health goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button 
            variant="glass" 
            size="xl" 
            className="group text-lg px-8 py-4 bg-white/20 hover:bg-white/30 border-white/30"
          >
            <MessageCircle className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            Start Free Consultation
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="xl" 
            className="text-lg px-8 py-4 bg-transparent border-2 border-white/30 text-white hover:bg-white/10"
          >
            Watch How It Works
          </Button>
        </div>

        <div className="glass rounded-2xl p-8 backdrop-blur-md bg-white/10 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">Free</div>
              <div className="text-white/80 text-sm">No credit card required</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80 text-sm">AI support available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">Instant</div>
              <div className="text-white/80 text-sm">Get started immediately</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;