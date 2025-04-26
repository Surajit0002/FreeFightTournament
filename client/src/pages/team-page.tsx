import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Trophy, UserPlus, Users, Plus, MessageSquare, UserX, Crown, Shield, Edit,
  Upload, Copy, Share2, Ban, Swords, Target, Zap, Smile, Crosshair,
  LogOut, AlertTriangle, Trash2, CheckCircle, X, ChevronDown, 
  ArrowRight, ArrowUpRight, User, Gauge
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getDefaultAvatar } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Enhanced types for team management
type PlayerRole = "owner" | "captain" | "sniper" | "support" | "igl" | "entry" | "flex" | "member";

type TeamMember = {
  id: number;
  username: string;
  role: PlayerRole;
  avatar?: string;
  status: "active" | "pending";
  joinedAt: string;
  stats?: {
    kills: number;
    deaths: number;
    matches: number;
    winRate: number;
    kd: number;
  };
};

type Invitation = {
  id: number;
  teamId: number;
  teamName: string;
  teamTag: string;
  invitedBy: string;
  status: "pending" | "accepted" | "declined";
  timestamp: string;
};

type Team = {
  id: number;
  name: string;
  tag: string;
  description?: string;
  logo?: string;
  ownerId: number;
  createdAt: string;
  inviteCode: string;
  members: TeamMember[];
  pendingInvites: string[];
  achievements: Achievement[];
  stats: {
    matches: number;
    wins: number;
    kills: number;
    rank: number;
    level: number;
    xp: number;
    nextLevelXp: number;
    synergy: number;
  };
};

type Achievement = {
  id: number;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  achieved: boolean;
  unlockedAt?: string;
};

// Generate sample data with enhanced properties
const generateSampleTeams = (userId: number): Team[] => {
  const team1Members: TeamMember[] = [
    { 
      id: userId, 
      username: "You", 
      role: "owner", 
      status: "active", 
      joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      stats: { kills: 128, deaths: 67, matches: 36, winRate: 42, kd: 1.91 }
    },
    { 
      id: 2, 
      username: "HeadShot42", 
      role: "captain", 
      status: "active", 
      joinedAt: new Date(Date.now() - 28 * 86400000).toISOString(),
      stats: { kills: 156, deaths: 98, matches: 36, winRate: 42, kd: 1.59 }
    },
    { 
      id: 3, 
      username: "SnipeKing", 
      role: "sniper", 
      status: "active", 
      joinedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      stats: { kills: 189, deaths: 87, matches: 36, winRate: 42, kd: 2.17 }
    },
    { 
      id: 4, 
      username: "FireStorm", 
      role: "entry", 
      status: "active", 
      joinedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      stats: { kills: 167, deaths: 102, matches: 36, winRate: 42, kd: 1.64 }
    },
  ];

  const team2Members: TeamMember[] = [
    { 
      id: userId, 
      username: "You", 
      role: "owner", 
      status: "active", 
      joinedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      stats: { kills: 46, deaths: 31, matches: 12, winRate: 25, kd: 1.48 }
    },
    { 
      id: 5, 
      username: "ShadowPlayer", 
      role: "support", 
      status: "active", 
      joinedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      stats: { kills: 32, deaths: 47, matches: 12, winRate: 25, kd: 0.68 }
    },
  ];

  return [
    {
      id: 1,
      name: "🔥 Pro Squad Arena",
      tag: "PSA",
      description: "We're a serious team focused on competitive tournaments and ranking up! Looking for skilled players with good communication.",
      logo: "",
      ownerId: userId,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      inviteCode: "PSA-1234",
      members: team1Members,
      pendingInvites: ["NinjaWarrior92", "GhostSniper"],
      achievements: [
        {
          id: 1,
          name: "Squad Champions",
          description: "Win 10 squad tournaments",
          icon: "trophy",
          progress: 7,
          maxProgress: 10,
          achieved: false
        },
        {
          id: 2,
          name: "Perfect Synergy",
          description: "Play 25 matches with the same squad",
          icon: "users",
          progress: 25,
          maxProgress: 25,
          achieved: true,
          unlockedAt: new Date(Date.now() - 5 * 86400000).toISOString()
        }
      ],
      stats: {
        matches: 36,
        wins: 15,
        kills: 640,
        rank: 124,
        level: 7,
        xp: 3200,
        nextLevelXp: 4000,
        synergy: 85
      }
    },
    {
      id: 2,
      name: "💥 Elite Duo Battle",
      tag: "EDB",
      description: "Casual duo team for weekend tournaments. All skill levels welcome!",
      logo: "",
      ownerId: userId,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      inviteCode: "EDB-5678",
      members: team2Members,
      pendingInvites: [],
      achievements: [
        {
          id: 3,
          name: "Dynamic Duo",
          description: "Win 5 duo tournaments",
          icon: "award",
          progress: 2,
          maxProgress: 5,
          achieved: false
        }
      ],
      stats: {
        matches: 12,
        wins: 3,
        kills: 78,
        rank: 456,
        level: 3,
        xp: 800,
        nextLevelXp: 1200,
        synergy: 62
      }
    }
  ];
};

