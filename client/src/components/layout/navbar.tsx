import { useState } from "react";
import { useLocation } from "wouter";
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
  ChevronDown, Bell, Home, Users, Sparkles, Zap, Gift
} from "lucide-react";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Navigation helper function
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <div 
            onClick={() => navigateTo("/")}
            className="text-3xl font-bold font-orbitron text-white mr-10 cursor-pointer flex items-center"
          >
            <span className="text-primary relative animate-pulse-glow">
              Fire<Zap className="h-5 w-5 inline-flex text-yellow-400 absolute -right-3 -top-1" />
            </span>
            Fight
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => navigateTo("/")}
              className={`font-rajdhani font-medium ${location === '/' ? 'text-primary' : 'text-muted-foreground hover:text-secondary transition-colors'}`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("/tournaments")}
              className={`font-rajdhani font-medium ${location.startsWith('/tournaments') ? 'text-primary' : 'text-muted-foreground hover:text-secondary transition-colors'}`}
            >
              Tournaments
            </button>
            <button
              onClick={() => navigateTo("/leaderboard")}
              className={`font-rajdhani font-medium ${location === '/leaderboard' ? 'text-primary' : 'text-muted-foreground hover:text-secondary transition-colors'}`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => navigateTo("/how-to-play")}
              className={`font-rajdhani font-medium ${location === '/how-to-play' ? 'text-primary' : 'text-muted-foreground hover:text-secondary transition-colors'}`}
            >
              How to Play
            </button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Special Offers */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Gift className="h-5 w-5 text-secondary animate-pulse" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Special Offers</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2 space-y-2">
                    <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex gap-3 items-center mb-2">
                        <Sparkles className="h-5 w-5 text-secondary" />
                        <h4 className="font-bold">Weekly Pass: 30% OFF!</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Get unlimited entry to all tournaments this week at a discounted price!
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="line-through text-muted-foreground">₹1000</span>
                          <span className="text-secondary font-bold ml-2">₹700</span>
                        </div>
                        <Button size="sm" className="text-xs">Get Offer</Button>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex gap-3 items-center mb-2">
                        <Zap className="h-5 w-5 text-accent" />
                        <h4 className="font-bold">Coin Bundle: 500 + 100 Bonus!</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Buy 500 coins and get 100 extra coins free. Limited time offer!
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-accent font-bold">₹499</span>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">Buy Now</Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            
              {/* Wallet Balance */}
              <Button 
                variant="outline" 
                className="flex items-center px-3 py-1 border border-secondary/50 text-secondary hover:bg-secondary/10"
                onClick={() => navigateTo("/wallet")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 mr-2">
                  <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
                </svg>
                <span className="font-rajdhani font-medium">{user.coins} <span className="text-xs">Coins</span></span>
              </Button>
              
              {/* Notifications */}
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-secondary animate-ping opacity-75"></span>
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-secondary"></span>
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
                  <DropdownMenuItem className="justify-center cursor-pointer">
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
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigateTo("/dashboard")}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigateTo("/profile")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigateTo("/wallet")}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      <span>Wallet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigateTo("/team")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      <span>My Team</span>
                    </DropdownMenuItem>
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
              <Button 
                variant="outline" 
                className="border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => navigateTo("/auth")}
              >
                Login
              </Button>
              <Button onClick={() => navigateTo("/auth")}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
