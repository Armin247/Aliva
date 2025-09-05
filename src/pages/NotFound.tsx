import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            It seems like this page got lost on its way to better nutrition. 
            Don't worry, we'll help you find what you're looking for!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="lg" asChild>
            <a href="/">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </a>
          </Button>
          <Button variant="outline" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Search Recipes
          </Button>
        </div>

        <div className="mt-12 glass rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            While you're here, did you know?
          </h3>
          <p className="text-muted-foreground">
            Our AI nutrition expert can help you find healthy alternatives to your favorite foods, 
            create personalized meal plans, and discover nutritious recipes that match your taste preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;