import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, MedalIcon, Swords, Award, Grid, List, 
  CrownIcon, Star, Flame, ArrowUp, ArrowDown, 
  ChevronRight, TrendingUp, Zap, Filter, X
} from "lucide-react";
import { getDefaultAvatar } from "@/lib/utils";

type LeaderboardEntry = {
  id: number;
  username: string;
  matches: number;
  kills: number;
  wins: number;
  coins: number;
};

type LeaderboardPeriod = "daily" | "weekly" | "monthly";

// Generate sample data for grid demo
const generateSampleData = (count: number): LeaderboardEntry[] => {
  const usernames = ["SniperElite", "FireLord", "HeadshotKing", "BattleQueen", "GhostSniper", "DragonSlayer", 
                    "NinjaWarrior", "ShadowHunter", "PhoenixRider", "StormBreaker", "DeathWhisper", "FlameWizard"];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    username: usernames[i % usernames.length],
    matches: Math.floor(Math.random() * 100) + 50,
    kills: Math.floor(Math.random() * 500) + 100,
    wins: Math.floor(Math.random() * 30) + 5,
    coins: Math.floor(Math.random() * 5000) + 1000,
  }));
};

export default function LeaderboardPage() {
  // Set page title
  useEffect(() => {
    document.title = "Leaderboard | FireFight";
  }, []);

  // States
  const [period, setPeriod] = useState<LeaderboardPeriod>("daily");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'rank' | 'kills' | 'wins' | 'matches'>('rank');
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  
  // Animate in elements
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Fetch leaderboard data
  const { data: leaderboard = generateSampleData(12), isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard", period],
    initialData: generateSampleData(12), // Sample data for UI design
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
            <Trophy className="mr-3 text-secondary h-8 w-8" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            See the top Free Fire players and compete to climb the ranks
          </p>
        </div>
        
        {/* Leaderboard Card */}
        <div className="glassmorphic rounded-xl overflow-hidden relative">
          {/* Background decorative elements */}
          <div className="absolute -z-10 top-0 right-0 w-80 h-80 bg-gradient-radial from-primary/5 to-transparent opacity-50"></div>
          <div className="absolute -z-10 bottom-0 left-0 w-60 h-60 bg-gradient-radial from-secondary/5 to-transparent opacity-50"></div>
          
          {/* Header with controls */}
          <div className="p-4 border-b border-primary/30 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex items-center space-x-2">
              <Tabs
                defaultValue={period}
                onValueChange={(value) => setPeriod(value as LeaderboardPeriod)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="daily" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Zap className="h-4 w-4 mr-2" /> Daily
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                    <Star className="h-4 w-4 mr-2" /> Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                    <CrownIcon className="h-4 w-4 mr-2" /> Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-black/30 border border-muted/50 text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-secondary" /> 
                Updated 5 min ago
              </Badge>
              
              <div className="flex border border-muted rounded-md overflow-hidden">
                <button 
                  className={`px-3 py-2 ${viewMode === 'grid' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-transparent hover:bg-muted/20'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
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
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Filter
              </Button>
            </div>
          </div>
          
          {/* Leaderboard Content */}
          {isLoading ? (
            // Skeleton loading state
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="glassmorphic-card p-4 animate-pulse">
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-12 w-12 rounded-full mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Skeleton className="h-12 rounded" />
                      <Skeleton className="h-12 rounded" />
                      <Skeleton className="h-12 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="py-4 px-6 text-left text-muted-foreground text-sm">Rank</th>
                      <th className="py-4 px-6 text-left text-muted-foreground text-sm">Player</th>
                      <th className="py-4 px-6 text-right text-muted-foreground text-sm">Matches</th>
                      <th className="py-4 px-6 text-right text-muted-foreground text-sm">Kills</th>
                      <th className="py-4 px-6 text-right text-muted-foreground text-sm">Wins</th>
                      <th className="py-4 px-6 text-right text-muted-foreground text-sm">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index} className="border-b border-primary/10">
                        <td className="py-4 px-6">
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <Skeleton className="h-10 w-10 rounded-full mr-3" />
                            <div>
                              <Skeleton className="h-5 w-32 mb-1" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Skeleton className="h-5 w-10 ml-auto" />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Skeleton className="h-5 w-10 ml-auto" />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Skeleton className="h-5 w-10 ml-auto" />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Skeleton className="h-5 w-16 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : leaderboard && leaderboard.length > 0 ? (
            viewMode === 'grid' ? (
              // Grid view
              <div 
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-700`}
              >
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className={`glassmorphic-card p-4 hover:scale-105 transition-all duration-300 group cursor-pointer ${
                      index === 0 ? 'border-secondary/30 hover:border-secondary' : 
                      index === 1 ? 'border-primary/30 hover:border-primary' : 
                      index === 2 ? 'border-accent/30 hover:border-accent' : 
                      'border-muted/30 hover:border-muted'
                    }`}
                    onClick={() => {
                      setSelectedPlayer(entry);
                      setShowPlayerStats(true);
                    }}
                    style={{
                      transitionDelay: `${index * 0.05}s`
                    }}
                  >
                    {/* User info and rank */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`relative w-12 h-12 rounded-full overflow-hidden mr-3 border-2 ${
                          index === 0 ? 'border-secondary group-hover:shadow-secondary/50' : 
                          index === 1 ? 'border-primary group-hover:shadow-primary/50' : 
                          index === 2 ? 'border-accent group-hover:shadow-accent/50' : 
                          'border-muted'
                        } transition-all duration-300`}>
                          <img 
                            src={getDefaultAvatar(entry.username)} 
                            alt={entry.username} 
                            className="w-full h-full object-cover"
                          />
                          {index < 3 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-0.5">
                              {index === 0 && <CrownIcon className="h-4 w-4 text-secondary" />}
                              {index === 1 && <CrownIcon className="h-4 w-4 text-primary" />}
                              {index === 2 && <CrownIcon className="h-4 w-4 text-accent" />}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className={`font-bold font-rajdhani text-lg ${
                            index === 0 ? 'text-secondary' : 
                            index === 1 ? 'text-primary' : 
                            index === 2 ? 'text-accent' : ''
                          }`}>
                            {entry.username}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            Team FireLords
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-2"></div>
                          </div>
                        </div>
                      </div>
                      <div className={`min-w-[2rem] h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-secondary/20 text-secondary border border-secondary/30' : 
                        index === 1 ? 'bg-primary/20 text-primary border border-primary/30' : 
                        index === 2 ? 'bg-accent/20 text-accent border border-accent/30' : 
                        'bg-muted/20 text-muted-foreground border border-muted/30'
                      } text-sm font-bold px-2`}>
                        #{index + 1}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-2 rounded bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                        <div className="text-xs text-muted-foreground mb-1">Matches</div>
                        <div className="font-bold text-lg font-rajdhani">{entry.matches}</div>
                      </div>
                      <div className="text-center p-2 rounded bg-secondary/5 border border-secondary/10 group-hover:bg-secondary/10 transition-colors">
                        <div className="text-xs text-muted-foreground mb-1">Kills</div>
                        <div className="font-bold text-lg font-rajdhani text-secondary">{entry.kills}</div>
                      </div>
                      <div className="text-center p-2 rounded bg-accent/5 border border-accent/10 group-hover:bg-accent/10 transition-colors">
                        <div className="text-xs text-muted-foreground mb-1">Wins</div>
                        <div className="font-bold text-lg font-rajdhani text-accent">{entry.wins}</div>
                      </div>
                    </div>
                    
                    {/* Points + Quick Stats */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center px-3 py-1.5 rounded bg-black/30 border border-muted/20">
                        <Flame className="h-4 w-4 text-secondary mr-1.5" />
                        <span className="text-xs text-muted-foreground">K/M Ratio: </span>
                        <span className="text-xs ml-1 font-semibold">
                          {(entry.kills / entry.matches).toFixed(1)}
                        </span>
                      </div>
                      <div className={`font-bold text-xl ${
                        index === 0 ? 'text-secondary' : 
                        index === 1 ? 'text-primary' : 
                        index === 2 ? 'text-accent' : ''
                      }`}>
                        {entry.coins} pts
                      </div>
                    </div>
                    
                    {/* View stats button - appears on hover */}
                    <div className="mt-3 overflow-hidden h-0 group-hover:h-9 transition-all duration-300">
                      <Button 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlayer(entry);
                          setShowPlayerStats(true);
                        }}
                      >
                        View Full Stats <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List view
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="py-4 px-6 text-left text-muted-foreground text-sm">Rank</th>
                      <th className="py-4 px-6 text-left text-muted-foreground text-sm">Player</th>
                      <th className="py-4 px-6 text-right text-muted-foreground text-sm">
                        <button 
                          className="flex items-center justify-end w-full hover:text-foreground"
                          onClick={() => setSortBy('matches')}
                        >
                          Matches {sortBy === 'matches' && <ArrowDown className="ml-1 h-3.5 w-3.5" />}
                        </button>
                      </th>
                      <th className="py-4 px-6 text-right text-muted-foreground text-sm">
                        <button 
                          className="flex items-center justify-end w-full hover:text-foreground"
                          onClick={() => setSortBy('kills')}
                        >
                          Kills {sortBy === 'kills' && <ArrowDown className="ml-1 h-3.5 w-3.5" />}
                        </button>
                      </th>
                      <th className="py-4 px-6 text-right text-muted-foreground text-sm">
                        <button 
                          className="flex items-center justify-end w-full hover:text-foreground"
                          onClick={() => setSortBy('wins')}
                        >
                          Wins {sortBy === 'wins' && <ArrowDown className="ml-1 h-3.5 w-3.5" />}
                        </button>
                      </th>
                      <th className="py-4 px-6 text-right text-muted-foreground text-sm">Points</th>
                      <th className="py-4 px-6 text-center text-muted-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr 
                        key={entry.id}
                        className={`border-b border-primary/10 hover:bg-primary/5 hover:scale-[1.01] transition-all duration-300 ${
                          index === 0 ? 'bg-secondary/5' : 
                          index === 1 ? 'bg-primary/5' : 
                          index === 2 ? 'bg-accent/5' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {index === 0 ? (
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/20 text-secondary border border-secondary/30 font-bold">
                                1
                              </span>
                            ) : index === 1 ? (
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30 font-bold">
                                2
                              </span>
                            ) : index === 2 ? (
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent/20 text-accent border border-accent/30 font-bold">
                                3
                              </span>
                            ) : (
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/20 text-foreground border border-muted/30 font-bold">
                                {index + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full overflow-hidden mr-3 border-2 transition-all duration-300 ${
                              index === 0 ? 'border-secondary hover:shadow-secondary/50' : 
                              index === 1 ? 'border-primary hover:shadow-primary/50' : 
                              index === 2 ? 'border-accent hover:shadow-accent/50' : 'border-muted'
                            }`}>
                              <img 
                                src={getDefaultAvatar(entry.username)} 
                                alt={entry.username} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className={`font-bold font-rajdhani ${
                                index === 0 ? 'text-secondary' : 
                                index === 1 ? 'text-primary' : 
                                index === 2 ? 'text-accent' : ''
                              }`}>
                                {entry.username}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Team FireLords
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right text-foreground">
                          {entry.matches}
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-secondary">
                          {entry.kills}
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-accent">
                          {entry.wins}
                        </td>
                        <td className="py-4 px-6 text-right font-bold">
                          <span className={
                            index === 0 ? 'text-secondary' : 
                            index === 1 ? 'text-primary' : 
                            index === 2 ? 'text-accent' : ''
                          }>
                            {entry.coins}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-accent"
                            onClick={() => {
                              setSelectedPlayer(entry);
                              setShowPlayerStats(true);
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No leaderboard data available
            </div>
          )}
          
          {/* Player stats modal */}
          {selectedPlayer && showPlayerStats && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPlayerStats(false)}>
              <div className="glassmorphic-card max-w-md w-full p-0 animate-float" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="relative h-28 overflow-hidden rounded-t-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  <button 
                    className="absolute top-3 right-3 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
                    onClick={() => setShowPlayerStats(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white mr-3">
                      <img 
                        src={getDefaultAvatar(selectedPlayer.username)} 
                        alt={selectedPlayer.username} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-rajdhani">{selectedPlayer.username}</h3>
                      <p className="text-sm text-muted-foreground">Team FireLords</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 rounded bg-black/20 border border-primary/20">
                      <h4 className="text-sm text-muted-foreground mb-1">Ranking</h4>
                      <p className="text-2xl font-bold text-white">#{leaderboard.findIndex(p => p.id === selectedPlayer.id) + 1}</p>
                    </div>
                    <div className="text-center p-3 rounded bg-black/20 border border-primary/20">
                      <h4 className="text-sm text-muted-foreground mb-1">Total Points</h4>
                      <p className="text-2xl font-bold text-white">{selectedPlayer.coins}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 rounded bg-primary/10 border border-primary/20">
                      <h4 className="text-xs text-muted-foreground mb-1">Matches</h4>
                      <p className="text-xl font-bold text-white">{selectedPlayer.matches}</p>
                    </div>
                    <div className="text-center p-3 rounded bg-secondary/10 border border-secondary/20">
                      <h4 className="text-xs text-muted-foreground mb-1">Kills</h4>
                      <p className="text-xl font-bold text-secondary">{selectedPlayer.kills}</p>
                    </div>
                    <div className="text-center p-3 rounded bg-accent/10 border border-accent/20">
                      <h4 className="text-xs text-muted-foreground mb-1">Wins</h4>
                      <p className="text-xl font-bold text-accent">{selectedPlayer.wins}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center p-3 rounded bg-black/20 border border-primary/20">
                      <div className="mr-3 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Swords className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xs text-muted-foreground">K/D Ratio</h4>
                        <p className="text-lg font-bold text-white">{(selectedPlayer.kills / (selectedPlayer.matches - selectedPlayer.wins)).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded bg-black/20 border border-primary/20">
                      <div className="mr-3 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h4 className="text-xs text-muted-foreground">Win Rate</h4>
                        <p className="text-lg font-bold text-white">{Math.round((selectedPlayer.wins / selectedPlayer.matches) * 100)}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mb-3 btn-3d neon-border">
                    View Full Profile
                  </Button>
                  
                  <Button variant="outline" onClick={() => setShowPlayerStats(false)} className="w-full">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Achievements Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold font-orbitron mb-6 flex items-center">
            <Award className="mr-3 text-primary h-6 w-6" />
            Top Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glassmorphic rounded-xl p-6 hover:border-secondary/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 mb-4">
                <Swords className="text-secondary text-xl" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-rajdhani">Kill Master</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Awarded to the player with the most kills in a single tournament
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-secondary">
                  <img 
                    src={getDefaultAvatar("HeadshotKing")} 
                    alt="HeadshotKing" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">HeadshotKing</p>
                  <p className="text-xs text-secondary">42 kills</p>
                </div>
              </div>
            </div>
            
            <div className="glassmorphic rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mb-4">
                <Trophy className="text-primary text-xl" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-rajdhani">Tournament King</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Awarded to the player who has won the most tournaments
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-primary">
                  <img 
                    src={getDefaultAvatar("ProGamer99")} 
                    alt="ProGamer99" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">ProGamer99</p>
                  <p className="text-xs text-primary">8 tournaments won</p>
                </div>
              </div>
            </div>
            
            <div className="glassmorphic rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 mb-4">
                <MedalIcon className="text-accent text-xl" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-rajdhani">Most Valuable</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Awarded to the player with the highest total earnings
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-accent">
                  <img 
                    src={getDefaultAvatar("RichieRich")} 
                    alt="RichieRich" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">RichieRich</p>
                  <p className="text-xs text-accent">₹25,000 earned</p>
                </div>
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
