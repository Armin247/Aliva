import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ChatPreviewSection from "@/components/ChatPreviewSection";
import StatsSection from "@/components/StatsSection";
import TestimonialBanner from "@/components/TestimonialBanner";
import BenefitsSection from "@/components/BenefitsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  console.log('Index page rendering');
  return (
    <div className="min-h-screen">
      <div className="bg-blue-500 text-white p-4 text-center font-bold">Index page is rendering!</div>
      <Navigation />
      <HeroSection />
      <ChatPreviewSection />
      <BenefitsSection />
      <StatsSection />
      <TestimonialBanner />
      <FooterSection />
    </div>
  );
};

export default Index;