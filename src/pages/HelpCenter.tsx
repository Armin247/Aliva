import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HelpCenter = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-secondary/10 to-background border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Help Center</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Quick answers to common questions. Still need help? Reach out on the Contact page.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Get instant answers to common topics</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="personalization">
                  <AccordionTrigger>How does personalization work?</AccordionTrigger>
                  <AccordionContent>
                    Aliva tailors recommendations based on your preferences and goals. You can adjust inputs anytime in your profile for better results.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="restaurants">
                  <AccordionTrigger>How do you rate restaurants?</AccordionTrigger>
                  <AccordionContent>
                    We combine menu analysis with nutrition heuristics to highlight healthier options. Filters help you align choices with your targets.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="privacy">
                  <AccordionTrigger>What data do you store?</AccordionTrigger>
                  <AccordionContent>
                    We store essential data to power your experience and never sell your information. See our Privacy Policy for full details.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default HelpCenter;


