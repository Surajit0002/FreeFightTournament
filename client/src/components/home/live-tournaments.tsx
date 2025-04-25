import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Users, Swords } from "lucide-react";
import type { Tournament } from "@shared/schema";
import { getGameModeBgColor, getDefaultAvatar } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function LiveTournaments() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Fetch tournaments
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });
  
  // Filter live tournaments
  const liveTournaments = tournaments?.filter(
    (tournament) => tournament.status === "Live"
  );
  
  // Apply gameMode filter if not "all"
  const filteredTournaments = activeFilter === "all" 
    ? liveTournaments 
    : liveTournaments?.filter(t => t.gameMode.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="py-12 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold flex items-center">
          <div className="relative mr-3 text-red-500">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <LiveIcon className="relative" />
          </div>
          Live Tournaments
        </h2>
        
        {/* Filter buttons */}
        <div className="flex space-x-2">
          <Button 
            size="sm"
            variant={activeFilter === "all" ? "default" : "ghost"}
            onClick={() => setActiveFilter("all")}
            className={activeFilter === "all" ? "bg-primary/20 border border-primary/50 text-primary" : ""}
          >
            All
          </Button>
          <Button 
            size="sm"
            variant={activeFilter === "solo" ? "default" : "ghost"}
            onClick={() => setActiveFilter("solo")}
            className={activeFilter === "solo" ? "bg-accent/20 border border-accent/50 text-accent" : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary"}
          >
            Solo
          </Button>
          <Button 
            size="sm"
            variant={activeFilter === "duo" ? "default" : "ghost"}
            onClick={() => setActiveFilter("duo")}
            className={activeFilter === "duo" ? "bg-secondary/20 border border-secondary/50 text-secondary" : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary"}
          >
            Duo
          </Button>
          <Button 
            size="sm"
            variant={activeFilter === "squad" ? "default" : "ghost"}
            onClick={() => setActiveFilter("squad")}
            className={activeFilter === "squad" ? "bg-primary/20 border border-primary/50 text-primary" : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary"}
          >
            Squad
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="glassmorphic rounded-xl overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            </div>
          ))
        ) : filteredTournaments && filteredTournaments.length > 0 ? (
          // Live tournament cards
          filteredTournaments.map((tournament) => (
            <div 
              key={tournament.id} 
              className="glassmorphic rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative">
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-red-500 text-white text-xs font-medium flex items-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative">LIVE</span>
                </div>
                {/* Placeholder with gradient background */}
                <div className="h-40 w-full bg-gradient-to-r from-primary/20 to-accent/20" />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold font-rajdhani text-lg">{tournament.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-md ${getGameModeBgColor(tournament.gameMode)} text-white`}>
                    {tournament.gameMode}
                  </span>
                </div>
                
                <div className="flex items-center text-sm mb-4">
                  <MapPin className="mr-1 text-muted-foreground" size={14} />
                  <span className="text-muted-foreground mr-4">{tournament.mapName}</span>
                  <Swords className="mr-1 text-muted-foreground" size={14} />
                  <span className="text-muted-foreground">
                    {Math.floor(Math.random() * tournament.maxParticipants)} teams
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img src={getDefaultAvatar("Organizer")} alt="Organizer" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-muted-foreground">By FireTourneys</span>
                  </div>
                  <div className="text-secondary font-medium">
                    ₹{tournament.prizePool} <span className="text-xs text-muted-foreground">prize</span>
                  </div>
                </div>
                
                <Link href={`/tournaments/${tournament.id}`}>
                  <Button className="w-full py-2 flex items-center justify-center">
                    <Eye className="mr-2" size={16} /> Watch Live
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          // No tournaments available
          <div className="col-span-full text-center py-8">
            <h3 className="text-lg font-bold mb-2">No live tournaments right now</h3>
            <p className="text-muted-foreground mb-4">
              Check back later or browse upcoming tournaments
            </p>
            <Link href="/tournaments">
              <Button>View Upcoming Tournaments</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// SVG icon
const LiveIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 12.5l7-7a2.82 2.82 0 0 1 4 4l-7 7a2.82 2.82 0 0 1-4-4M15 4.5l.5.5"></path>
    <path d="M19.5 9l.5.5"></path>
    <path d="M4.5 19.5l.5.5"></path>
    <path d="M9 15l.5.5"></path>
  </svg>
);
