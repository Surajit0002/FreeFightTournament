import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import TournamentCard from "@/components/tournaments/tournament-card";
import TournamentFilters from "@/components/tournaments/tournament-filters";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tournament } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentsPage() {
  // Set page title
  useEffect(() => {
    document.title = "Tournaments | FireFight";
  }, []);

  // State for filters and search
  const [gameMode, setGameMode] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch tournaments
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  // Filter tournaments based on selected filters and search query
  const filteredTournaments = tournaments?.filter((tournament) => {
    // Filter by game mode if selected
    if (gameMode && tournament.gameMode !== gameMode) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !tournament.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-orbitron mb-2">All Tournaments</h1>
            <p className="text-muted-foreground">
              Browse and join tournaments that match your skill level
            </p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tournaments..."
              className="pl-10 bg-card border-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <TournamentFilters 
            selectedMode={gameMode} 
            onModeChange={setGameMode}
          />
        </div>
        
        {/* Tournament Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glassmorphic rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTournaments && filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold mb-2">No tournaments found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new tournaments
            </p>
          </div>
        )}
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}
