import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";

const Blog = () => {
  const posts = [
    {
      title: "Building Balanced Plates with AI",
      excerpt:
        "How Aliva suggests meal compositions tailored to your goals and preferences.",
      date: "Sep 20, 2025",
      category: "Guides",
    },
    {
      title: "Eating Out, Eating Well",
      excerpt:
        "Our approach to rating restaurants for health-forward choices without sacrificing flavor.",
      date: "Aug 28, 2025",
      category: "Product",
    },
    {
      title: "Privacy First Nutrition",
      excerpt:
        "A look at how we protect your data while delivering personalized insights.",
      date: "Aug 10, 2025",
      category: "Security",
    },
  ];

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesQuery = `${p.title} ${p.excerpt}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [posts, query, category]);

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

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
            <Input
              placeholder="Search posts"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:max-w-sm"
            />
            <div className="flex items-center gap-2">
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Guides">Guides</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setCategory("All")}>All</TabsTrigger>
              <TabsTrigger value="product" onClick={() => setCategory("Product")}>Product</TabsTrigger>
              <TabsTrigger value="guides" onClick={() => setCategory("Guides")}>Guides</TabsTrigger>
              <TabsTrigger value="security" onClick={() => setCategory("Security")}>Security</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {filtered.map((post) => (
                  <Card key={post.title} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription>{post.date} · {post.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
                {filtered.length === 0 && (
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>No results</CardTitle>
                      <CardDescription>Try a different search or category.</CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Blog;


