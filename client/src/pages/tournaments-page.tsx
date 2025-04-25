import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Tournament } from "@shared/schema";
import { formatTimeLeft, getGameModeColor, getGameModeBgColor } from "@/lib/utils";
import { Trophy, Calendar, Clock, Users, Search, MapPin, Coins, Filter, ChevronRight, Flame } from "lucide-react";
import { useLocation } from "wouter";

// Extended tournament type to include UI-specific fields
interface ExtendedTournament extends Tournament {
  currentParticipants: number;
  banner?: string; // UI reference for banner image
}

// Sample tournament data based on the user's attached file
const SAMPLE_TOURNAMENTS: ExtendedTournament[] = [
  {
    id: 1,
    title: "🔥 Pro Squad Arena",
    description: "Compete with the best squads in an intense battle for supremacy. Top 3 teams win cash prizes!",
    bannerImage: "/tournament-1.jpg",
    gameMode: "Squad",
    entryFee: 15,
    prizePool: 1000,
    mapName: "Bermuda",
    maxParticipants: 50,
    startTime: new Date(2025, 3, 27, 17, 0),
    status: "upcoming",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 36,
    banner: "/tournament-1.jpg"
  },
  {
    id: 2,
    title: "🎯 Sniper King Solo",
    description: "Show off your sniping skills in this solo competition. One shot, one kill!",
    bannerImage: "/tournament-2.jpg",
    gameMode: "Solo",
    entryFee: 5,
    prizePool: 500,
    mapName: "Kalahari",
    maxParticipants: 100,
    startTime: new Date(2025, 3, 27, 14, 0),
    status: "full",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 100,
    banner: "/tournament-2.jpg"
  },
  {
    id: 3,
    title: "💥 Elite Duo Battle",
    description: "Find a partner and dominate the battlefield together. Strategy and teamwork are key!",
    bannerImage: "/tournament-3.jpg",
    gameMode: "Duo",
    entryFee: 10,
    prizePool: 750,
    mapName: "Purgatory",
    maxParticipants: 100,
    startTime: new Date(2025, 3, 27, 15, 0),
    status: "upcoming",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 74,
    banner: "/tournament-3.jpg"
  },
  {
    id: 4,
    title: "⚡ Clash of Legends",
    description: "The ultimate battle royale experience with top players from across the region!",
    bannerImage: "/tournament-4.jpg",
    gameMode: "Squad",
    entryFee: 20,
    prizePool: 2000,
    mapName: "Bermuda",
    maxParticipants: 75,
    startTime: new Date(2025, 3, 28, 18, 0),
    status: "upcoming",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 23,
    banner: "/tournament-4.jpg"
  },
  {
    id: 5,
    title: "🔫 Quick Draw Showdown",
    description: "Fast-paced solo tournament with focus on quick reflexes and sharp shooting!",
    bannerImage: "/tournament-5.jpg",
    gameMode: "Solo",
    entryFee: 8,
    prizePool: 600,
    mapName: "Kalahari",
    maxParticipants: 80,
    startTime: new Date(2025, 3, 28, 13, 0),
    status: "upcoming",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 45,
    banner: "/tournament-5.jpg"
  },
  {
    id: 6,
    title: "🚀 Booyah Blitz",
    description: "High intensity matches with shrinking safe zones and increased loot!",
    bannerImage: "/tournament-6.jpg",
    gameMode: "Duo",
    entryFee: 12,
    prizePool: 800,
    mapName: "Purgatory",
    maxParticipants: 60,
    startTime: new Date(2025, 3, 26, 19, 0),
    status: "live",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 60,
    banner: "/tournament-6.jpg"
  },
  {
    id: 7,
    title: "🔥 Weekend Battle Royale",
    description: "The biggest tournament of the season! Enter solo or as a squad and compete for massive prizes.",
    bannerImage: "/tournament-7.jpg",
    gameMode: "Squad",
    entryFee: 25,
    prizePool: 3000,
    mapName: "Bermuda",
    maxParticipants: 120,
    startTime: new Date(2025, 3, 29, 20, 0),
    status: "upcoming",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 87,
    banner: "/tournament-7.jpg"
  },
  {
    id: 8,
    title: "⚔️ Guild War Series",
    description: "Team-based competition where guilds battle for supremacy and season points!",
    bannerImage: "/tournament-8.jpg",
    gameMode: "Squad",
    entryFee: 30,
    prizePool: 2500,
    mapName: "Kalahari",
    maxParticipants: 50,
    startTime: new Date(2025, 3, 30, 19, 0),
    status: "upcoming",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 32,
    banner: "/tournament-8.jpg"
  },
  {
    id: 9,
    title: "🏆 Masters Tournament",
    description: "Invitation-only elite tournament featuring the best players in the region!",
    bannerImage: "/tournament-9.jpg",
    gameMode: "Solo",
    entryFee: 0,
    prizePool: 5000,
    mapName: "Bermuda",
    maxParticipants: 30,
    startTime: new Date(2025, 4, 5, 18, 0),
    status: "upcoming",
    createdAt: new Date(),
    createdBy: 1,
    currentParticipants: 12,
    banner: "/tournament-9.jpg"
  }
];

