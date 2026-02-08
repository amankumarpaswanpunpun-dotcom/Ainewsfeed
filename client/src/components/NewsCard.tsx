import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { z } from "zod";
import { api } from "@shared/routes";

// Infer types from the API response schema directly
type NewsItem = z.infer<typeof api.news.list.responses[200]>[number];

interface NewsCardProps {
  article: NewsItem;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="group h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {article.urlToImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {article.source?.name || 'News'}
          </span>
          <span className="text-xs text-muted-foreground">
            {article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : ""}
          </span>
        </div>
        <h3 className="font-display text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-5 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {article.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 mt-auto">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Read full story <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
}
