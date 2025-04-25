import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, MedalIcon, Swords, Award } from "lucide-react";
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

export default function LeaderboardPage() {
  // Set page title
  useEffect(() => {
    document.title = "Leaderboard | FireFight";
  }, []);

  // State for leaderboard period filter
  const [period, setPeriod] = useState<LeaderboardPeriod>("daily");

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard", period],
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
        <div className="glassmorphic rounded-xl overflow-hidden">
          {/* Period selector */}
          <div className="p-4 border-b border-primary/30">
            <div className="flex items-center space-x-2">
              <Button
                variant={period === "daily" ? "default" : "ghost"}
                onClick={() => setPeriod("daily")}
                className="px-6"
              >
                Daily
              </Button>
              <Button
                variant={period === "weekly" ? "default" : "ghost"}
                onClick={() => setPeriod("weekly")}
                className="px-6"
              >
                Weekly
              </Button>
              <Button
                variant={period === "monthly" ? "default" : "ghost"}
                onClick={() => setPeriod("monthly")}
                className="px-6"
              >
                Monthly
              </Button>
            </div>
          </div>
          
          {/* Leaderboard Table */}
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
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 10 }).map((_, index) => (
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
                  ))
                ) : leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((entry, index) => (
                    <tr 
                      key={entry.id}
                      className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
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
                          <div className={`w-10 h-10 rounded-full overflow-hidden mr-3 border-2 ${
                            index === 0 ? 'border-secondary' : 
                            index === 1 ? 'border-primary' : 
                            index === 2 ? 'border-accent' : 'border-muted'
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
                      <td className="py-4 px-6 text-right text-foreground">
                        {entry.kills}
                      </td>
                      <td className="py-4 px-6 text-right text-foreground">
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No leaderboard data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