type TournamentFilterOptions = 'all' | 'upcoming' | 'live' | 'full';
type GameModeFilterOptions = 'all' | 'Solo' | 'Duo' | 'Squad';

export default function TournamentsPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TournamentFilterOptions>("all");
  const [gameModeFilter, setGameModeFilter] = useState<GameModeFilterOptions>("all");
  
  // API query - using sample data for UI mockup
  const { data: tournaments = SAMPLE_TOURNAMENTS, isLoading } = useQuery<ExtendedTournament[]>({
    queryKey: ['/api/tournaments'],
    initialData: SAMPLE_TOURNAMENTS
  });
  
  // Filter tournaments based on search query and filters
  const filteredTournaments = tournaments.filter((tournament: ExtendedTournament) => {
    // Search filter
    const matchesSearch = 
      tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tournament.description && tournament.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "upcoming" && tournament.status === "upcoming") ||
      (statusFilter === "live" && tournament.status === "live") ||
      (statusFilter === "full" && tournament.currentParticipants >= tournament.maxParticipants);
    
    // Game mode filter
    const matchesGameMode = gameModeFilter === "all" || tournament.gameMode === gameModeFilter;
    
    return matchesSearch && matchesStatus && matchesGameMode;
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-orbitron mb-2">Tournaments</h1>
            <p className="text-muted-foreground">Compete in exciting tournaments and win amazing prizes!</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate("/how-to-play")} variant="outline" className="border-primary/30">
              How to Participate
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="glassmorphic p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tournaments..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 md:flex-none">
                <Tabs defaultValue={statusFilter} onValueChange={(value) => setStatusFilter(value as TournamentFilterOptions)}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="live" className="relative">
                      Live
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    </TabsTrigger>
                    <TabsTrigger value="full">Full</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex-1 md:flex-none">
                <Tabs defaultValue={gameModeFilter} onValueChange={(value) => setGameModeFilter(value as GameModeFilterOptions)}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="Solo">Solo</TabsTrigger>
                    <TabsTrigger value="Duo">Duo</TabsTrigger>
                    <TabsTrigger value="Squad">Squad</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tournament Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glassmorphic overflow-hidden animate-pulse">
                <div className="h-48 bg-muted/30"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted/30 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted/30 rounded w-1/2 mb-4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-5 bg-muted/30 rounded"></div>
                    <div className="h-5 bg-muted/30 rounded"></div>
                    <div className="h-5 bg-muted/30 rounded"></div>
                    <div className="h-5 bg-muted/30 rounded"></div>
                  </div>
                  <div className="h-9 bg-muted/30 rounded mt-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <Card 
                key={tournament.id} 
                className="glassmorphic overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_15px_theme(colors.primary.DEFAULT)] group"
              >
                <div className="h-48 relative overflow-hidden">
                  {/* Fallback/placeholder banner with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
                  
                  {/* Tournament info overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getGameModeBgColor(tournament.gameMode)}>
                        {tournament.gameMode}
                      </Badge>
                      {tournament.status === "live" && (
                        <Badge className="bg-red-500 animate-pulse flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-white"></span> LIVE
                        </Badge>
                      )}
                      {tournament.status === "full" && (
                        <Badge variant="outline">FULL</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-orbitron font-bold line-clamp-1">{tournament.title}</h3>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 h-10">
                    {tournament.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatTimeLeft(tournament.startTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{tournament.mapName}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-secondary" />
                      <span>₹{tournament.prizePool}</span>
                    </div>
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 mr-2 text-primary" />
                      <span>{tournament.entryFee} Coins</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full w-24 overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full group-hover:animate-pulse-glow"
                    onClick={() => navigate(`/tournaments/${tournament.id}`)}
                    disabled={tournament.status === "full"}
                  >
                    {tournament.status === "live" ? (
                      <>
                        <Flame className="mr-2 h-4 w-4" /> Watch Live
                      </>
                    ) : tournament.status === "full" ? (
                      "Tournament Full"
                    ) : (
                      <>
                        View Details <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="glassmorphic p-12 text-center">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No tournaments found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query to find tournaments
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setGameModeFilter("all");
            }}>
              Reset Filters
            </Button>
          </div>
        )}
        
        {/* Upcoming Events Banner */}
        <div className="mt-12 glassmorphic p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-orbitron mb-2">Stay Updated!</h2>
              <p className="text-muted-foreground mb-4 max-w-xl">
                We host tournaments every weekend with bigger prize pools. Subscribe to get notified about upcoming events.
              </p>
              
              <div className="flex gap-2">
                <Input placeholder="Your email address" className="max-w-xs" />
                <Button>Subscribe</Button>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center">
              <div className="rounded-full bg-primary/20 p-4 mr-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Monthly Championship</h3>
                <p className="text-muted-foreground">Coming May 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}