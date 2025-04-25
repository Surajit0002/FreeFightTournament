import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, UserPlus, Users, Plus, MessageSquare, UserX, Crown, Shield, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getDefaultAvatar } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Types for team management
type TeamMember = {
  id: number;
  username: string;
  role: "owner" | "captain" | "member";
  avatar?: string;
};

type Team = {
  id: number;
  name: string;
  tag: string;
  description?: string;
  logo?: string;
  ownerId: number;
  members: TeamMember[];
  stats: {
    matches: number;
    wins: number;
    kills: number;
    rank: number;
  };
};

// Sample data to show UI
const SAMPLE_TEAMS: Team[] = [
  {
    id: 1,
    name: "🔥 Pro Squad Arena",
    tag: "PSA",
    description: "We're a serious team focused on competitive tournaments and ranking up!",
    ownerId: 1,
    members: [
      { id: 1, username: "kingcom", role: "owner" },
      { id: 2, username: "HeadShot42", role: "captain" },
      { id: 3, username: "SnipeKing", role: "member" },
      { id: 4, username: "FireStorm", role: "member" }
    ],
    stats: {
      matches: 36,
      wins: 15,
      kills: 245,
      rank: 124
    }
  },
  {
    id: 2,
    name: "💥 Elite Duo Battle",
    tag: "EDB",
    description: "Casual duo team for weekend tournaments",
    ownerId: 1,
    members: [
      { id: 1, username: "kingcom", role: "owner" },
      { id: 5, username: "ShadowPlayer", role: "member" }
    ],
    stats: {
      matches: 12,
      wins: 3,
      kills: 78,
      rank: 456
    }
  }
];

