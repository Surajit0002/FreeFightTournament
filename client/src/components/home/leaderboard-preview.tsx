import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { getDefaultAvatar } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

type LeaderboardEntry = {
  id: number;
  username: string;
  matches: number;
  kills: number;
  wins: number;
  coins: number;
};

export default function LeaderboardPreview() {
  const [activePeriod, setActivePeriod] = useState<string>("daily");
  
  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard", activePeriod],
  });
  
  // Get top 3 players
  const topPlayers = leaderboard?.slice(0, 3);

  return (
    <section className="py-12 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-8 flex items-center">
          <BarChart2 className="text-accent mr-3" />
          Top Players
        </h2>
        
        <div className="glassmorphic rounded-xl overflow-hidden">
          <div className="p-4 border-b border-primary/30">
            <div className="flex items-center space-x-4">
              <Button
                variant={activePeriod === "daily" ? "default" : "ghost"}
                onClick={() => setActivePeriod("daily")}
                className="px-4"
              >
                Daily
              </Button>
              <Button
                variant={activePeriod === "weekly" ? "default" : "ghost"}
                onClick={() => setActivePeriod("weekly")}
                className="px-4"
              >
                Weekly
              </Button>
              <Button
                variant={activePeriod === "monthly" ? "default" : "ghost"}
                onClick={() => setActivePeriod("monthly")}
                className="px-4"
              >
                Monthly
              </Button>
            </div>
          </div>
          
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
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, index) => (
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
                ) : topPlayers ? (
                  // Player entries
                  topPlayers.map((player, index) => (
                    <tr 
                      key={player.id}
                      className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold
                            ${index === 0 
                              ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                              : index === 1 
                                ? 'bg-primary/20 text-primary border border-primary/30' 
                                : 'bg-accent/20 text-accent border border-accent/30'
                            }`}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full overflow-hidden mr-3 border-2 ${
                            index === 0 ? 'border-secondary' : 
                            index === 1 ? 'border-primary' : 'border-accent'
                          }`}>
                            <img 
                              src={getDefaultAvatar(player.username)} 
                              alt={player.username} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className={`font-bold font-rajdhani ${
                              index === 0 ? 'text-secondary' : 
                              index === 1 ? 'text-primary' : 'text-accent'
                            }`}>
                              {player.username}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Team FireLords
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-foreground">
                        {player.matches}
                      </td>
                      <td className="py-4 px-6 text-right text-foreground">
                        {player.kills}
                      </td>
                      <td className="py-4 px-6 text-right text-foreground">
                        {player.wins}
                      </td>
                      <td className="py-4 px-6 text-right font-bold">
                        <span className={
                          index === 0 ? 'text-secondary' : 
                          index === 1 ? 'text-primary' : 'text-accent'
                        }>
                          {player.coins}
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
          
          <div className="p-4 flex justify-center">
            <Link href="/leaderboard">
              <a className="text-primary hover:text-secondary transition-colors font-rajdhani font-medium flex items-center">
                View Complete Leaderboard <ArrowRight className="ml-1" size={16} />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
