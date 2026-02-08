import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Post } from "@shared/schema";

export function PostCard({ post }: { post: Post }) {
  // Generate initials for avatar
  const initials = post.author
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-card hover:bg-accent/5 transition-colors border-border/50">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-6 pb-3">
        <Avatar className="h-10 w-10 border-2 border-primary/10">
          <AvatarFallback className="bg-primary/5 text-primary font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium leading-none text-foreground">{post.author}</p>
            <p className="text-xs text-muted-foreground">
              {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">{post.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
