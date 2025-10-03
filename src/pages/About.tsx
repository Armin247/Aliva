import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 to-background border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">About Aliva</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We believe better nutrition should be accessible, delightful, and deeply personal. Aliva blends
              AI with expert guidance to help you discover healthier choices, plan meals, and build lasting
              habits—without friction.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Empower every person to eat well with confidence and convenience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                From tailored recommendations to smart restaurant discovery, we turn nutrition science into
                everyday decisions you can trust.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Approach</CardTitle>
              <CardDescription>
                Personalized, privacy-first, and grounded in evidence-based nutrition.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We combine your preferences and goals with verified data sources to deliver practical
                guidance that fits your lifestyle.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Impact</CardTitle>
              <CardDescription>
                Helping users make millions of healthier choices—one bite at a time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We measure success by sustained habits, not short-term trends. Progress should feel simple,
                supportive, and sustainable.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Card>
            <CardHeader>
              <CardTitle>What We’re Building</CardTitle>
              <CardDescription>
                The modern nutrition companion for everyday life.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-4 list-disc pl-5 text-sm text-muted-foreground">
                <li>Personalized meal planning with adaptive recommendations</li>
                <li>Restaurant discovery with health-forward filters</li>
                <li>Actionable insights built on verified nutrition data</li>
                <li>Privacy-first design and transparent controls</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default About;


