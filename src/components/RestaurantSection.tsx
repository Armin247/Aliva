import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RestaurantSection = () => {
  const { toast } = useToast();

  const handleRestaurantSearch = () => {
    toast({
      title: "Restaurant Search Coming Soon! 🍽️",
      description: "We're building an amazing restaurant discovery feature with AI-powered nutrition analysis.",
    });
  };

  const sampleRestaurants = [
    {
      name: "Green Garden Bistro",
      cuisine: "Mediterranean",
      rating: 4.8,
      time: "25 min",
      price: "$$",
      healthyOptions: 12,
      image: "🥗"
    },
    {
      name: "Fresh & Fit Kitchen",
      cuisine: "Healthy American",
      rating: 4.6,
      time: "18 min",
      price: "$",
      healthyOptions: 8,
      image: "🥙"
    },
    {
      name: "Nourish Bowl Co.",
      cuisine: "Asian Fusion",
      rating: 4.9,
      time: "30 min",
      price: "$$",
      healthyOptions: 15,
      image: "🍜"
    }
  ];

  return (
    <section id="restaurants" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Discover Healthy
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Restaurant Options
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find nutritious meals at restaurants near you. Get AI-powered recommendations 
            for the healthiest dishes that match your dietary goals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter your location..."
                className="pl-10 h-12 bg-white/70 border-primary/20 focus:border-primary/40"
              />
            </div>
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleRestaurantSearch}
              className="px-8"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Restaurants
            </Button>
          </div>
        </div>

        {/* Sample Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleRestaurants.map((restaurant, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm card-hover">
              <div className="p-6">
                <div className="text-4xl mb-4 text-center">{restaurant.image}</div>
                
                <h3 className="text-xl font-bold mb-2 text-foreground">{restaurant.name}</h3>
                
                <p className="text-muted-foreground mb-4">{restaurant.cuisine}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{restaurant.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{restaurant.price}</span>
                  </div>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-3 mb-4">
                  <p className="text-sm text-primary font-medium">
                    ✨ {restaurant.healthyOptions} AI-recommended healthy options
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                  onClick={() => toast({
                    title: `${restaurant.name}`,
                    description: "Menu analysis and ordering will be available soon!",
                  })}
                >
                  View Healthy Menu
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="xl" onClick={handleRestaurantSearch}>
            Explore More Restaurants
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;