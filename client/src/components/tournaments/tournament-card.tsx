import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users } from "lucide-react";
import { Tournament } from "@shared/schema";
import { formatTimeLeft, getGameModeBgColor } from "@/lib/utils";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  // Calculate filled slots percentage (mock implementation)
  const filledPercentage = Math.floor(Math.random() * 100);
  
  return (
    <div className="glassmorphic rounded-xl overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-300">
      <div className="h-48 relative">
        {/* Placeholder gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getGameModeBgColor(tournament.gameMode)} text-white`}>
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
        
        {/* Status badge */}
        <div className="absolute top-4 left-4 px-2 py-1 rounded-md text-xs font-medium bg-background/80 border border-primary/30">
          {tournament.status}
        </div>
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
                {Math.floor(tournament.maxParticipants * filledPercentage / 100)}/{tournament.maxParticipants}
              </span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                tournament.status === "Live" ? "bg-red-500" : 
                tournament.status === "Completed" ? "bg-accent" : "bg-primary"
              }`} 
              style={{ width: `${filledPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <Link href={`/tournaments/${tournament.id}`}>
          <Button 
            className={`w-full py-2 rounded-md font-medium ${
              tournament.status === "Completed" ? "bg-accent" : 
              tournament.status === "Live" ? "bg-red-500" : ""
            }`}
          >
            {tournament.status === "Upcoming" ? "Join Now" : 
             tournament.status === "Live" ? "Watch Live" : "View Results"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

// SVG icon
const CoinsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6"></circle>
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
    <path d="M7 6h1v4"></path>
    <path d="m16.71 13.88.7.71-2.82 2.82"></path>
  </svg>
);
