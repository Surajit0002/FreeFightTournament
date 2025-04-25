import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GamepadIcon, Video, Zap, Trophy, ChevronsRight, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HeroBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  // Set visibility with animation delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Countdown timer for upcoming tournament
  useEffect(() => {
    // Set target date to 48 hours from now
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 48);
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(interval);
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown({ hours, minutes, seconds });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative min-h-[90vh] cyber-bg overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background"></div>
      
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/20 animate-float"
            style={{
              width: `${Math.random() * 50 + 10}px`,
              height: `${Math.random() * 50 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>
      
      {/* Hero content */}
      <div className="relative container mx-auto px-4 py-20 min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <Badge className="mb-4 px-4 py-1.5 bg-primary/20 text-primary border-primary/30 animate-pulse">
              <Zap className="h-4 w-4 mr-2" /> NEXT MAJOR TOURNAMENT
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold font-orbitron mb-6 leading-tight">
              <span className="text-white">Dominate The </span>
              <span className="gradient-text">Battlefield</span>
            </h1>
            
            <p className="text-xl text-foreground mb-6 max-w-2xl font-rajdhani">
              Join the ultimate Free Fire competitive experience. Showcase your skills, build your team, and compete for massive prize pools.
            </p>
            
            {/* Countdown timer */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2 flex items-center">
                <Timer className="h-4 w-4 mr-2" /> WEEKEND WAR STARTS IN:
              </p>
              <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold font-rajdhani bg-primary/20 border border-primary/30 rounded-lg px-4 py-2 w-16 text-center neon-border">
                    {String(countdown.hours).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">HOURS</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold font-rajdhani bg-primary/20 border border-primary/30 rounded-lg px-4 py-2 w-16 text-center neon-border">
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">MINUTES</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold font-rajdhani bg-primary/20 border border-primary/30 rounded-lg px-4 py-2 w-16 text-center neon-border">
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">SECONDS</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="btn-3d px-8 py-6 flex items-center justify-center neon-border"
                onClick={() => window.location.href = "/tournaments"}
              >
                <GamepadIcon className="mr-2" /> JOIN TOURNAMENT
              </Button>
              
              <Button 
                variant="outline" 
                className="px-8 py-6 border-secondary/50 text-secondary hover:bg-secondary/10 transition-colors shine-effect"
                onClick={() => window.location.href = "/how-to-play"}
              >
                <Video className="mr-2" /> HOW TO PLAY
              </Button>
            </div>
          </div>
          
          {/* Stats and visual elements */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Main circle */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse-glow flex items-center justify-center">
                <div className="relative w-[80%] h-[80%] rounded-full overflow-hidden glassmorphic-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Trophy className="h-16 w-16 text-secondary mb-4 animate-float" />
                    <h3 className="text-2xl font-bold font-orbitron mb-2 text-shadow-yellow">GRAND PRIZE</h3>
                    <p className="text-4xl font-bold font-rajdhani text-white">₹50,000</p>
                    <button 
                      className="mt-4 flex items-center text-xs text-primary animate-pulse" 
                      onClick={() => window.location.href = "/tournaments/1"}
                    >
                      VIEW DETAILS <ChevronsRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Orbiting elements */}
              {[0, 1, 2].map((index) => (
                <div 
                  key={index}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50"
                  style={{
                    width: `${100 - index * 20}%`,
                    height: `${100 - index * 20}%`,
                    animation: `spin ${15 + index * 5}s linear infinite`,
                  }}
                >
                  <div 
                    className="absolute h-4 w-4 rounded-full bg-primary"
                    style={{
                      top: `${Math.sin(index * 2) * 50 + 50}%`,
                      left: 0,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="glassmorphic-card p-4 text-center">
                <User className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold font-rajdhani text-white">50K+</p>
                <p className="text-xs text-muted-foreground">Active Players</p>
              </div>
              
              <div className="glassmorphic-card p-4 text-center">
                <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold font-rajdhani text-white">₹10L+</p>
                <p className="text-xs text-muted-foreground">Prize Pool</p>
              </div>
              
              <div className="glassmorphic-card p-4 text-center">
                <Swords className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold font-rajdhani text-white">100+</p>
                <p className="text-xs text-muted-foreground">Daily Matches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
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
