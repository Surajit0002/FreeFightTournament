import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Mail, AlertCircle, UserCircle2, Trophy, Check } from "lucide-react";
import { getDefaultAvatar } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Placeholder function - actual implementation would connect to API
const updateProfile = async (profileData: any) => {
  // This would be a real API call in a production app
  // For now we'll just simulate a successful response
  return await apiRequest("POST", "/api/user/profile", profileData);
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Profile form state
  const [displayName, setDisplayName] = useState<string>("");
  const [freeFireId, setFreeFireId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  
  // Settings state
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [showProfileStats, setShowProfileStats] = useState<boolean>(true);
  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  
  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      // Invalidate user query to refresh data
      queryClient.invalidateQueries({
        queryKey: ["/api/user"],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setDisplayName(user.username);
      setEmail(user.email);
      // Other fields would be populated from user data if available in the API
    }
  }, [user]);
  
  // Handle profile update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    profileMutation.mutate({
      displayName,
      freeFireId,
      email,
      bio,
      avatar,
    });
  };
  
  // Handle avatar update
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server or cloud storage
      // and get back a URL to use as the avatar
      // For now, we'll just use a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setAvatar(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Set page title
  useEffect(() => {
    document.title = "Profile | FireFight";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
            <UserCircle2 className="mr-3 text-primary h-8 w-8" />
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Update your profile information and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="space-y-6">
            <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <Avatar className="w-24 h-24 border-2 border-primary">
                      <AvatarImage src={avatar || (user && getDefaultAvatar(user.username))} alt={user?.username} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                        {user?.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-4 w-4 text-white" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {freeFireId ? `Free Fire ID: ${freeFireId}` : "No Free Fire ID added"}
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                      Pro Player
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/30">
                      Tournament Winner
                    </Badge>
                  </div>
                  
                  <div className="w-full pt-4 border-t border-primary/20">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Tournaments Played</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Tournaments Won</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <span className="font-medium">21%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-rajdhani">
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                      <Trophy className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">First Win</p>
                      <p className="text-xs text-muted-foreground">Won your first tournament</p>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-primary">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">10 Tournaments</p>
                      <p className="text-xs text-muted-foreground">Participated in 10 tournaments</p>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-accent">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Kill Master</p>
                      <p className="text-xs text-muted-foreground">20+ kills in a single tournament</p>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-red-500">
                        <path d="M19.07 4.93C17.22 3.08 14.66 2 12 2C9.34 2 6.78 3.08 4.93 4.93C3.08 6.78 2 9.34 2 12C2 14.66 3.08 17.22 4.93 19.07C6.78 20.92 9.34 22 12 22C14.66 22 17.22 20.92 19.07 19.07C20.92 17.22 22 14.66 22 12C22 9.34 20.92 6.78 19.07 4.93Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 8L12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16H12.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Champion</p>
                      <p className="text-xs text-muted-foreground">Win 3 tournaments in a row</p>
                    </div>
                  </div>
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Center Column - Profile Edit Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-rajdhani">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and game details
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="displayName"
                          placeholder="Your display name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="pl-10 bg-card border-primary/30"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="freeFireId">Free Fire ID</Label>
                      <div className="relative">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4">
                          <path d="M20 7L12 3L4 7V17L12 21L20 17V7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 12L12 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 7L12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M20 7L12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <Input 
                          id="freeFireId"
                          placeholder="Your Free Fire ID"
                          value={freeFireId}
                          onChange={(e) => setFreeFireId(e.target.value)}
                          className="pl-10 bg-card border-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-card border-primary/30"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself and your gaming style"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="bg-card border-primary/30 min-h-24"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button type="submit" disabled={profileMutation.isPending}>
                      {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-rajdhani">
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for the application
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about tournaments and matches
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profile-stats">Show Profile Stats</Label>
                    <p className="text-sm text-muted-foreground">
                      Show your profile statistics publicly
                    </p>
                  </div>
                  <Switch
                    id="profile-stats"
                    checked={showProfileStats}
                    onCheckedChange={setShowProfileStats}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-effects">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable sound effects for in-app notifications
                    </p>
                  </div>
                  <Switch
                    id="sound-effects"
                    checked={soundEffects}
                    onCheckedChange={setSoundEffects}
                  />
                </div>
                
                <div className="pt-4 border-t border-primary/20">
                  <h3 className="font-medium mb-3">Account Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 mr-2">
                        <path d="M9 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 15L21 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 3H21V8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Log Out
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 mr-2">
                        <path d="M10 11V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 11V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 7H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}
