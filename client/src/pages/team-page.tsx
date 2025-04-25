import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Team } from "@shared/schema";
import { 
  Users, UserPlus, Upload, Crown, Settings, 
  Shield, Trophy, ShieldCheck, UserX
} from "lucide-react";
import { getDefaultAvatar } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function TeamPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [teamLogo, setTeamLogo] = useState<string>("");
  const [inviteUsername, setInviteUsername] = useState<string>("");
  
  // Fetch user's teams
  const { data: teams, isLoading: isLoadingTeams } = useQuery<Team[]>({
    queryKey: ["/api/user/teams"],
  });
  
  // Team creation mutation
  const createTeamMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/teams", {
        name: newTeamName,
        logo: teamLogo,
        ownerId: user?.id
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Team created",
        description: `Team "${newTeamName}" has been created successfully`,
      });
      setNewTeamName("");
      setTeamLogo("");
      queryClient.invalidateQueries({
        queryKey: ["/api/user/teams"],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Team creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Team member invite mutation
  const inviteMemberMutation = useMutation({
    mutationFn: async (teamId: number) => {
      const res = await apiRequest("POST", `/api/teams/${teamId}/members`, {
        username: inviteUsername,
        role: "member"
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteUsername}`,
      });
      setInviteUsername("");
      queryClient.invalidateQueries({
        queryKey: ["/api/user/teams"],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Invitation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle team creation
  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }
    
    createTeamMutation.mutate();
  };
  
  // Handle team logo change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server or cloud storage
      // and get back a URL to use as the logo
      // For now, we'll just use a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setTeamLogo(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle member invitation
  const handleInviteMember = (teamId: number) => {
    if (!inviteUsername.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to invite",
        variant: "destructive",
      });
      return;
    }
    
    inviteMemberMutation.mutate(teamId);
  };
  
  // Set page title
  useEffect(() => {
    document.title = "Team Management | FireFight";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
            <Users className="mr-3 text-primary h-8 w-8" />
            Team Management
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and invite players to your teams
          </p>
        </div>
        
        {/* Team Management Interface */}
        <Tabs defaultValue="myTeams" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="myTeams">My Teams</TabsTrigger>
            <TabsTrigger value="createTeam">Create Team</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="myTeams">
            {isLoadingTeams ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="bg-background/60 border-primary/30 backdrop-blur-sm">
                    <div className="h-48 bg-background/30 animate-pulse" />
                    <CardContent className="p-6">
                      <div className="h-4 bg-background/30 rounded w-3/4 mb-4 animate-pulse" />
                      <div className="h-3 bg-background/30 rounded w-1/2 mb-6 animate-pulse" />
                      <div className="flex space-x-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-background/30 animate-pulse" />
                        <div className="h-8 w-8 rounded-full bg-background/30 animate-pulse" />
                        <div className="h-8 w-8 rounded-full bg-background/30 animate-pulse" />
                      </div>
                      <div className="h-10 bg-background/30 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : teams && teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <Card key={team.id} className="bg-background/60 border-primary/30 backdrop-blur-sm overflow-hidden">
                    <div className="h-48 relative">
                      {/* Team banner with gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
                      
                      {/* Team logo overlay */}
                      {team.logo ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img 
                            src={team.logo} 
                            alt={team.name} 
                            className="max-h-32 max-w-32"
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-background/60 border-2 border-primary flex items-center justify-center">
                            <span className="text-3xl font-bold font-rajdhani">
                              {team.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      {/* Team name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h2 className="text-2xl font-bold font-rajdhani text-white">
                          {team.name}
                        </h2>
                        {team.ownerId === user?.id && (
                          <p className="flex items-center text-sm text-secondary">
                            <Crown className="h-4 w-4 mr-1 text-secondary" /> You are the Team Owner
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-medium mb-3">Team Members</h3>
                      
                      {/* Mock team members - in a real app, fetch these from API */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar className="h-8 w-8 border border-primary">
                              <AvatarImage src={user && getDefaultAvatar(user.username)} alt={user?.username} />
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {user?.username?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {team.ownerId === user?.id && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary flex items-center justify-center">
                                <Crown className="h-2.5 w-2.5 text-black" />
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Sample additional members - in a real app, map over actual members */}
                        <Avatar className="h-8 w-8 border border-primary/50">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">TM</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border border-primary/50">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">DP</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border border-primary/50 opacity-50">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">+</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      {/* Team Actions */}
                      <div className="space-y-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full flex items-center border-primary/30 hover:border-primary/60">
                              <UserPlus className="h-4 w-4 mr-2" /> Invite Players
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Invite Players</DialogTitle>
                              <DialogDescription>
                                Enter the username of the player you want to invite to {team.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                  <Input 
                                    placeholder="Username" 
                                    value={inviteUsername} 
                                    onChange={(e) => setInviteUsername(e.target.value)}
                                    className="bg-card border-primary/30"
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={() => handleInviteMember(team.id)}
                                disabled={inviteMemberMutation.isPending || !inviteUsername.trim()}
                              >
                                {inviteMemberMutation.isPending ? 'Sending...' : 'Send Invite'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        {team.ownerId === user?.id && (
                          <Button variant="outline" className="w-full flex items-center border-secondary/30 hover:border-secondary/60">
                            <Settings className="h-4 w-4 mr-2" /> Manage Team
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-bold mb-2">No teams yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created or joined any teams yet. Create a team to participate in duo and squad tournaments!
                </p>
                <Button onClick={() => document.getElementById('create-team-tab')?.click()}>
                  Create a Team
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="createTeam" id="create-team-tab">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-rajdhani flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" /> 
                    Create a New Team
                  </CardTitle>
                  <CardDescription>
                    Form your squad and compete in tournaments together
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Team Name
                      </label>
                      <Input 
                        placeholder="Enter your team name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        className="bg-card border-primary/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Team Logo (Optional)
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center overflow-hidden">
                          {teamLogo ? (
                            <img src={teamLogo} alt="Team Logo" className="w-full h-full object-cover" />
                          ) : (
                            <Upload className="h-6 w-6 text-primary/50" />
                          )}
                        </div>
                        <div>
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm" className="border-primary/30">
                              <Upload className="h-4 w-4 mr-2" /> Upload Logo
                            </Button>
                            <input 
                              id="logo-upload" 
                              type="file" 
                              accept="image/*" 
                              onChange={handleLogoChange} 
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-muted-foreground mt-2">
                            Recommended: 200x200 px
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <CardFooter className="px-0 pt-4">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={createTeamMutation.isPending || !newTeamName.trim()}
                      >
                        {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-lg">
                      Team Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Participate in Squad Tournaments</p>
                        <p className="text-xs text-muted-foreground">
                          Join squad tournaments with higher prize pools
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                        <Trophy className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">Team Leaderboard</p>
                        <p className="text-xs text-muted-foreground">
                          Climb the team rankings and earn recognition
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Team Communication</p>
                        <p className="text-xs text-muted-foreground">
                          Coordinate with your teammates easily
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-lg">
                      Team Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">1</span>
                      </div>
                      <p className="text-sm">Team names must not contain offensive language</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">2</span>
                      </div>
                      <p className="text-sm">A team can have up to 6 members (4 main + 2 subs)</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <p className="text-sm">Team members can be kicked by the team owner</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">4</span>
                      </div>
                      <p className="text-sm">A player can only be part of one team at a time</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="invitations">
            <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-rajdhani">
                  Team Invitations
                </CardTitle>
                <CardDescription>
                  Invitations you've received to join other teams
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* In a real app, fetch invitations from API */}
                <div className="text-center py-8">
                  <h3 className="text-lg font-bold mb-2">No invitations</h3>
                  <p className="text-muted-foreground">
                    You don't have any pending team invitations
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Team Stats (can be expanded in a real app) */}
        <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-rajdhani flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-secondary" /> 
              Team Statistics
            </CardTitle>
            <CardDescription>
              View performance statistics for your teams
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoadingTeams ? (
              <div className="h-32 bg-background/30 animate-pulse rounded-md" />
            ) : teams && teams.length > 0 ? (
              <div className="space-y-6">
                {teams.map((team) => (
                  <div key={team.id} className="space-y-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3 border border-primary">
                        {team.logo ? (
                          <AvatarImage src={team.logo} alt={team.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {team.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold">{team.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border border-primary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Tournaments</p>
                        <p className="text-2xl font-bold font-rajdhani">5</p>
                      </div>
                      
                      <div className="p-4 border border-primary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Wins</p>
                        <p className="text-2xl font-bold font-rajdhani text-secondary">2</p>
                      </div>
                      
                      <div className="p-4 border border-primary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-2xl font-bold font-rajdhani">40%</p>
                      </div>
                      
                      <div className="p-4 border border-primary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Kills</p>
                        <p className="text-2xl font-bold font-rajdhani text-accent">86</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="border-primary/30">
                        View Detailed Stats
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-bold mb-2">No team statistics</h3>
                <p className="text-muted-foreground mb-4">
                  Create or join a team to view team statistics
                </p>
                <Button onClick={() => document.getElementById('create-team-tab')?.click()}>
                  Create a Team
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}
