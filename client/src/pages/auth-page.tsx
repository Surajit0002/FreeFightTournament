import { useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import RegisterForm from "@/components/auth/register-form";
import LoginForm from "@/components/auth/login-form";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  
  // Set page title
  useEffect(() => {
    document.title = "Sign In | FireFight";
  }, []);
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);
  
  // If still loading or user is authenticated, don't render the form yet
  if (isLoading || user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="glassmorphic max-w-md w-full p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-orbitron mb-2">
              <span className="text-primary">Fire</span>Fight
            </h1>
            <p className="text-muted-foreground">
              Join the ultimate Free Fire tournament platform
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-background to-primary/20 items-center justify-center p-12 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1624862686653-2faed4e95a9c')] bg-cover bg-center" />
        
        <div className="glassmorphic p-8 relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold font-orbitron mb-4">
            <span className="text-white">Compete. </span>
            <span className="text-primary text-shadow-purple">Conquer. </span>
            <span className="text-secondary text-shadow-yellow">Win.</span>
          </h2>
          
          <div className="space-y-4 text-muted-foreground mb-6">
            <p>Join thousands of players in daily Free Fire tournaments and win exclusive prizes!</p>
            <p>Create or join teams, compete in solo, duo, or squad tournaments, and climb the leaderboard.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mr-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <p className="text-sm">Register your Free Fire ID</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 mr-3">
                <span className="text-secondary font-bold">2</span>
              </div>
              <p className="text-sm">Join tournaments with friends</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 mr-3">
                <span className="text-accent font-bold">3</span>
              </div>
              <p className="text-sm">Win cash prizes and rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
