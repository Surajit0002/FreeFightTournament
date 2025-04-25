import { useLocation } from "wouter";
import { Trophy, Home, Wallet, User, GamepadIcon, Zap, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function MobileNavbar() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  // Navigation helper function
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full bg-background border-t border-primary/30 md:hidden">
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => navigateTo("/")}
          className={cn(
            "flex flex-col items-center justify-center",
            location === "/" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="text-xl" />
          <span className="text-xs mt-1 font-rajdhani">Home</span>
        </button>
        
        <button 
          onClick={() => navigateTo("/tournaments")}
          className={cn(
            "flex flex-col items-center justify-center",
            location.startsWith("/tournaments") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Trophy className="text-xl" />
          <span className="text-xs mt-1 font-rajdhani">Tournaments</span>
        </button>
        
        <div className="relative -mt-8">
          <button 
            onClick={() => navigateTo(user ? "/dashboard" : "/auth")}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-[0_0_15px_theme(colors.primary.DEFAULT)] animate-pulse-glow relative"
          >
            <GamepadIcon className="text-2xl" />
            <Zap className="h-4 w-4 absolute -top-1 -right-1 text-yellow-400" />
          </button>
        </div>
        
        <button 
          onClick={() => navigateTo(user ? "/wallet" : "/auth")}
          className={cn(
            "flex flex-col items-center justify-center",
            location === "/wallet" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Wallet className="text-xl" />
          <span className="text-xs mt-1 font-rajdhani">Wallet</span>
        </button>
        
        <button 
          onClick={() => navigateTo(user ? "/leaderboard" : "/auth")}
          className={cn(
            "flex flex-col items-center justify-center",
            location === "/leaderboard" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <BarChart3 className="text-xl" />
          <span className="text-xs mt-1 font-rajdhani">Ranks</span>
        </button>
      </div>
    </nav>
  );
}
