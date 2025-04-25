import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Tournament } from "@shared/schema";
import { formatTimeLeft, getGameModeColor, getGameModeBgColor } from "@/lib/utils";
import { 
  Trophy, Calendar, Clock, Users, Search, MapPin, Coins, Filter, 
  ChevronRight, Flame, User, UsersIcon, LayoutGrid, List, Sliders, X, Zap 
} from "lucide-react";

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
  
  const [selectedTournament, setSelectedTournament] = useState<ExtendedTournament | null>(null);
  const [showFeatured, setShowFeatured] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [prizeRange, setPrizeRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  // Effects for animations
  useEffect(() => {
    // Add cyber-bg class to body when component mounts
    document.body.classList.add('cyber-bg');
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('cyber-bg');
    };
  }, []);

  // Get featured tournament (highest prize pool)
  const featuredTournament = tournaments.reduce((prev, current) => 
    (prev.prizePool > current.prizePool) ? prev : current, tournaments[0]);
    
  // Filter tournaments by prize range
  const prizeFilteredTournaments = filteredTournaments.filter(tournament => 
    tournament.prizePool >= prizeRange[0] && tournament.prizePool <= prizeRange[1]
  );
  
  // Count tournaments by game mode
  const gameModeCount = tournaments.reduce((acc, tournament) => {
    acc[tournament.gameMode] = (acc[tournament.gameMode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24 relative">
        {/* Background particles */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-primary/10 animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Header with Hero Section */}
        <div className="relative mb-12 neon-border p-6 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 cyber-bg"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-orbitron mb-4 gradient-text">
                FireFight Tournaments
              </h1>
              <p className="text-xl text-foreground mb-6 font-rajdhani">
                Join competitive Free Fire tournaments, showcase your skills, and win exclusive prizes and cash rewards!
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <Badge className="py-2 px-4 bg-primary/20 text-white border-primary/40 flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-secondary" /> {tournaments.length} Active Tournaments
                </Badge>
                <Badge className="py-2 px-4 bg-secondary/20 text-white border-secondary/40 flex items-center gap-1">
                  <Coins className="h-4 w-4 text-secondary" /> ₹{tournaments.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString()} Total Prize Pool
                </Badge>
                <Badge className="py-2 px-4 bg-accent/20 text-white border-accent/40 flex items-center gap-1">
                  <Users className="h-4 w-4 text-accent" /> {tournaments.filter(t => t.status === "live").length} Live Now
                </Badge>
              </div>
              
              <Button 
                onClick={() => {
                  document.getElementById('tournament-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-3d py-6 px-8 neon-border"
              >
                Browse Tournaments <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {featuredTournament && (
              <div className="glassmorphic-card p-5 shine-effect">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-5 w-5 text-red-500 animate-pulse" />
                  <h3 className="text-lg font-bold text-secondary">FEATURED TOURNAMENT</h3>
                </div>
                
                <div className="relative h-40 rounded-lg mb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <Badge className={`${getGameModeBgColor(featuredTournament.gameMode)} mb-2 w-fit`}>
                      {featuredTournament.gameMode}
                    </Badge>
                    <h2 className="text-2xl font-bold font-orbitron text-white">{featuredTournament.title}</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{new Date(featuredTournament.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{featuredTournament.mapName}</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-secondary animate-pulse" />
                    <span className="font-bold text-secondary">₹{featuredTournament.prizePool}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{featuredTournament.currentParticipants}/{featuredTournament.maxParticipants}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full animate-pulse-glow"
                  onClick={() => navigate(`/tournaments/${featuredTournament.id}`)}
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mode stats counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div 
            className="glassmorphic-card p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setGameModeFilter('Solo')}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold font-rajdhani">Solo Mode</h3>
                <p className="text-xs text-muted-foreground">One-player challenge</p>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{gameModeCount['Solo'] || 0} Tournaments</span>
              <Badge className="bg-accent">{Math.round((gameModeCount['Solo'] || 0) / tournaments.length * 100)}%</Badge>
            </div>
          </div>
          
          <div 
            className="glassmorphic-card p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setGameModeFilter('Duo')}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold font-rajdhani">Duo Mode</h3>
                <p className="text-xs text-muted-foreground">Two-player teams</p>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{gameModeCount['Duo'] || 0} Tournaments</span>
              <Badge className="bg-secondary">{Math.round((gameModeCount['Duo'] || 0) / tournaments.length * 100)}%</Badge>
            </div>
          </div>
          
          <div 
            className="glassmorphic-card p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setGameModeFilter('Squad')}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold font-rajdhani">Squad Mode</h3>
                <p className="text-xs text-muted-foreground">Four-player teams</p>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{gameModeCount['Squad'] || 0} Tournaments</span>
              <Badge className="bg-primary">{Math.round((gameModeCount['Squad'] || 0) / tournaments.length * 100)}%</Badge>
            </div>
          </div>
        </div>
        
        {/* Controls and Advanced Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold font-orbitron">Browse Tournaments</h2>
              <Badge className="bg-primary/20 text-primary border border-primary/40">
                {prizeFilteredTournaments.length} Results
              </Badge>
            </div>
            
            <div className="flex gap-4 items-center flex-wrap">
              {/* View toggle */}
              <div className="flex border border-muted rounded-md overflow-hidden">
                <button 
                  className={`px-3 py-2 ${viewMode === 'grid' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-transparent hover:bg-muted/20'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  className={`px-3 py-2 ${viewMode === 'list' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-transparent hover:bg-muted/20'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Advanced filters toggle */}
              <Button 
                variant="outline" 
                className="border-primary/30 flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Sliders className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
              </Button>
              
              <Button 
                onClick={() => navigate("/how-to-play")} 
                variant="ghost" 
                className="text-xs"
              >
                How to Join
              </Button>
            </div>
          </div>
          
          {/* Advanced filters panel */}
          <div className={`glassmorphic p-6 mb-6 transition-all duration-300 ${showFilters ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden p-0 mb-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <h3 className="text-sm font-medium mb-2">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search tournaments..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Status filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
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
              
              {/* Game mode filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Game Mode</h3>
                <Tabs defaultValue={gameModeFilter} onValueChange={(value) => setGameModeFilter(value as GameModeFilterOptions)}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="Solo">Solo</TabsTrigger>
                    <TabsTrigger value="Duo">Duo</TabsTrigger>
                    <TabsTrigger value="Squad">Squad</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Prize pool range */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Prize Pool</h3>
                  <span className="text-sm text-muted-foreground">₹{prizeRange[0]} - ₹{prizeRange[1]}</span>
                </div>
                <div className="px-2">
                  <Slider
                    defaultValue={prizeRange}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={(value) => setPrizeRange(value as [number, number])}
                    className="my-4"
                  />
                </div>
              </div>
              
              {/* Reset button */}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setGameModeFilter("all");
                    setPrizeRange([0, 5000]);
                  }}
                  className="w-full"
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tournament Grid or List */}
        {isLoading ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-6"
          } id="tournament-grid">
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
        ) : prizeFilteredTournaments.length > 0 ? (
          viewMode === 'grid' ? (
            // Grid view
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tournament-grid">
              {prizeFilteredTournaments.map((tournament) => (
                <Card 
                  key={tournament.id} 
                  className="glassmorphic-card overflow-hidden group"
                  onClick={() => setSelectedTournament(tournament)}
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
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="outline" className="border-white text-white">
                        View Details
                      </Button>
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
                          className="h-full bg-gradient-to-r from-primary to-accent" 
                          style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full btn-3d"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tournaments/${tournament.id}`);
                      }}
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
            // List view
            <div className="space-y-4" id="tournament-grid">
              {prizeFilteredTournaments.map((tournament) => (
                <div 
                  key={tournament.id}
                  className="glassmorphic-card p-4 hover:shadow-[0_0_15px_theme(colors.primary.DEFAULT)] transition-all duration-300"
                  onClick={() => setSelectedTournament(tournament)}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Tournament basic info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
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
                      <h3 className="text-xl font-orbitron font-bold">{tournament.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                        {tournament.description}
                      </p>
                    </div>
                    
                    {/* Tournament details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm">
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
                    
                    {/* Action buttons */}
                    <div className="flex-shrink-0 w-full md:w-auto">
                      <div className="flex md:flex-col gap-2 justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {tournament.currentParticipants}/{tournament.maxParticipants}
                          </span>
                        </div>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tournaments/${tournament.id}`);
                          }}
                          disabled={tournament.status === "full"}
                        >
                          {tournament.status === "live" ? (
                            <>
                              <Flame className="mr-2 h-4 w-4" /> Watch
                            </>
                          ) : tournament.status === "full" ? (
                            "Full"
                          ) : (
                            <>
                              Details <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="glassmorphic p-12 text-center" id="tournament-grid">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No tournaments found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query to find tournaments
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setGameModeFilter("all");
              setPrizeRange([0, 5000]);
            }}>
              Reset Filters
            </Button>
          </div>
        )}
        
        {/* Tournament quick view dialog */}
        <Dialog open={!!selectedTournament} onOpenChange={(open) => !open && setSelectedTournament(null)}>
          <DialogContent className="sm:max-w-[600px] glassmorphic-card p-0 overflow-hidden">
            {selectedTournament && (
              <>
                <div className="h-48 relative">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <Badge className={`${getGameModeBgColor(selectedTournament.gameMode)} mb-2 w-fit`}>
                      {selectedTournament.gameMode}
                    </Badge>
                    <h2 className="text-2xl font-bold font-orbitron text-white">{selectedTournament.title}</h2>
                  </div>
                  
                  <DialogClose className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">
                    {selectedTournament.description}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Starts In</p>
                      <p className="font-medium">{formatTimeLeft(selectedTournament.startTime)}</p>
                    </div>
                    <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <MapPin className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Map</p>
                      <p className="font-medium">{selectedTournament.mapName}</p>
                    </div>
                    <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <Trophy className="h-5 w-5 mx-auto mb-1 text-secondary" />
                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                      <p className="font-medium text-secondary">₹{selectedTournament.prizePool}</p>
                    </div>
                    <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <Coins className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">Entry Fee</p>
                      <p className="font-medium">{selectedTournament.entryFee} Coins</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 font-rajdhani">Participation</h3>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedTournament.currentParticipants} of {selectedTournament.maxParticipants} spots filled
                      </span>
                    </div>
                    <Badge variant={selectedTournament.status === "full" ? "outline" : "default"}>
                      {selectedTournament.status === "live" ? "Live Now" : 
                       selectedTournament.status === "full" ? "Full" : "Registration Open"}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 btn-3d"
                      onClick={() => {
                        setSelectedTournament(null);
                        navigate(`/tournaments/${selectedTournament.id}`);
                      }}
                    >
                      View Full Details
                    </Button>
                    {selectedTournament.status !== "full" && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          // Register for tournament logic
                          if (!selectedTournament.status.includes("full")) {
                            setSelectedTournament(null);
                            navigate(`/tournaments/${selectedTournament.id}`);
                          }
                        }}
                      >
                        Register Now
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Upcoming Events Banner */}
        <div className="mt-16 glassmorphic-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-orbitron mb-2 gradient-text">Stay Updated!</h2>
              <p className="text-muted-foreground mb-4 max-w-xl">
                We host tournaments every weekend with bigger prize pools. Subscribe to get notified about upcoming events.
              </p>
              
              <div className="flex gap-2">
                <Input placeholder="Your email address" className="max-w-xs" />
                <Button className="neon-border shine-effect">Subscribe</Button>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center">
              <div className="rounded-full bg-primary/20 p-4 mr-4 animate-pulse">
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