import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  const posts = [
    {
      title: "Building Balanced Plates with AI",
      excerpt:
        "How Aliva suggests meal compositions tailored to your goals and preferences.",
      date: "Sep 20, 2025",
    },
    {
      title: "Eating Out, Eating Well",
      excerpt:
        "Our approach to rating restaurants for health-forward choices without sacrificing flavor.",
      date: "Aug 28, 2025",
    },
    {
      title: "Privacy First Nutrition",
      excerpt:
        "A look at how we protect your data while delivering personalized insights.",
      date: "Aug 10, 2025",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-secondary/10 to-background border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Ideas, guidance, and product notes on making healthier choices, every day.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Blog;


