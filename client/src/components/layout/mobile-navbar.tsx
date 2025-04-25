import { useLocation, Link } from "wouter";
import { Trophy, Home, Wallet, User, GamepadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function MobileNavbar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full bg-background border-t border-primary/30 md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link href="/">
          <a className={cn(
            "flex flex-col items-center justify-center",
            location === "/" ? "text-primary" : "text-muted-foreground"
          )}>
            <Home className="text-xl" />
            <span className="text-xs mt-1 font-rajdhani">Home</span>
          </a>
        </Link>
        
        <Link href="/tournaments">
          <a className={cn(
            "flex flex-col items-center justify-center",
            location.startsWith("/tournaments") ? "text-primary" : "text-muted-foreground"
          )}>
            <Trophy className="text-xl" />
            <span className="text-xs mt-1 font-rajdhani">Tournaments</span>
          </a>
        </Link>
        
        <div className="relative -mt-8">
          <Link href={user ? "/dashboard" : "/auth"}>
            <a className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_15px_theme(colors.primary.DEFAULT)]">
              <GamepadIcon className="text-2xl" />
            </a>
          </Link>
        </div>
        
        <Link href={user ? "/wallet" : "/auth"}>
          <a className={cn(
            "flex flex-col items-center justify-center",
            location === "/wallet" ? "text-primary" : "text-muted-foreground"
          )}>
            <Wallet className="text-xl" />
            <span className="text-xs mt-1 font-rajdhani">Wallet</span>
          </a>
        </Link>
        
        <Link href={user ? "/profile" : "/auth"}>
          <a className={cn(
            "flex flex-col items-center justify-center",
            location === "/profile" ? "text-primary" : "text-muted-foreground"
          )}>
            <User className="text-xl" />
            <span className="text-xs mt-1 font-rajdhani">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
