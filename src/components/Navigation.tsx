import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Utensils, MessageCircle, ChefHat, User } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NutriWise Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#consultation" className="text-foreground hover:text-primary transition-colors font-medium">
              AI Consultation
            </a>
            <a href="#restaurants" className="text-foreground hover:text-primary transition-colors font-medium">
              Restaurants
            </a>
            <a href="#recipes" className="text-foreground hover:text-primary transition-colors font-medium">
              Recipes
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium px-2 py-1">
                Home
              </a>
              <a href="#consultation" className="text-foreground hover:text-primary transition-colors font-medium px-2 py-1">
                AI Consultation
              </a>
              <a href="#restaurants" className="text-foreground hover:text-primary transition-colors font-medium px-2 py-1">
                Restaurants
              </a>
              <a href="#recipes" className="text-foreground hover:text-primary transition-colors font-medium px-2 py-1">
                Recipes
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium px-2 py-1">
                About
              </a>
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button variant="hero" size="sm">
                  Get Started
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