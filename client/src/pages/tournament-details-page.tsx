import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Clock, MapPin, Users, Trophy, Coins, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatTimeLeft, getGameModeBgColor } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Tournament, Participant } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch tournament details
  const { data: tournament, isLoading: isLoadingTournament } = useQuery<Tournament>({
    queryKey: [`/api/tournaments/${id}`],
    enabled: !!id,
  });
  
  // Fetch participants
  const { data: participants, isLoading: isLoadingParticipants } = useQuery<Participant[]>({
    queryKey: [`/api/tournaments/${id}/participants`],
    enabled: !!id,
  });
  
  // Join tournament mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/tournaments/${id}/join`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully joined tournament",
        description: "Check your dashboard for match details",
      });
      // Invalidate participants cache to refresh the list
      queryClient.invalidateQueries({
        queryKey: [`/api/tournaments/${id}/participants`],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to join tournament",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle join tournament
  const handleJoinTournament = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to login to join tournaments",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    joinMutation.mutate();
  };
  
  // Check if user has already joined
  const hasJoined = participants?.some(p => user && p.userId === user.id);
  
  // Set page title
  useEffect(() => {
    if (tournament) {
      document.title = `${tournament.title} | FireFight`;
    } else {
      document.title = "Tournament Details | FireFight";
    }
  }, [tournament]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => navigate("/tournaments")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to tournaments
        </Button>
        
        {isLoadingTournament ? (
          /* Tournament Details Skeleton */
          <div className="glassmorphic rounded-xl overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-6">
              <Skeleton className="h-8 w-2/3 mb-4" />
              <div className="flex flex-wrap gap-4 mb-6">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-28" />
              </div>
              <Skeleton className="h-24 w-full mb-6" />
              <Skeleton className="h-10 w-full md:w-48" />
            </div>
          </div>
        ) : tournament ? (
          <>
            {/* Tournament Banner & Info */}
            <div className="glassmorphic rounded-xl overflow-hidden mb-8">
              <div className="h-64 relative">
                {/* Placeholder banner with gradient background if no image */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
                
                {/* Optional banner image */}
                {tournament.bannerImage && (
                  <img 
                    src={tournament.bannerImage} 
                    alt={tournament.title} 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Tournament info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getGameModeBgColor(tournament.gameMode)} text-white`}>
                        {tournament.gameMode}
                      </span>
                      <h1 className="text-2xl md:text-3xl font-bold mt-2 font-orbitron">
                        {tournament.title}
                      </h1>
                    </div>
                    {tournament.startTime && (
                      <div className="px-3 py-1 rounded-full bg-background/80 border border-secondary/30 text-xs font-medium text-secondary flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeLeft(tournament.startTime)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-6 text-sm mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{tournament.mapName}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{participants?.length || 0}/{tournament.maxParticipants} Participants</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-secondary" />
                    <span>{formatCurrency(tournament.prizePool)} Prize Pool</span>
                  </div>
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-primary" />
                    <span>{tournament.entryFee} Coins Entry Fee</span>
                  </div>
                </div>
                
                {tournament.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 font-rajdhani">Description</h2>
                    <p className="text-muted-foreground">{tournament.description}</p>
                  </div>
                )}
                
                <Button 
                  size="lg"
                  className={`animate-pulse-glow ${hasJoined ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  disabled={joinMutation.isPending || hasJoined}
                  onClick={handleJoinTournament}
                >
                  {joinMutation.isPending ? 'Joining...' : hasJoined ? 'Joined ✓' : 'Join Tournament'}
                </Button>
              </div>
            </div>
            
            {/* Tabs for Rules, Participants, etc. */}
            <Tabs defaultValue="participants" className="glassmorphic rounded-xl p-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <TabsTrigger value="participants">Participants</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="prizes">Prizes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="participants" className="mt-6">
                <h2 className="text-lg font-bold mb-4 font-rajdhani">Participants</h2>
                
                {isLoadingParticipants ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : participants && participants.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {participants.map((participant) => (
                      <div 
                        key={participant.id} 
                        className="flex items-center p-3 border border-primary/20 rounded-lg bg-card/50"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 mr-3">
                          {/* Placeholder avatar */}
                        </div>
                        <div className="truncate">
                          <p className="font-medium truncate">Player {participant.userId}</p>
                          {participant.teamId && (
                            <p className="text-xs text-muted-foreground truncate">Team {participant.teamId}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No participants have joined yet. Be the first!</p>
                )}
              </TabsContent>
              
              <TabsContent value="rules" className="mt-6">
                <h2 className="text-lg font-bold mb-4 font-rajdhani">Tournament Rules</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>1. All participants must join the match room 15 minutes before the scheduled start time.</p>
                  <p>2. Players must use their registered Free Fire ID only.</p>
                  <p>3. Teaming with opponents is strictly prohibited and will result in disqualification.</p>
                  <p>4. Winners must upload a screenshot of the match result as proof.</p>
                  <p>5. Tournament admins' decisions are final in case of disputes.</p>
                  <p>6. Participants found using hacks or cheats will be banned permanently.</p>
                  <p>7. Points are awarded based on kills and survival placement.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="prizes" className="mt-6">
                <h2 className="text-lg font-bold mb-4 font-rajdhani">Prize Distribution</h2>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 mr-4">
                      <Trophy className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-lg font-rajdhani font-bold">1st Place</p>
                      <p className="text-lg text-secondary">{formatCurrency(tournament.prizePool * 0.6)}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mr-4">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-rajdhani font-bold">2nd Place</p>
                      <p className="text-lg text-primary">{formatCurrency(tournament.prizePool * 0.3)}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 mr-4">
                      <Trophy className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg font-rajdhani font-bold">3rd Place</p>
                      <p className="text-lg text-accent">{formatCurrency(tournament.prizePool * 0.1)}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold mb-2">Tournament not found</h3>
            <p className="text-muted-foreground">
              The tournament you're looking for doesn't exist or has been removed
            </p>
            <Button onClick={() => navigate("/tournaments")} className="mt-4">
              View All Tournaments
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}