// Sample invitations
const generateSampleInvitations = (): Invitation[] => {
  return [
    {
      id: 1,
      teamId: 3,
      teamName: "⚡ Flash Tactics",
      teamTag: "FT",
      invitedBy: "SpeedDemon",
      status: "pending",
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 2,
      teamId: 4,
      teamName: "🎯 Precision Squad",
      teamTag: "PS",
      invitedBy: "AimKing",
      status: "pending",
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ];
};

// Enhanced schemas
const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(25, "Team name must be less than 25 characters"),
  tag: z.string().min(2, "Team tag must be at least 2 characters").max(5, "Team tag must be less than 5 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  logo: z.any().optional(),
});

const inviteMemberSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

const editTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(25, "Team name must be less than 25 characters"),
  tag: z.string().min(2, "Team tag must be at least 2 characters").max(5, "Team tag must be less than 5 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  logo: z.any().optional(),
});

const changeMemberRoleSchema = z.object({
  userId: z.number(),
  role: z.string(),
});

// Utility functions
const getRoleIcon = (role: PlayerRole) => {
  switch (role) {
    case 'owner':
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case 'captain':
      return <Shield className="h-4 w-4 text-primary" />;
    case 'sniper':
      return <Crosshair className="h-4 w-4 text-red-500" />;
    case 'support':
      return <Smile className="h-4 w-4 text-green-500" />;
    case 'igl':
      return <Zap className="h-4 w-4 text-purple-500" />;
    case 'entry':
      return <Swords className="h-4 w-4 text-orange-500" />;
    case 'flex':
      return <Target className="h-4 w-4 text-blue-500" />;
    default:
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};

const getRoleColor = (role: PlayerRole) => {
  switch (role) {
    case 'owner':
      return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
    case 'captain':
      return 'text-primary border-primary/30 bg-primary/10';
    case 'sniper':
      return 'text-red-500 border-red-500/30 bg-red-500/10';
    case 'support':
      return 'text-green-500 border-green-500/30 bg-green-500/10';
    case 'igl':
      return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
    case 'entry':
      return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    case 'flex':
      return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
    default:
      return 'text-muted-foreground border-muted-foreground/30 bg-muted-foreground/10';
  }
};

const getRoleName = (role: PlayerRole) => {
  switch (role) {
    case 'igl':
      return 'In-Game Leader';
    case 'entry':
      return 'Entry Fragger';
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

export default function TeamPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editTeamDialogOpen, setEditTeamDialogOpen] = useState(false);
  const [changeMemberRoleDialogOpen, setChangeMemberRoleDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'leave' | 'remove' | 'disband'; 
    title: string; 
    description: string;
    targetId?: number;
    teamId?: number;
  } | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState("members");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isInviteLinkCopied, setIsInviteLinkCopied] = useState(false);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

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

  const editTeamForm = useForm<z.infer<typeof editTeamSchema>>({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name: selectedTeam?.name || "",
      tag: selectedTeam?.tag || "",
      description: selectedTeam?.description || ""
    }
  });

  const changeMemberRoleForm = useForm<z.infer<typeof changeMemberRoleSchema>>({
    resolver: zodResolver(changeMemberRoleSchema),
    defaultValues: {
      userId: selectedMember?.id || 0,
      role: selectedMember?.role || "member"
    }
  });

  // Update edit form when selected team changes
  useEffect(() => {
    if (selectedTeam) {
      editTeamForm.reset({
        name: selectedTeam.name,
        tag: selectedTeam.tag,
        description: selectedTeam.description || ""
      });
    }
  }, [selectedTeam, editTeamForm]);

  // Update role form when selected member changes
  useEffect(() => {
    if (selectedMember) {
      changeMemberRoleForm.reset({
        userId: selectedMember.id,
        role: selectedMember.role
      });
    }
  }, [selectedMember, changeMemberRoleForm]);

  // API queries with sample data
  const { data: teams, isLoading: isLoadingTeams } = useQuery<Team[]>({
    queryKey: ['/api/user/teams'],
    enabled: !!user,
    initialData: user ? generateSampleTeams(user.id) : []
  });

  const { data: invitations } = useQuery<Invitation[]>({
    queryKey: ['/api/user/invitations'],
    enabled: !!user,
    initialData: generateSampleInvitations()
  });

  // API mutations
  const createTeamMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createTeamSchema>) => {
      // Handle file upload separately if needed
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('tag', data.tag);
      if (data.description) formData.append('description', data.description);
      if (data.logo && data.logo[0]) formData.append('logo', data.logo[0]);
      
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
      setLogoPreview(null);
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

  const editTeamMutation = useMutation({
    mutationFn: async (data: z.infer<typeof editTeamSchema>) => {
      if (!selectedTeam) throw new Error("No team selected");
      
      // Handle file upload separately if needed
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('tag', data.tag);
      if (data.description) formData.append('description', data.description);
      if (data.logo && data.logo[0]) formData.append('logo', data.logo[0]);
      
      const res = await apiRequest("PATCH", `/api/teams/${selectedTeam.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Team updated successfully",
        description: "Your team information has been updated"
      });
      setEditTeamDialogOpen(false);
      setLogoPreview(null);
      queryClient.invalidateQueries({ queryKey: ['/api/user/teams'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update team",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const changeMemberRoleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof changeMemberRoleSchema>) => {
      if (!selectedTeam) throw new Error("No team selected");
      const res = await apiRequest("PATCH", `/api/teams/${selectedTeam.id}/members/${data.userId}`, { role: data.role });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Role updated",
        description: `Player role has been updated to ${changeMemberRoleForm.getValues().role}`
      });
      setChangeMemberRoleDialogOpen(false);
      setSelectedMember(null);
      queryClient.invalidateQueries({ queryKey: ['/api/user/teams'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const removeTeamMemberMutation = useMutation({
    mutationFn: async (data: { teamId: number, userId: number }) => {
      const res = await apiRequest("DELETE", `/api/teams/${data.teamId}/members/${data.userId}`);
      return res.status === 204 ? {} : await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Member removed",
        description: "The player has been removed from your team"
      });
      setConfirmDialogOpen(false);
      setConfirmAction(null);
      queryClient.invalidateQueries({ queryKey: ['/api/user/teams'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove member",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const leaveTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      const res = await apiRequest("DELETE", `/api/teams/${teamId}/leave`);
      return res.status === 204 ? {} : await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Team left",
        description: "You have left the team"
      });
      setConfirmDialogOpen(false);
      setConfirmAction(null);
      setSelectedTeam(null);
      queryClient.invalidateQueries({ queryKey: ['/api/user/teams'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to leave team",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const disbandTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      const res = await apiRequest("DELETE", `/api/teams/${teamId}`);
      return res.status === 204 ? {} : await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Team disbanded",
        description: "The team has been permanently disbanded"
      });
      setConfirmDialogOpen(false);
      setConfirmAction(null);
      setSelectedTeam(null);
      queryClient.invalidateQueries({ queryKey: ['/api/user/teams'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to disband team",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const respondToInvitationMutation = useMutation({
    mutationFn: async (data: { invitationId: number, accept: boolean }) => {
      const res = await apiRequest(
        "POST", 
        `/api/invitations/${data.invitationId}/respond`, 
        { accept: data.accept }
      );
      return await res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.accept ? "Invitation accepted" : "Invitation declined",
        description: variables.accept 
          ? "You have joined the team!" 
          : "The invitation has been declined"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/invitations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/teams'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to respond to invitation",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Form event handlers
  const onCreateTeamSubmit = (data: z.infer<typeof createTeamSchema>) => {
    createTeamMutation.mutate(data);
  };

  const onInviteMemberSubmit = (data: z.infer<typeof inviteMemberSchema>) => {
    inviteMemberMutation.mutate(data);
  };

  const onEditTeamSubmit = (data: z.infer<typeof editTeamSchema>) => {
    editTeamMutation.mutate(data);
  };

  const onChangeMemberRoleSubmit = (data: z.infer<typeof changeMemberRoleSchema>) => {
    changeMemberRoleMutation.mutate(data);
  };

  // Helper functions
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, form: any) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("logo", e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMember = (teamId: number, memberId: number, username: string) => {
    setConfirmAction({
      type: 'remove',
      title: 'Remove Team Member',
      description: `Are you sure you want to remove ${username} from your team?`,
      targetId: memberId,
      teamId: teamId
    });
    setConfirmDialogOpen(true);
  };

  const handleLeaveTeam = (teamId: number, teamName: string) => {
    setConfirmAction({
      type: 'leave',
      title: 'Leave Team',
      description: `Are you sure you want to leave ${teamName}? You will lose access to team chat and tournaments.`,
      teamId: teamId
    });
    setConfirmDialogOpen(true);
  };

  const handleDisbandTeam = (teamId: number, teamName: string) => {
    setConfirmAction({
      type: 'disband',
      title: 'Disband Team',
      description: `Are you sure you want to permanently disband ${teamName}? This action cannot be undone and all team data will be lost.`,
      teamId: teamId
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    
    switch (confirmAction.type) {
      case 'remove':
        if (confirmAction.teamId && confirmAction.targetId) {
          removeTeamMemberMutation.mutate({
            teamId: confirmAction.teamId,
            userId: confirmAction.targetId
          });
        }
        break;
      case 'leave':
        if (confirmAction.teamId) {
          leaveTeamMutation.mutate(confirmAction.teamId);
        }
        break;
      case 'disband':
        if (confirmAction.teamId) {
          disbandTeamMutation.mutate(confirmAction.teamId);
        }
        break;
    }
  };

  const handleChangeMemberRole = (member: TeamMember) => {
    setSelectedMember(member);
    setChangeMemberRoleDialogOpen(true);
  };

  const handleCopyInviteLink = () => {
    if (!selectedTeam) return;
    
    const inviteLink = `${window.location.origin}/join-team?code=${selectedTeam.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setIsInviteLinkCopied(true);
    
    toast({
      title: "Invite link copied",
      description: "You can now share this link with other players"
    });
    
    setTimeout(() => setIsInviteLinkCopied(false), 3000);
  };

  const handleRespondToInvitation = (invitationId: number, accept: boolean) => {
    respondToInvitationMutation.mutate({ invitationId, accept });
  };

  const handleViewAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setAchievementModalOpen(true);
  };

  // UI Elements
  const renderTeamLogo = (team: Team, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-10 h-10 text-lg',
      md: 'w-16 h-16 text-2xl',
      lg: 'w-24 h-24 text-4xl'
    };
    
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50`}>
        {team.logo ? (
          <img 
            src={team.logo} 
            alt={team.name} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="font-bold text-primary">{team.tag}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold font-orbitron">Team Management</h1>
            <p className="text-muted-foreground">Create, manage and compete with your squad</p>
          </motion.div>

          {user && invitations && invitations.length > 0 && (
            <motion.div variants={itemVariants}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative">
                    Team Invitations
                    <Badge className="ml-2 bg-secondary">{invitations.length}</Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="font-medium">Team Invitations</h3>
                    <p className="text-xs text-muted-foreground">
                      Respond to your pending team invites
                    </p>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {invitations.map(invitation => (
                      <div 
                        key={invitation.id} 
                        className="px-4 py-3 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {invitation.teamTag}
                          </div>
                          <div>
                            <p className="font-medium">{invitation.teamName}</p>
                            <p className="text-xs text-muted-foreground">
                              Invited by {invitation.invitedBy} • {new Date(invitation.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleRespondToInvitation(invitation.id, true)}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleRespondToInvitation(invitation.id, false)}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          )}
        </motion.div>

        {!user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glassmorphic p-6 text-center"
          >
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-4">You need to login to view and manage your teams</p>
            <Button onClick={() => window.location.href = "/auth"}>Login / Register</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Selection Panel */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-1"
            >
              <Card className="glassmorphic overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-orbitron">My Teams</CardTitle>
                  <Button size="sm" variant="default" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Create Team
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingTeams ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 rounded-md bg-muted/30 animate-pulse"></div>
                      ))}
                    </div>
                  ) : teams && teams.length > 0 ? (
                    <div className="space-y-3">
                      {teams.map(team => (
                        <motion.div 
                          key={team.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className={`p-3 rounded-md cursor-pointer transition-all
                            ${selectedTeam?.id === team.id 
                              ? 'bg-primary/20 border border-primary/50 shadow-[0_0_10px_rgba(var(--primary)/0.3)]' 
                              : 'bg-card/80 hover:bg-muted/30 border border-transparent'
                            }`}
                          onClick={() => setSelectedTeam(team)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary font-bold border border-primary/30">
                              {team.tag}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{team.name}</h3>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>{team.members?.length || 0} members</span>
                                <span className="mx-1">•</span>
                                <span className="flex items-center">
                                  {team.ownerId === user?.id && (
                                    <>
                                      <Crown className="h-3 w-3 text-yellow-500 mr-1" />
                                      Owner
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${
                              selectedTeam?.id === team.id ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </motion.div>
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

              {teams && teams.length > 0 && (
                <Card className="glassmorphic mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-orbitron">Quick Tips</CardTitle>
                    <CardDescription>Make the most out of your team</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <p>Assign roles to your team members to optimize gameplay</p>
                    </div>
                    <div className="flex items-start">
                      <Swords className="h-5 w-5 mr-2 text-orange-500 shrink-0 mt-0.5" />
                      <p>Build team synergy by playing matches together regularly</p>
                    </div>
                    <div className="flex items-start">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5" />
                      <p>Complete achievements together to earn team XP and rewards</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Team Details Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2"
            >
              {selectedTeam ? (
                <Card className="glassmorphic overflow-hidden">
                  <CardContent className="p-0">
                    {/* Team header */}
                    <div className="relative">
                      <div className="bg-gradient-to-r from-primary/30 to-secondary/30 h-32 w-full"></div>
                      <div className="absolute -bottom-12 left-6 flex">
                        {renderTeamLogo(selectedTeam, 'lg')}
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        {selectedTeam.ownerId === user?.id ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="bg-background/80 backdrop-blur-sm">
                                Team Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => setEditTeamDialogOpen(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Team
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setInviteDialogOpen(true)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Invite Members
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleCopyInviteLink}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Invite Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDisbandTeam(selectedTeam.id, selectedTeam.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Disband Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-background/80 backdrop-blur-sm text-destructive hover:text-destructive"
                            onClick={() => handleLeaveTeam(selectedTeam.id, selectedTeam.name)}
                          >
                            <LogOut className="h-4 w-4 mr-1" />
                            Leave Team
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Team info */}
                    <div className="px-6 pt-16 pb-4">
                      <div className="flex flex-col md:flex-row md:items-end justify-between">
                        <div>
                          <h2 className="text-2xl font-orbitron font-bold">{selectedTeam.name}</h2>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {selectedTeam.tag}
                            </Badge>
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {selectedTeam.members.length} Members
                            </Badge>
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              Rank #{selectedTeam.stats.rank}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Created on {new Date(selectedTeam.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex items-center">
                          <Gauge className="h-4 w-4 mr-1 text-blue-400" />
                          <span className="mr-2 text-sm">Team Synergy:</span>
                          <div className="w-24 h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                              style={{ width: `${selectedTeam.stats.synergy}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-semibold">{selectedTeam.stats.synergy}%</span>
                        </div>
                      </div>
                      
                      {selectedTeam.description && (
                        <div className="mt-3 text-muted-foreground text-sm">
                          {selectedTeam.description}
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Team content tabs */}
                    <div className="p-6">
                      <Tabs 
                        defaultValue="members" 
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <TabsList className="mb-6 w-full justify-start overflow-x-auto flex-nowrap">
                          <TabsTrigger value="members" className="flex items-center gap-1">
                            <Users className="h-4 w-4" /> Members
                          </TabsTrigger>
                          <TabsTrigger value="stats" className="flex items-center gap-1">
                            <LineChart className="h-4 w-4" /> Stats
                          </TabsTrigger>
                          <TabsTrigger value="achievements" className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" /> Achievements
                          </TabsTrigger>
                          <TabsTrigger value="tournaments" className="flex items-center gap-1">
                            <Swords className="h-4 w-4" /> Tournaments
                          </TabsTrigger>
                        </TabsList>
                        
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Members Tab */}
                            <TabsContent value="members" className="mt-0">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold font-rajdhani">Team Members</h3>
                                {selectedTeam.ownerId === user?.id && (
                                  <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
                                    <UserPlus className="h-4 w-4 mr-1" /> Invite
                                  </Button>
                                )}
                              </div>

                              <div className="grid gap-3">
                                {selectedTeam.members.map(member => (
                                  <motion.div 
                                    key={member.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="flex items-center justify-between p-3 rounded-md bg-muted/20 border border-border hover:border-primary/30 transition-colors"
                                  >
                                    <div className="flex items-center">
                                      <Avatar className="h-10 w-10 mr-3 border border-border">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{getDefaultAvatar(member.username)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="flex items-center">
                                          <h4 className="font-medium">{member.username}</h4>
                                          <Badge 
                                            className={`ml-2 border ${getRoleColor(member.role)}`}
                                            variant="outline"
                                          >
                                            <span className="flex items-center gap-1">
                                              {getRoleIcon(member.role)}
                                              <span>{getRoleName(member.role)}</span>
                                            </span>
                                          </Badge>
                                          {member.status === 'pending' && (
                                            <Badge variant="outline" className="ml-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-500">
                                              Pending
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {selectedTeam.ownerId === user?.id && member.id !== user.id && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button size="sm" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => handleChangeMemberRole(member)}>
                                            <Shield className="h-4 w-4 mr-2" />
                                            Change Role
                                          </DropdownMenuItem>
                                          {member.role === "captain" && (
                                            <DropdownMenuItem>
                                              <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                                              Transfer Ownership
                                            </DropdownMenuItem>
                                          )}
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem 
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleRemoveMember(selectedTeam.id, member.id, member.username)}
                                          >
                                            <UserX className="h-4 w-4 mr-2" />
                                            Remove from Team
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </motion.div>
                                ))}
                                
                                {selectedTeam.pendingInvites.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Pending Invitations</h4>
                                    {selectedTeam.pendingInvites.map((username, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/10 border border-border">
                                        <div className="flex items-center">
                                          <Avatar className="h-8 w-8 mr-3 opacity-70">
                                            <AvatarFallback>{getDefaultAvatar(username)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="text-sm">{username}</p>
                                            <p className="text-xs text-muted-foreground">Invitation pending</p>
                                          </div>
                                        </div>
                                        <div className="flex space-x-1">
                                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            <Share2 className="h-4 w-4 text-muted-foreground" />
                                          </Button>
                                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                            
                            {/* Stats Tab */}
                            <TabsContent value="stats" className="mt-0">
                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-bold font-rajdhani mb-4">Team Statistics</h3>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card>
                                      <CardContent className="pt-6 text-center">
                                        <p className="text-xs text-muted-foreground">Matches</p>
                                        <p className="text-3xl font-bold mt-1">{selectedTeam.stats.matches}</p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6 text-center">
                                        <p className="text-xs text-muted-foreground">Wins</p>
                                        <p className="text-3xl font-bold text-green-500 mt-1">{selectedTeam.stats.wins}</p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6 text-center">
                                        <p className="text-xs text-muted-foreground">Kills</p>
                                        <p className="text-3xl font-bold text-primary mt-1">{selectedTeam.stats.kills}</p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6 text-center">
                                        <p className="text-xs text-muted-foreground">Win Rate</p>
                                        <p className="text-3xl font-bold text-secondary mt-1">
                                          {selectedTeam.stats.matches ? Math.round((selectedTeam.stats.wins / selectedTeam.stats.matches) * 100) : 0}%
                                        </p>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-bold font-rajdhani mb-4">Team Level</h3>
                                  <Card>
                                    <CardContent className="pt-6">
                                      <div className="flex items-center mb-2">
                                        <div className="flex-1">
                                          <div className="flex items-baseline">
                                            <span className="text-3xl font-bold">Level {selectedTeam.stats.level}</span>
                                            <span className="text-muted-foreground ml-4 text-sm">
                                              {selectedTeam.stats.xp} / {selectedTeam.stats.nextLevelXp} XP
                                            </span>
                                          </div>
                                        </div>
                                        <Badge>Rank #{selectedTeam.stats.rank}</Badge>
                                      </div>
                                      <Progress 
                                        value={(selectedTeam.stats.xp / selectedTeam.stats.nextLevelXp) * 100}
                                        className="h-2 bg-muted/40"
                                      />
                                      <p className="text-sm text-muted-foreground mt-2">
                                        Gain XP by playing matches, winning tournaments, and unlocking achievements
                                      </p>
                                    </CardContent>
                                  </Card>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-bold font-rajdhani mb-4">Player Stats</h3>
                                  <Card>
                                    <CardContent className="pt-6 p-0">
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="border-b border-border">
                                              <th className="text-left py-3 px-4 font-medium">Player</th>
                                              <th className="text-center py-3 px-4 font-medium">Matches</th>
                                              <th className="text-center py-3 px-4 font-medium">Kills</th>
                                              <th className="text-center py-3 px-4 font-medium">Deaths</th>
                                              <th className="text-center py-3 px-4 font-medium">K/D</th>
                                              <th className="text-center py-3 px-4 font-medium">Win Rate</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-border">
                                            {selectedTeam.members
                                              .filter(member => member.stats)
                                              .map(member => (
                                                <tr key={member.id} className="hover:bg-muted/10">
                                                  <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                      <Avatar className="h-8 w-8 mr-2">
                                                        <AvatarFallback>{getDefaultAvatar(member.username)}</AvatarFallback>
                                                      </Avatar>
                                                      <div>
                                                        <div className="font-medium">{member.username}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                          {getRoleName(member.role)}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="py-3 px-4 text-center">{member.stats?.matches}</td>
                                                  <td className="py-3 px-4 text-center text-primary font-medium">{member.stats?.kills}</td>
                                                  <td className="py-3 px-4 text-center">{member.stats?.deaths}</td>
                                                  <td className="py-3 px-4 text-center font-medium">
                                                    <span className={member.stats?.kd && member.stats.kd > 1.5 ? 'text-green-500' : ''}>
                                                      {member.stats?.kd.toFixed(2)}
                                                    </span>
                                                  </td>
                                                  <td className="py-3 px-4 text-center">
                                                    <span className="font-medium">{member.stats?.winRate}%</span>
                                                  </td>
                                                </tr>
                                              ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            </TabsContent>
                            
                            {/* Achievements Tab */}
                            <TabsContent value="achievements" className="mt-0">
                              <div className="mb-4 flex justify-between items-center">
                                <h3 className="text-lg font-bold font-rajdhani">Team Achievements</h3>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Trophy className="h-3 w-3" />
                                  <span>Level {selectedTeam.stats.level}</span>
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedTeam.achievements.map(achievement => (
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    key={achievement.id}
                                    className={`border rounded-lg p-4 cursor-pointer 
                                      ${achievement.achieved 
                                        ? 'bg-primary/10 border-primary/30' 
                                        : 'bg-muted/20 border-border'
                                      }`}
                                    onClick={() => handleViewAchievement(achievement)}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                                          ${achievement.achieved 
                                            ? 'bg-primary/20 border border-primary/50 text-primary' 
                                            : 'bg-muted/30 border border-muted text-muted-foreground'
                                          }`}
                                        >
                                          {achievement.icon === 'trophy' && <Trophy className="h-5 w-5" />}
                                          {achievement.icon === 'users' && <Users className="h-5 w-5" />}
                                          {achievement.icon === 'award' && <Trophy className="h-5 w-5" />}
                                        </div>
                                        <div>
                                          <h4 className="font-medium">{achievement.name}</h4>
                                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                        </div>
                                      </div>
                                      {achievement.achieved && (
                                        <Badge className="bg-green-600 border-0">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Achieved
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="mt-2">
                                      <div className="flex items-center justify-between text-xs mb-1">
                                        <span>Progress</span>
                                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                                      </div>
                                      <Progress 
                                        value={(achievement.progress / achievement.maxProgress) * 100}
                                        className={`h-2 ${achievement.achieved 
                                          ? 'bg-muted/40' 
                                          : 'bg-muted/20'
                                        }`}
                                      />
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </TabsContent>
                            
                            {/* Tournaments Tab */}
                            <TabsContent value="tournaments" className="mt-0">
                              <h3 className="text-lg font-bold font-rajdhani mb-4">Recent Tournaments</h3>
                              <div className="space-y-3">
                                <div className="p-4 rounded-md border border-primary/20 bg-primary/5 flex justify-between items-center">
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

                                <div className="p-4 rounded-md border border-secondary/20 bg-secondary/5 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-md bg-secondary/20 flex items-center justify-center mr-3">
                                      <Trophy className="h-6 w-6 text-secondary" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Weekend Warfare #12</h4>
                                      <p className="text-xs text-muted-foreground">Completed • April 23, 9:00 PM</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="border-primary/50 text-primary">3rd Place</Badge>
                                </div>
                                
                                <div className="p-4 rounded-md border border-muted bg-muted/10 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-md bg-muted/20 flex items-center justify-center mr-3">
                                      <Trophy className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Elite Squad Showdown</h4>
                                      <p className="text-xs text-muted-foreground">Completed • April 16, 7:00 PM</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">5th Place</Badge>
                                </div>
                              </div>
                              
                              <div className="mt-6">
                                <Button variant="outline" className="w-full">
                                  <Trophy className="h-4 w-4 mr-2" />
                                  Browse Available Tournaments
                                </Button>
                              </div>
                            </TabsContent>
                          </motion.div>
                        </AnimatePresence>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glassmorphic h-full flex flex-col justify-center items-center py-16">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center p-6"
                  >
                    <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-70" />
                    <h3 className="text-xl font-bold mb-2">Select a Team</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Choose a team from the list or create a new one to view details and manage your squad
                    </p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Team
                    </Button>
                  </motion.div>
                </Card>
              )}
            </motion.div>
          </div>
        )}
      </main>

      {/* Create Team Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Create a New Team</DialogTitle>
            <DialogDescription>
              Form a squad to participate in team tournaments and climb the ranks together.
            </DialogDescription>
          </DialogHeader>

          <Form {...createTeamForm}>
            <form onSubmit={createTeamForm.handleSubmit(onCreateTeamSubmit)} className="space-y-4">
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center border-2 border-dashed border-border relative overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Team logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleLogoChange(e, createTeamForm)}
                  />
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground -mt-2 mb-2">
                Click to upload team logo (optional)
              </p>

              <FormField
                control={createTeamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team name (e.g., Blaze Squad)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a unique, memorable name for your team
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
                      <Input placeholder="Enter tag (e.g., BLZ)" maxLength={5} {...field} />
                    </FormControl>
                    <FormDescription>
                      A short tag (2-5 characters) that represents your team
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
                        placeholder="Brief description of your team and goals" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTeamMutation.isPending}
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
            <DialogTitle className="font-orbitron">Invite Players</DialogTitle>
            <DialogDescription>
              Invite players to join your team for tournaments and matches.
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
                      <Input placeholder="Enter player's username" {...field} />
                    </FormControl>
                    <FormDescription>
                      The player must have an account on FireFight
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedTeam && (
                <div className="bg-muted/20 rounded-md p-4 flex flex-col space-y-2 mt-2">
                  <p className="text-sm font-medium">Or share invite link</p>
                  <div className="flex items-center">
                    <Input 
                      readOnly 
                      value={`${window.location.origin}/join-team?code=${selectedTeam.inviteCode}`}
                      className="flex-1 text-sm pr-24"
                    />
                    <Button 
                      type="button" 
                      size="sm"
                      variant="outline"
                      className="ml-2 absolute right-5"
                      onClick={handleCopyInviteLink}
                    >
                      {isInviteLinkCopied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Anyone with this link can join your team directly
                  </p>
                </div>
              )}

              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={inviteMemberMutation.isPending}
                >
                  {inviteMemberMutation.isPending ? 'Sending...' : 'Send Invite'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={editTeamDialogOpen} onOpenChange={setEditTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Edit Team</DialogTitle>
            <DialogDescription>
              Update your team's information and appearance.
            </DialogDescription>
          </DialogHeader>

          <Form {...editTeamForm}>
            <form onSubmit={editTeamForm.handleSubmit(onEditTeamSubmit)} className="space-y-4">
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center border-2 border-dashed border-border relative overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Team logo preview" className="w-full h-full object-cover" />
                  ) : selectedTeam?.logo ? (
                    <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full font-bold text-2xl text-primary">
                      {selectedTeam?.tag}
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleLogoChange(e, editTeamForm)}
                  />
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground -mt-2 mb-2">
                Click to change team logo
              </p>

              <FormField
                control={editTeamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editTeamForm.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Tag</FormLabel>
                    <FormControl>
                      <Input maxLength={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editTeamForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditTeamDialogOpen(false);
                    setLogoPreview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={editTeamMutation.isPending}
                >
                  {editTeamMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Change Member Role Dialog */}
      <Dialog open={changeMemberRoleDialogOpen} onOpenChange={setChangeMemberRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-orbitron">Change Member Role</DialogTitle>
            <DialogDescription>
              Assign a specialized role to this team member.
            </DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={selectedMember.avatar} />
                <AvatarFallback>{getDefaultAvatar(selectedMember.username)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{selectedMember.username}</h4>
                <p className="text-xs text-muted-foreground">Current role: {getRoleName(selectedMember.role)}</p>
              </div>
            </div>
          )}

          <Form {...changeMemberRoleForm}>
            <form onSubmit={changeMemberRoleForm.handleSubmit(onChangeMemberRoleSubmit)} className="space-y-4">
              <FormField
                control={changeMemberRoleForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="captain" className="flex items-center">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Captain
                          </div>
                        </SelectItem>
                        <SelectItem value="sniper">
                          <div className="flex items-center">
                            <Crosshair className="h-4 w-4 mr-2 text-red-500" />
                            Sniper
                          </div>
                        </SelectItem>
                        <SelectItem value="support">
                          <div className="flex items-center">
                            <Smile className="h-4 w-4 mr-2 text-green-500" />
                            Support
                          </div>
                        </SelectItem>
                        <SelectItem value="igl">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-purple-500" />
                            In-Game Leader
                          </div>
                        </SelectItem>
                        <SelectItem value="entry">
                          <div className="flex items-center">
                            <Swords className="h-4 w-4 mr-2 text-orange-500" />
                            Entry Fragger
                          </div>
                        </SelectItem>
                        <SelectItem value="flex">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-2 text-blue-500" />
                            Flex
                          </div>
                        </SelectItem>
                        <SelectItem value="member">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            Member
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Different roles help define team structure and playstyle
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/20 rounded-md p-3 border border-border">
                <h4 className="text-sm font-medium mb-2">Role Description</h4>
                {changeMemberRoleForm.watch('role') === 'captain' && (
                  <p className="text-sm text-muted-foreground">The team leader who makes key decisions and coordinates the squad.</p>
                )}
                {changeMemberRoleForm.watch('role') === 'sniper' && (
                  <p className="text-sm text-muted-foreground">Specializes in long-range combat and providing cover for the team.</p>
                )}
                {changeMemberRoleForm.watch('role') === 'support' && (
                  <p className="text-sm text-muted-foreground">Provides backup, carries utility items, and assists teammates.</p>
                )}
                {changeMemberRoleForm.watch('role') === 'igl' && (
                  <p className="text-sm text-muted-foreground">In-Game Leader who makes strategic calls during matches.</p>
                )}
                {changeMemberRoleForm.watch('role') === 'entry' && (
                  <p className="text-sm text-muted-foreground">Entry Fragger who takes the first engagement and creates space.</p>
                )}
                {changeMemberRoleForm.watch('role') === 'flex' && (
                  <p className="text-sm text-muted-foreground">Versatile player who can adapt to multiple roles as needed.</p>
                )}
                {changeMemberRoleForm.watch('role') === 'member' && (
                  <p className="text-sm text-muted-foreground">Standard team member with no specialized role.</p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setChangeMemberRoleDialogOpen(false);
                    setSelectedMember(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={changeMemberRoleMutation.isPending}
                >
                  {changeMemberRoleMutation.isPending ? 'Updating...' : 'Update Role'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-orbitron">{confirmAction?.title}</DialogTitle>
            <DialogDescription>
              {confirmAction?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setConfirmDialogOpen(false);
                setConfirmAction(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmAction}
              disabled={
                (confirmAction?.type === 'remove' && removeTeamMemberMutation.isPending) ||
                (confirmAction?.type === 'leave' && leaveTeamMutation.isPending) ||
                (confirmAction?.type === 'disband' && disbandTeamMutation.isPending)
              }
            >
              {confirmAction?.type === 'remove' && (removeTeamMemberMutation.isPending ? 'Removing...' : 'Remove')}
              {confirmAction?.type === 'leave' && (leaveTeamMutation.isPending ? 'Leaving...' : 'Leave')}
              {confirmAction?.type === 'disband' && (disbandTeamMutation.isPending ? 'Disbanding...' : 'Disband')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Achievement Modal */}
      <Dialog open={achievementModalOpen} onOpenChange={setAchievementModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-orbitron">{selectedAchievement?.name}</DialogTitle>
          </DialogHeader>

          {selectedAchievement && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center 
                  ${selectedAchievement.achieved 
                    ? 'bg-primary/20 border-2 border-primary/50 text-primary' 
                    : 'bg-muted/30 border-2 border-muted text-muted-foreground'
                  }`}
                >
                  {selectedAchievement.icon === 'trophy' && <Trophy className="h-10 w-10" />}
                  {selectedAchievement.icon === 'users' && <Users className="h-10 w-10" />}
                  {selectedAchievement.icon === 'award' && <Trophy className="h-10 w-10" />}
                </div>
              </div>

              <div className="text-center">
                <p>{selectedAchievement.description}</p>
                {selectedAchievement.achieved && selectedAchievement.unlockedAt && (
                  <Badge className="mt-2 bg-green-600 border-0">
                    Achieved on {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              <div className="bg-muted/20 rounded-md p-4 border border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="font-medium">{selectedAchievement.progress} / {selectedAchievement.maxProgress}</span>
                </div>
                <Progress 
                  value={(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedAchievement.achieved 
                    ? 'This achievement has been unlocked!' 
                    : `${selectedAchievement.maxProgress - selectedAchievement.progress} more to go!`
                  }
                </p>
              </div>

              <div className="bg-muted/20 rounded-md p-4 border border-border">
                <h4 className="text-sm font-medium mb-2">Rewards</h4>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-secondary" />
                  <span className="text-sm">+100 Team XP</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm">+10% Team Synergy</span>
                </div>
              </div>

              <Button onClick={() => setAchievementModalOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <MobileNavbar />
    </div>
  );
}