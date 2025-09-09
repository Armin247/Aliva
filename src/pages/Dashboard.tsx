import Navigation from "@/components/Navigation";
import LoginChat from "@/components/LoginChat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Salad, MapPin, ChefHat, History, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const QuickAction = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <Button variant="outline" className="justify-start gap-2">
    <Icon className="h-4 w-4 text-primary" />
    {label}
  </Button>
);

const Dashboard = () => {
  const { user, loading } = useAuth();
  if (loading || !user) return null; // handled by ProtectedRoute

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-white">
      <Navigation />
      <main className="pt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4 bg-white shadow-xl border border-black/5 rounded-[20px]">
              <LoginChat />
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <div className="font-semibold mb-3">Quick Actions</div>
              <div className="grid grid-cols-1 gap-2">
                <QuickAction icon={Salad} label="Start new consultation" />
                <QuickAction icon={MapPin} label="Find healthy restaurants" />
                <QuickAction icon={ChefHat} label="Generate a recipe" />
                <QuickAction icon={History} label="View recent chats" />
                <QuickAction icon={Settings} label="Preferences" />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


