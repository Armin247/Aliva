import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 to-background border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Your privacy matters. This policy explains what we collect, why we collect it, and how you can control it.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
              <CardDescription>What data we store and why</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Account details you provide (e.g., email, name)</li>
                <li>Preferences and dietary goals for personalization</li>
                <li>Usage data to improve product performance and stability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Information</CardTitle>
              <CardDescription>Delivering a better, safer experience</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Personalize recommendations and content</li>
                <li>Maintain security and prevent abuse</li>
                <li>Analyze aggregated usage to guide product improvements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Choices</CardTitle>
              <CardDescription>Control over your data</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Update or delete your account data at any time</li>
                <li>Adjust personalization inputs from your profile</li>
                <li>Contact us for data export or deletion requests</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default PrivacyPolicy;


