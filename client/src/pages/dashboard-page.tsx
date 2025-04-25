import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Tournament, Participant } from "@shared/schema";
import { CalendarDays, Clock, Trophy, Users, Swords, Eye, Upload, ChevronRight } from "lucide-react";
import { formatTimeLeft, getGameModeBgColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  // Fetch user's tournaments
  const { data: tournaments, isLoading: isLoadingTournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });
  
  // Fetch user's participants
  const { data: userParticipations, isLoading: isLoadingParticipations } = useQuery<Participant[]>({
    queryKey: ["/api/user/tournaments"],
  });
  
  // Filter tournaments that user has joined
  const joinedTournaments = tournaments?.filter(tournament => 
    userParticipations?.some(p => p.tournamentId === tournament.id)
  );
  
  // Set page title
  useEffect(() => {
    document.title = "Dashboard | FireFight";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-orbitron mb-2">
            Welcome, {user?.username || 'Gamer'}
          </h1>
          <p className="text-muted-foreground">
            Manage your tournaments, matches, and team from your dashboard
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Tournaments Joined</p>
                  <h3 className="text-2xl font-bold">
                    {isLoadingParticipations ? (
                      <Skeleton className="h-8 w-10" />
                    ) : (
                      userParticipations?.length || 0
                    )}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background/60 border-secondary/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50">
                  <Coins className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Your Balance</p>
                  <h3 className="text-2xl font-bold">
                    {user ? (
                      <>{user.coins} <span className="text-sm font-normal">Coins</span></>
                    ) : (
                      <Skeleton className="h-8 w-20" />
                    )}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background/60 border-accent/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50">
                  <Swords className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Matches Played</p>
                  <h3 className="text-2xl font-bold">
                    {isLoadingParticipations ? (
                      <Skeleton className="h-8 w-10" />
                    ) : (
                      userParticipations?.filter(p => p.status === "completed")?.length || 0
                    )}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Your Team</p>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-8 hover:bg-transparent hover:text-primary"
                    onClick={() => navigate("/team")}
                  >
                    Manage Team <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* My Tournaments Tabs */}
        <Card className="bg-background/60 border-primary/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="font-orbitron flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-secondary" /> 
              My Tournaments
            </CardTitle>
            <CardDescription>
              View and manage your tournament registrations
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="upcoming" className="px-6 pb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {isLoadingTournaments || isLoadingParticipations ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Card key={index} className="bg-card/50">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : joinedTournaments && joinedTournaments.filter(t => t.status === "Upcoming").length > 0 ? (
                <div className="space-y-4">
                  {joinedTournaments
                    .filter(t => t.status === "Upcoming")
                    .map(tournament => (
                      <Card key={tournament.id} className="bg-card/50 hover:bg-card/80 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getGameModeBgColor(tournament.gameMode)} text-white`}>
                                  {tournament.gameMode}
                                </span>
                                <h3 className="font-bold font-rajdhani">{tournament.title}</h3>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4 mr-1" />
                                <span className="mr-3">
                                  {new Date(tournament.startTime).toLocaleDateString()}
                                </span>
                                <Clock className="h-4 w-4 mr-1" />
                                <span>
                                  {new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/tournaments/${tournament.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-bold mb-2">No upcoming tournaments</h3>
                  <p className="text-muted-foreground mb-4">You haven't joined any upcoming tournaments yet.</p>
                  <Button onClick={() => navigate("/tournaments")}>
                    Browse Tournaments
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="live">
              {isLoadingTournaments || isLoadingParticipations ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : joinedTournaments && joinedTournaments.filter(t => t.status === "Live").length > 0 ? (
                <div className="space-y-4">
                  {joinedTournaments
                    .filter(t => t.status === "Live")
                    .map(tournament => (
                      <Card key={tournament.id} className="bg-card/50 hover:bg-card/80 transition-colors border-red-500/30">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-md bg-red-500 text-xs font-medium text-white flex items-center">
                                  <span className="relative flex h-2 w-2 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                  </span>
                                  LIVE
                                </span>
                                <h3 className="font-bold font-rajdhani">{tournament.title}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Match is currently in progress. Join the room now!
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <Eye className="h-4 w-4 mr-2" /> Enter Match
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                <Upload className="h-4 w-4 mr-2" /> Upload Result
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-bold mb-2">No live tournaments</h3>
                  <p className="text-muted-foreground mb-4">You don't have any tournaments currently live.</p>
                  <Button onClick={() => navigate("/tournaments")}>
                    Browse Tournaments
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {isLoadingTournaments || isLoadingParticipations ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Card key={index} className="bg-card/50">
                      <CardContent className="p-4">
                        <Skeleton className="h-28 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : joinedTournaments && joinedTournaments.filter(t => t.status === "Completed").length > 0 ? (
                <div className="space-y-4">
                  {joinedTournaments
                    .filter(t => t.status === "Completed")
                    .map(tournament => (
                      <Card key={tournament.id} className="bg-card/50 hover:bg-card/80 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getGameModeBgColor(tournament.gameMode)} text-white`}>
                                  {tournament.gameMode}
                                </span>
                                <h3 className="font-bold font-rajdhani">{tournament.title}</h3>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4 mr-1" />
                                <span>
                                  {new Date(tournament.startTime).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/tournaments/${tournament.id}`)}
                            >
                              View Results
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-bold mb-2">No completed tournaments</h3>
                  <p className="text-muted-foreground mb-4">You haven't completed any tournaments yet.</p>
                  <Button onClick={() => navigate("/tournaments")}>
                    Browse Tournaments
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Quick Actions */}
        <h2 className="text-xl font-bold font-orbitron mb-4 flex items-center">
          <Zap className="mr-2 h-5 w-5 text-secondary" /> Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-6 border-primary/30 hover:border-primary/60 justify-start"
            onClick={() => navigate("/tournaments")}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-2">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                <span className="font-bold font-rajdhani">Join Tournament</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Browse and join upcoming tournaments
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 border-secondary/30 hover:border-secondary/60 justify-start"
            onClick={() => navigate("/wallet")}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-2">
                <Wallet className="h-5 w-5 mr-2 text-secondary" />
                <span className="font-bold font-rajdhani">Add Coins</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Add coins to your wallet
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 border-accent/30 hover:border-accent/60 justify-start"
            onClick={() => navigate("/team")}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-accent" />
                <span className="font-bold font-rajdhani">Manage Team</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Create or manage your team
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 border-primary/30 hover:border-primary/60 justify-start"
            onClick={() => navigate("/profile")}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-2">
                <UserCircle className="h-5 w-5 mr-2 text-primary" />
                <span className="font-bold font-rajdhani">Edit Profile</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Update your profile information
              </p>
            </div>
          </Button>
        </div>
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}

// Additional icons used in this component
const Coins = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

const Wallet = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const Zap = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 3H4l2 9H2l10 9-3-9h7Z" />
  </svg>
);

const UserCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);
