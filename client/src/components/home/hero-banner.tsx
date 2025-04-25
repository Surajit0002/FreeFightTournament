import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GamepadIcon, Video } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative h-[60vh] md:h-[80vh]">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1624862686653-2faed4e95a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background"></div>
      
      {/* Hero content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold font-orbitron mb-4 leading-tight">
          <span className="text-white">Compete. </span>
          <span className="text-primary text-shadow-purple">Conquer. </span>
          <span className="text-secondary text-shadow-yellow">Win.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl font-rajdhani">
          Join the biggest Free Fire tournaments and win exclusive prizes
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/tournaments">
            <Button className="btn-glow px-8 py-3 flex items-center justify-center transition-all duration-300 animate-pulse-glow">
              <GamepadIcon className="mr-2" /> JOIN TOURNAMENT
            </Button>
          </Link>
          
          <Link href="/how-to-play">
            <Button variant="outline" className="px-8 py-3 border-secondary/50 text-secondary hover:bg-secondary/10 transition-colors">
              <Video className="mr-2" /> HOW TO PLAY
            </Button>
          </Link>
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-12">
          <div className="flex items-center">
            <div className="text-2xl text-primary mr-3">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold font-rajdhani text-white">50K+</p>
              <p className="text-sm text-muted-foreground">Active Players</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-2xl text-secondary mr-3">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold font-rajdhani text-white">₹10L+</p>
              <p className="text-sm text-muted-foreground">Prize Pool</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-2xl text-accent mr-3">
              <Swords className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold font-rajdhani text-white">100+</p>
              <p className="text-sm text-muted-foreground">Daily Matches</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// SVG icons
const User = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Award = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const Swords = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline>
    <line x1="13" y1="19" x2="19" y2="13"></line>
    <line x1="16" y1="16" x2="20" y2="20"></line>
    <line x1="19" y1="21" x2="21" y2="19"></line>
    <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline>
    <line x1="5" y1="14" x2="9" y2="18"></line>
    <line x1="7" y1="17" x2="4" y2="20"></line>
    <line x1="3" y1="19" x2="5" y2="21"></line>
  </svg>
);
