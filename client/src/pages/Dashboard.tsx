import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { usePosts, useCreatePost } from "@/hooks/use-posts";
import { Loader2, Plus, PenLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { data: posts, isLoading } = usePosts();
  const createPost = useCreatePost();
  const { toast } = useToast();
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) return;

    createPost.mutate(
      { title, content, author },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Your post has been published.",
          });
          setTitle("");
          setContent("");
          setAuthor("");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Post Section - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-border/50 shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenLine className="w-5 h-5 text-primary" />
                    Create Post
                  </CardTitle>
                  <CardDescription>Share your thoughts with the world</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="What's on your mind?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author">Author Name</Label>
                      <Input
                        id="author"
                        placeholder="Your name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Write something amazing..."
                        className="min-h-[150px] bg-background resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/30"
                      disabled={createPost.isPending || !title || !content || !author}
                    >
                      {createPost.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Publish Post
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Feed Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Your Feed</h2>
              <div className="text-sm text-muted-foreground">
                {posts?.length || 0} posts
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {posts?.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border"
                    >
                      <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                    </motion.div>
                  ) : (
                    posts?.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                      >
                        <PostCard post={post} />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
