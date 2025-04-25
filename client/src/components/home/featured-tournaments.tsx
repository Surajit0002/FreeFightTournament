import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, MapPin, Users } from "lucide-react";
import type { Tournament } from "@shared/schema";
import { formatTimeLeft, getGameModeBgColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function FeaturedTournaments() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollStep = 300;
  
  // Fetch tournaments
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });
  
  // Filter upcoming tournaments for featured section
  const featuredTournaments = tournaments?.filter(
    (tournament) => tournament.status === "Upcoming"
  ).slice(0, 6);
  
  // Scroll the tournament carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    const carousel = document.getElementById('featured-tournaments-carousel');
    if (carousel) {
      const newPosition = direction === 'left' 
        ? Math.max(scrollPosition - scrollStep, 0)
        : scrollPosition + scrollStep;
      
      carousel.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-12 container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-8 flex items-center">
        <FireIcon className="text-secondary mr-3" />
        Featured Tournaments
      </h2>
      
      <div className="relative">
        {/* Arrow controls */}
        <button 
          className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-background border border-primary/30 text-white z-10 hover:bg-primary/20 transition-colors"
          onClick={() => scrollCarousel('left')}
        >
          <ArrowLeft className="text-xl" />
        </button>
        <button 
          className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-background border border-primary/30 text-white z-10 hover:bg-primary/20 transition-colors"
          onClick={() => scrollCarousel('right')}
        >
          <ArrowRight className="text-xl" />
        </button>
        
        {/* Carousel */}
        <div 
          id="featured-tournaments-carousel" 
          className="overflow-x-auto scrollbar-hide flex gap-4 pb-4"
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="glassmorphic min-w-[300px] md:min-w-[350px] rounded-xl overflow-hidden flex flex-col">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))
          ) : featuredTournaments && featuredTournaments.length > 0 ? (
            // Tournament cards
            featuredTournaments.map((tournament) => (
              <div 
                key={tournament.id} 
                className="glassmorphic min-w-[300px] md:min-w-[350px] rounded-xl overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-48 relative">
                  {/* Placeholder image with gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getGameModeBgColor(tournament.gameMode)}`}>
                        {tournament.gameMode}
                      </span>
                      <h3 className="text-lg font-bold mt-2 font-rajdhani">{tournament.title}</h3>
                    </div>
                    <div className="flex space-x-1">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Entry</span>
                        <span className="font-medium text-secondary flex items-center">
                          <CoinsIcon className="text-xs mr-1" />{tournament.entryFee}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Prize</span>
                        <span className="font-medium text-accent">₹{tournament.prizePool}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time indicator */}
                  {tournament.startTime && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-background/80 border border-secondary/30 text-xs font-medium text-secondary flex items-center">
                      <Clock className="mr-1" size={12} />
                      {formatTimeLeft(tournament.startTime)}
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <MapPin className="mr-1 text-muted-foreground" size={14} />
                        <span className="text-sm text-muted-foreground">{tournament.mapName}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 text-muted-foreground" size={14} />
                        <span className="text-sm text-muted-foreground">
                          {/* For a real app, we would fetch the actual participants count */}
                          {Math.floor(Math.random() * tournament.maxParticipants)}/{tournament.maxParticipants}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.floor(Math.random() * 75)}%` }}></div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full py-2 rounded-md font-medium btn-3d"
                    onClick={() => window.location.href = `/tournaments/${tournament.id}`}
                  >
                    Join Now
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 w-full">
              <p className="text-muted-foreground">No tournaments available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center mt-8">
        <button 
          onClick={() => window.location.href = "/tournaments"}
          className="inline-flex items-center text-primary hover:text-secondary transition-colors font-rajdhani font-medium gradient-text animate-text-glow"
        >
          View All Tournaments <ArrowRight className="ml-2" size={16} />
        </button>
      </div>
    </section>
  );
}

// SVG icons
const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

const CoinsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6"></circle>
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
    <path d="M7 6h1v4"></path>
    <path d="m16.71 13.88.7.71-2.82 2.82"></path>
  </svg>
);
