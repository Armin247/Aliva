import { Button } from "@/components/ui/button";
import { Utensils, MessageCircle, MapPin, ChefHat, Mail, Phone, MapPin as Location } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NutriWise Pro
              </span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your AI-powered nutrition platform for personalized dietary advice, 
              healthy restaurant discovery, and custom meal planning.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="hover:text-primary">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary">
                <Location className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Features</h3>
            <ul className="space-y-4">
              <li>
                <a href="#consultation" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  AI Consultation
                </a>
              </li>
              <li>
                <a href="#restaurants" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Restaurant Discovery
                </a>
              </li>
              <li>
                <a href="#recipes" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <ChefHat className="w-4 h-4 mr-2" />
                  Custom Recipes
                </a>
              </li>
              <li>
                <a href="#meal-planning" className="text-muted-foreground hover:text-primary transition-colors">
                  Meal Planning
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#careers" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <a href="#help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#security" className="text-muted-foreground hover:text-primary transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">
              © 2024 NutriWise Pro. All rights reserved. Made with ❤️ for healthier living.
            </p>
            <div className="flex space-x-6">
              <a href="#privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;