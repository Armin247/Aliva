import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, MessageCircle, ChefHat, MapPin, MoreHorizontal, User, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleAuthAction = () => {
    if (user) {
      signOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
    } else {
      navigate('/auth');
    }
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
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <div className="flex items-center justify-center group-hover:scale-110 transition-transform">
              <img 
                src="/logo.svg" 
                alt="Aliva Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback in case logo.svg is not found
                  console.warn("Logo image not found, check if /logo.svg exists in public folder");
                }}
              />
            </div>
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user.user_metadata?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleFeatureClick('Profile')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAuthAction}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleAuthAction}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
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
                {user ? (
                  <Button variant="ghost" size="sm" onClick={handleAuthAction}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={handleAuthAction}>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
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