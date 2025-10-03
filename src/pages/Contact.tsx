import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 to-background border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Contact</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Have questions, feedback, or partnership ideas? We’d love to hear from you.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                We typically respond within 1–2 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Full name" />
                  <Input type="email" placeholder="Email address" />
                </div>
                <Input placeholder="Subject" />
                <Textarea placeholder="How can we help?" className="min-h-[120px]" />
                <div>
                  <Button type="button">Send message</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Contact;


