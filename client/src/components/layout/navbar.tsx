import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, 
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getDefaultAvatar } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  User, Settings, LogOut, Wallet, Trophy, 
  ChevronDown, Bell, Home, Users
} from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/">
            <a className="text-3xl font-bold font-orbitron text-white mr-10">
              <span className="text-primary">Fire</span>Fight
            </a>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <a className={`font-rajdhani font-medium ${location === '/' ? 'text-primary' : 'text-muted-foreground hover:text-secondary transition-colors'}`}>
                Home
              </a>
            </Link>
            <Link href="/tournaments">
              <a className={`font-rajdhani font-medium ${location.startsWith('/tournaments') ? 'text-primary' : 'text-muted-foreground hover:text-secondary transition-colors'}`}>
                Tournaments
              </a>
            </Link>
            <Link href="/leaderboard">
              <a className={`font-rajdhani font-medium ${location === '/leaderboard' ? 'text-primary' : 'text-muted-foreground hover:text-secondary transition-colors'}`}>
                Leaderboard
              </a>
            </Link>
            <Link href="/how-to-play">
              <a className={`font-rajdhani font-medium ${location === '/how-to-play' ? 'text-primary' : 'text-muted-foreground hover:text-secondary transition-colors'}`}>
                How to Play
              </a>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Wallet Balance */}
              <Link href="/wallet">
                <a className="flex items-center px-3 py-1 rounded-md border border-secondary/50 text-secondary hover:bg-secondary/10 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 mr-2">
                    <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
                  </svg>
                  <span className="font-rajdhani font-medium">{user.coins} <span className="text-xs">Coins</span></span>
                </a>
              </Link>
              
              {/* Notifications */}
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-secondary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-auto p-2">
                    <div className="mb-2 p-2 rounded-md hover:bg-primary/5 transition-colors">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Tournament Starting Soon</p>
                          <p className="text-xs text-muted-foreground">"Weekend War" starts in 30 minutes!</p>
                          <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 p-2 rounded-md hover:bg-primary/5 transition-colors">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                          <Users className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Team Invitation</p>
                          <p className="text-xs text-muted-foreground">You've been invited to join "Team Phantom"</p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 rounded-md hover:bg-primary/5 transition-colors">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                          <Wallet className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Coins Added</p>
                          <p className="text-xs text-muted-foreground">500 coins have been added to your wallet</p>
                          <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center">
                    View All Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-1">
                    <Avatar className="h-8 w-8 border-2 border-primary">
                      <AvatarImage src={getDefaultAvatar(user.username)} alt={user.username} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm hidden lg:inline">{user.username}</span>
                    <ChevronDown className="h-4 w-4 hidden lg:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <Home className="h-4 w-4 mr-2" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/wallet">
                      <DropdownMenuItem className="cursor-pointer">
                        <Wallet className="h-4 w-4 mr-2" />
                        <span>Wallet</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/team">
                      <DropdownMenuItem className="cursor-pointer">
                        <Users className="h-4 w-4 mr-2" />
                        <span>My Team</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
