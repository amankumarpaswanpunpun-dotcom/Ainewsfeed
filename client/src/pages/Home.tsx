import { Navigation } from "@/components/Navigation";
import { NewsCard } from "@/components/NewsCard";
import { useNews } from "@/hooks/use-news";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: news, isLoading, isError } = useNews();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-secondary/30">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
              Stay ahead of the <span className="text-primary relative inline-block">
                curve
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Pulse delivers the most important stories from around the globe directly to your screen. 
              Curated, fast, and always reliable.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Get Started
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  View Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-display font-bold">Latest Stories</h2>
            <div className="h-1 flex-1 bg-border ml-6 rounded-full" />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground font-medium">Curating your feed...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/10">
              <h3 className="text-xl font-bold text-destructive mb-2">Unable to load news</h3>
              <p className="text-muted-foreground">Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news?.map((article, index) => (
                <motion.div
                  key={`${article.url}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-secondary/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pulse News. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
