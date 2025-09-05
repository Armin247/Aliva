import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Utensils, MessageCircle, ChefHat, MapPin, MoreHorizontal, User, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleGetStarted = () => {
    toast({
      title: "Welcome to Aliva! 🎉",
      description: "AI consultation is starting soon. Get ready for personalized nutrition advice!",
    });
    scrollToSection('consultation');
  };

  const handleSignIn = () => {
    toast({
      title: "Sign In Coming Soon",
      description: "User authentication will be available shortly. Thanks for your interest!",
    });
  };

  const handleFeatureClick = (feature: string) => {
    toast({
      title: `${feature} Feature`,
      description: `${feature} functionality is being developed. Stay tuned for updates!`,
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Aliva
            </span>
          </div>

          {/* Desktop Navigation - Streamlined */}
          <div className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('home')}
              className="hover:text-primary hover:bg-primary/10"
            >
              Home
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('consultation')}
              className="hover:text-primary hover:bg-primary/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Chat
            </Button>

            {/* Explore Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:text-primary hover:bg-primary/10">
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                  Explore
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Features</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => scrollToSection('restaurants')}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Restaurant Finder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection('recipes')}>
                  <ChefHat className="w-4 h-4 mr-2" />
                  Recipe Library
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Learn More</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleFeatureClick('Meal Planning')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Meal Planning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection('about')}>
                  About Aliva
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleSignIn}>
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button variant="hero" size="sm" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Streamlined */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="justify-start px-4 py-3"
                onClick={() => scrollToSection('home')}
              >
                Home
              </Button>
              
              <Button 
                variant="ghost" 
                className="justify-start px-4 py-3"
                onClick={() => scrollToSection('consultation')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Consultation
              </Button>
              
              <Button 
                variant="ghost" 
                className="justify-start px-4 py-3"
                onClick={() => scrollToSection('restaurants')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Find Restaurants
              </Button>
              
              <Button 
                variant="ghost" 
                className="justify-start px-4 py-3"
                onClick={() => scrollToSection('recipes')}
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Browse Recipes
              </Button>
              
              <div className="border-t border-border/50 pt-4 mt-4 flex flex-col space-y-2">
                <Button variant="ghost" size="sm" onClick={handleSignIn}>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button variant="hero" size="sm" onClick={handleGetStarted}>
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;