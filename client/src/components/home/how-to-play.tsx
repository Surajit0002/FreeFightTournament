import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HelpCircle, UserPlus, Search, GamepadIcon, Trophy } from "lucide-react";

export default function HowToPlay() {
  return (
    <section className="py-12 container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-8 flex items-center">
        <HelpCircle className="text-secondary mr-3" />
        How to Play
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glassmorphic rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mb-4">
            <UserPlus className="text-primary text-xl" />
          </div>
          <h3 className="text-lg font-bold mb-2 font-rajdhani">1. Register</h3>
          <p className="text-muted-foreground text-sm">
            Create your account and set up your gaming profile with your Free Fire ID.
          </p>
        </div>
        
        <div className="glassmorphic rounded-xl p-6 hover:border-secondary/50 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 mb-4">
            <Search className="text-secondary text-xl" />
          </div>
          <h3 className="text-lg font-bold mb-2 font-rajdhani">2. Find Tournament</h3>
          <p className="text-muted-foreground text-sm">
            Browse available tournaments and choose one that matches your skill level.
          </p>
        </div>
        
        <div className="glassmorphic rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 mb-4">
            <GamepadIcon className="text-accent text-xl" />
          </div>
          <h3 className="text-lg font-bold mb-2 font-rajdhani">3. Join & Play</h3>
          <p className="text-muted-foreground text-sm">
            Enter the tournament, join the match room with ID & password, and show your skills.
          </p>
        </div>
        
        <div className="glassmorphic rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mb-4">
            <Trophy className="text-primary text-xl" />
          </div>
          <h3 className="text-lg font-bold mb-2 font-rajdhani">4. Win Rewards</h3>
          <p className="text-muted-foreground text-sm">
            Finish in top positions to win coins or cash prizes that you can withdraw.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <Link href="/how-to-play">
          <Button variant="outline" className="px-6 py-3 border-secondary/50 text-secondary hover:bg-secondary/10 transition-colors inline-flex items-center">
            <BookOpen className="mr-2" size={16} /> View Complete Rules
          </Button>
        </Link>
      </div>
    </section>
  );
}

// SVG icon
const BookOpen = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
