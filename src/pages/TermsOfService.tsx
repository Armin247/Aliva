import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-secondary/10 to-background border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Please read these terms carefully before using Aliva.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
              <CardDescription>By using Aliva, you agree to these terms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Using our services constitutes acceptance of these Terms and our Privacy Policy. If you do not agree, please discontinue use.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Use of Service</CardTitle>
              <CardDescription>Personal, non-commercial use unless otherwise agreed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You may not misuse the service, attempt unauthorized access, or infringe on the rights of others. We may suspend accounts violating these terms.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Disclaimers</CardTitle>
              <CardDescription>Informational purposes only</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aliva provides guidance for educational purposes and is not a substitute for professional medical advice. Always consult qualified professionals for health decisions.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default TermsOfService;


