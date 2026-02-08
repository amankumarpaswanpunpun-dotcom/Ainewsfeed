import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // In a real app, this would use a mutation hook
  // For now, we simulate auth and redirect to dashboard
  const handleAuth = async (e: React.FormEvent, type: "login" | "register") => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: type === "login" ? "Welcome back!" : "Account created!",
        description: "Redirecting to your dashboard...",
      });
      
      setLocation("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary/30 p-4">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
            <Newspaper className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold">Welcome to Pulse</h1>
          <p className="text-muted-foreground mt-2">Your daily dose of what matters.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-12">
            <TabsTrigger value="login" className="text-sm font-medium">Login</TabsTrigger>
            <TabsTrigger value="register" className="text-sm font-medium">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-border/50 shadow-xl shadow-black/5">
              <form onSubmit={(e) => handleAuth(e, "login")}>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="hello@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required 
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required 
                      className="h-11"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-border/50 shadow-xl shadow-black/5">
              <form onSubmit={(e) => handleAuth(e, "register")}>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Get started with your free Pulse account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required 
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="hello@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required 
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required 
                      className="h-11"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