// Schema for team creation
const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(20, "Team name must be less than 20 characters"),
  tag: z.string().min(2, "Team tag must be at least 2 characters").max(5, "Team tag must be less than 5 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

// Schema for member invitation
const inviteMemberSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export default function TeamPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Forms setup
  const createTeamForm = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      tag: "",
      description: ""
    }
  });

  const inviteMemberForm = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      username: ""
    }
  });

  // API query, showing sample data for UI mockup
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ['/api/user/teams'],
    enabled: !!user,
    initialData: SAMPLE_TEAMS
  });

  // API mutations
  const createTeamMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createTeamSchema>) => {
      const res = await apiRequest("POST", "/api/teams", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Team created successfully",
        description: "You can now invite members to your team"
      });
      setCreateDialogOpen(false);
      createTeamForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/user/teams'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create team",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (data: z.infer<typeof inviteMemberSchema>) => {
      if (!selectedTeam) throw new Error("No team selected");
      const res = await apiRequest("POST", `/api/teams/${selectedTeam.id}/invite`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation sent",
        description: "Player will receive your team invitation"
      });
      setInviteDialogOpen(false);
      inviteMemberForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/user/teams'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to invite member",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Form handlers
  const onCreateTeamSubmit = (data: z.infer<typeof createTeamSchema>) => {
    createTeamMutation.mutate(data);
  };

  const onInviteMemberSubmit = (data: z.infer<typeof inviteMemberSchema>) => {
    inviteMemberMutation.mutate(data);
  };

  // Helper functions
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-secondary" />;
      case 'captain':
        return <Shield className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <h1 className="text-3xl font-bold font-orbitron mb-6">Team Management</h1>

        {!user ? (
          <div className="glassmorphic p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-4">You need to login to view and manage your teams</p>
            <Button onClick={() => window.location.href = "/auth"}>Login / Register</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Selection Panel */}
            <div className="lg:col-span-1">
              <Card className="glassmorphic">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-rajdhani">My Teams</CardTitle>
                  <Button size="sm" variant="default" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Create Team
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 rounded-md bg-muted/30 animate-pulse"></div>
                      ))}
                    </div>
                  ) : teams && teams.length > 0 ? (
                    <div className="space-y-3">
                      {teams.map(team => (
                        <div 
                          key={team.id}
                          className={`p-3 rounded-md cursor-pointer transition-colors
                            ${selectedTeam?.id === team.id 
                              ? 'bg-primary/20 border border-primary/50' 
                              : 'bg-card/80 hover:bg-muted/30 border border-transparent'
                            }`}
                          onClick={() => setSelectedTeam(team)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary font-bold">
                              {team.tag}
                            </div>
                            <div>
                              <h3 className="font-medium">{team.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {team.members?.length || 0} members • 
                                {team.ownerId === user?.id ? ' Owner' : ' Member'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
                      <p className="text-muted-foreground mb-4">Create a team to participate in squad tournaments</p>
                      <Button onClick={() => setCreateDialogOpen(true)}>Create Your First Team</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Team Details Panel */}
            <div className="lg:col-span-2">
              {selectedTeam ? (
                <Card className="glassmorphic">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-4 border-2 border-primary/50">
                          <span className="font-bold text-2xl text-primary">{selectedTeam.tag}</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-orbitron font-bold">{selectedTeam.name}</h2>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {selectedTeam.members.length} members
                            </Badge>
                            <Badge variant="secondary">
                              #{selectedTeam.stats.rank} Rank
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {selectedTeam.ownerId === user?.id && (
                        <div className="flex space-x-2">
                          <Button size="sm" className="gap-1" onClick={() => setInviteDialogOpen(true)}>
                            <UserPlus className="h-4 w-4" />
                            Invite
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>

                    {selectedTeam.description && (
                      <div className="mb-6">
                        <p className="text-muted-foreground">{selectedTeam.description}</p>
                      </div>
                    )}

                    <Tabs defaultValue="members">
                      <TabsList className="mb-4">
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
                        <TabsTrigger value="chat">Team Chat</TabsTrigger>
                      </TabsList>

                      <TabsContent value="members">
                        <h3 className="text-lg font-bold mb-4 font-rajdhani">Team Members</h3>
                        <div className="space-y-3">
                          {selectedTeam.members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 rounded-md bg-muted/20 border border-border">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{getDefaultAvatar(member.username)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-medium">{member.username}</h4>
                                    <Badge className="ml-2" variant="outline">
                                      <span className="flex items-center gap-1">
                                        {getRoleIcon(member.role)}
                                        <span className="capitalize">{member.role}</span>
                                      </span>
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {selectedTeam.ownerId === user?.id && member.id !== user.id && (
                                <Button size="sm" variant="ghost" className="text-destructive">
                                  <UserX className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="stats">
                        <h3 className="text-lg font-bold mb-4 font-rajdhani">Team Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-xs text-muted-foreground">Matches</p>
                              <p className="text-2xl font-bold">{selectedTeam.stats.matches}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-xs text-muted-foreground">Wins</p>
                              <p className="text-2xl font-bold text-secondary">{selectedTeam.stats.wins}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-xs text-muted-foreground">Kills</p>
                              <p className="text-2xl font-bold text-primary">{selectedTeam.stats.kills}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-xs text-muted-foreground">Rank</p>
                              <p className="text-2xl font-bold text-accent">#{selectedTeam.stats.rank}</p>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Win Rate</h4>
                          <div className="w-full h-4 bg-muted/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-secondary" 
                              style={{ width: `${(selectedTeam.stats.wins / selectedTeam.stats.matches) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-right text-sm text-muted-foreground mt-1">
                            {Math.round((selectedTeam.stats.wins / selectedTeam.stats.matches) * 100)}%
                          </p>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Average Kills Per Match</h4>
                          <p className="text-3xl font-rajdhani font-bold text-primary">
                            {(selectedTeam.stats.kills / selectedTeam.stats.matches).toFixed(1)}
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="tournaments">
                        <h3 className="text-lg font-bold mb-4 font-rajdhani">Recent Tournaments</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-md border border-border bg-muted/10 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center mr-3">
                                <Trophy className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Pro Squad Championship</h4>
                                <p className="text-xs text-muted-foreground">Upcoming • April 30, 8:00 PM</p>
                              </div>
                            </div>
                            <Badge className="bg-green-600">Registered</Badge>
                          </div>

                          <div className="p-4 rounded-md border border-border bg-muted/10 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-md bg-secondary/20 flex items-center justify-center mr-3">
                                <Trophy className="h-6 w-6 text-secondary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Weekend Warfare</h4>
                                <p className="text-xs text-muted-foreground">Completed • April 23, 2025</p>
                              </div>
                            </div>
                            <Badge variant="outline">3rd Place</Badge>
                          </div>

                          <div className="p-4 rounded-md border border-border bg-muted/10 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-md bg-accent/20 flex items-center justify-center mr-3">
                                <Trophy className="h-6 w-6 text-accent" />
                              </div>
                              <div>
                                <h4 className="font-medium">Season Qualifier</h4>
                                <p className="text-xs text-muted-foreground">Completed • April 16, 2025</p>
                              </div>
                            </div>
                            <Badge variant="outline">5th Place</Badge>
                          </div>
                        </div>

                        <Button className="w-full mt-6">
                          View All Tournaments
                        </Button>
                      </TabsContent>

                      <TabsContent value="chat">
                        <h3 className="text-lg font-bold mb-4 font-rajdhani">Team Chat</h3>
                        <div className="h-64 border border-border rounded-md p-4 mb-4">
                          <div className="flex items-start mb-4">
                            <Avatar className="mr-2">
                              <AvatarFallback>HS</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-2 rounded-md rounded-tl-none">
                              <p className="text-xs text-muted-foreground mb-1">HeadShot42</p>
                              <p>Everyone ready for tonight's match?</p>
                            </div>
                          </div>

                          <div className="flex items-start justify-end mb-4">
                            <div className="bg-primary/20 p-2 rounded-md rounded-tr-none">
                              <p className="text-xs text-muted-foreground mb-1">You</p>
                              <p>Yes, I'll be online at 8pm sharp!</p>
                            </div>
                            <Avatar className="ml-2">
                              <AvatarFallback>{getDefaultAvatar(user?.username || "User")}</AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="text-center text-xs text-muted-foreground my-2">
                            <Separator className="mb-2" />
                            <span>Today</span>
                            <Separator className="mt-2" />
                          </div>

                          <div className="flex items-start mb-4">
                            <Avatar className="mr-2">
                              <AvatarFallback>SK</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-2 rounded-md rounded-tl-none">
                              <p className="text-xs text-muted-foreground mb-1">SnipeKing</p>
                              <p>I'll handle the sniper position. Let's meet at Observatory.</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Input placeholder="Type your message..." className="flex-grow" />
                          <Button>
                            <MessageSquare className="h-4 w-4 mr-1" /> Send
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glassmorphic">
                  <CardContent className="p-6 text-center py-16">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-bold mb-2">Select a Team</h2>
                    <p className="text-muted-foreground mb-4">
                      {teams && teams.length > 0 
                        ? "Choose a team from the list to view details" 
                        : "Create your first team to get started"}
                    </p>
                    {(!teams || teams.length === 0) && (
                      <Button onClick={() => setCreateDialogOpen(true)}>Create Team</Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Team Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-orbitron">Create a New Team</DialogTitle>
            <DialogDescription>
              Form a squad to participate in team tournaments and climb the ranks together.
            </DialogDescription>
          </DialogHeader>

          <Form {...createTeamForm}>
            <form onSubmit={createTeamForm.handleSubmit(onCreateTeamSubmit)} className="space-y-4">
              <FormField
                control={createTeamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="FireFighters" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a unique name for your team.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createTeamForm.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="FF" maxLength={5} {...field} />
                    </FormControl>
                    <FormDescription>
                      A short tag (2-5 characters) that represents your team.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createTeamForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="We are a competitive squad focused on strategic gameplay and coordination." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createTeamMutation.isPending}
                  className="w-full"
                >
                  {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-orbitron">Invite Player</DialogTitle>
            <DialogDescription>
              Enter a player's username to invite them to your team.
            </DialogDescription>
          </DialogHeader>

          <Form {...inviteMemberForm}>
            <form onSubmit={inviteMemberForm.handleSubmit(onInviteMemberSubmit)} className="space-y-4">
              <FormField
                control={inviteMemberForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormDescription>
                      The player must have an account on FireFight.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={inviteMemberMutation.isPending}
                  className="w-full"
                >
                  {inviteMemberMutation.isPending ? 'Sending Invite...' : 'Send Invite'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
      <MobileNavbar />
    </div>
  );
}