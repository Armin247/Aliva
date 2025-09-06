import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ChatPreviewSection from "@/components/ChatPreviewSection";
import StatsSection from "@/components/StatsSection";
import TestimonialBanner from "@/components/TestimonialBanner";
import BenefitsSection from "@/components/BenefitsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
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