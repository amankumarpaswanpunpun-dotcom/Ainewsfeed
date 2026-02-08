import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Newspaper className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">Pulse</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            News
          </Link>
          <Link 
            href="/dashboard" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link href="/auth">
            <Button size="sm" variant={isActive("/auth") ? "secondary" : "default"}>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
