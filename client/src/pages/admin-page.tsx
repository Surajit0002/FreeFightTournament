
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, Redirect, useLocation } from "wouter";
import { 
  LayoutDashboard, Trophy, Users, ShieldAlert, LineChart, 
  Gift, Cog, Bell, ArrowRight, MessagesSquare, Hash, 
  PanelTop, Flame, Wallet, Tag, Database, Settings, 
  LogOut, Home, MoreHorizontal, Menu, Crown, Brackets,
  Ban, Flag, CheckCircle, XCircle, Undo, Download,
  ListFilter, ChevronDown, Search, PlusCircle, RefreshCw,
  Briefcase, LayoutGrid, CircleDollarSign, Eye, Edit, Trash, Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { getDefaultAvatar, formatCurrency } from "@/lib/utils";

// Generate sample data
const generateTournaments = () => {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    title: `Weekend Warfare ${i + 1}`,
    mode: ['Solo', 'Duo', 'Squad'][Math.floor(Math.random() * 3)],
    map: ['Bermuda', 'Kalahari', 'Purgatory'][Math.floor(Math.random() * 3)],
    entryFee: Math.floor(Math.random() * 100) * 5,
    prize: Math.floor(Math.random() * 500) * 10 + 500,
    slots: {
      total: 100,
      filled: Math.floor(Math.random() * 80) + 20
    },
    status: ['upcoming', 'ongoing', 'completed'][Math.floor(Math.random() * 3)],
    startTime: new Date(Date.now() + Math.floor(Math.random() * 3) * 86400000).toISOString()
  }));
};

const generatePlayers = () => {
  return Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    username: ['FireHunter', 'SniperElite', 'HeadShotKing', 'NinjaAssassin', 'BattleLord'][Math.floor(Math.random() * 5)] + (i + 1),
    email: `player${i+1}@example.com`,
    deviceId: `D${Math.floor(Math.random() * 1000000)}`,
    joinedTournaments: Math.floor(Math.random() * 20) + 5,
    wallet: {
      coins: Math.floor(Math.random() * 5000) + 1000,
      cash: Math.floor(Math.random() * 1000) + 100
    },
    status: Math.random() > 0.1 ? 'active' : 'banned',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString()
  }));
};

const generateReports = () => {
  return Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    type: ['cheating', 'abusive behavior', 'bug report', 'payment issue'][Math.floor(Math.random() * 4)],
    reportedBy: ['FireHunter', 'SniperElite', 'HeadShotKing', 'NinjaAssassin', 'BattleLord'][Math.floor(Math.random() * 5)] + (Math.floor(Math.random() * 100)),
    reportedUser: ['FireHunter', 'SniperElite', 'HeadShotKing', 'NinjaAssassin', 'BattleLord'][Math.floor(Math.random() * 5)] + (Math.floor(Math.random() * 100)),
    matchId: `M${Math.floor(Math.random() * 10000)}`,
    description: `${['Suspect aimbot', 'Wall hack', 'Speed hack', 'Using profanity', 'Match not starting', 'Payment not received'][Math.floor(Math.random() * 6)]} in ${['Bermuda', 'Kalahari', 'Purgatory'][Math.floor(Math.random() * 3)]} map`,
    status: ['pending', 'investigating', 'resolved', 'dismissed'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000).toISOString(),
    hasScreenshot: Math.random() > 0.5
  }));
};

const generateCustomRooms = () => {
  return Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    name: `${['Pro', 'Elite', 'Champion', 'Master', 'Legendary'][Math.floor(Math.random() * 5)]} Scrim ${i+1}`,
    mode: ['Solo', 'Duo', 'Squad'][Math.floor(Math.random() * 3)],
    map: ['Bermuda', 'Kalahari', 'Purgatory'][Math.floor(Math.random() * 3)],
    roomId: Math.floor(Math.random() * 1000000) + 9000000,
    password: Math.floor(Math.random() * 1000) + 1000,
    status: ['scheduled', 'ready', 'in-progress', 'completed'][Math.floor(Math.random() * 4)],
    type: ['training', 'scrim', 'event'][Math.floor(Math.random() * 3)],
    startTime: new Date(Date.now() + Math.floor(Math.random() * 3) * 86400000 + Math.floor(Math.random() * 24) * 3600000).toISOString(),
    players: Array.from({ length: Math.floor(Math.random() * 10) + 5 }).map(() => ({
      username: ['FireHunter', 'SniperElite', 'HeadShotKing', 'NinjaAssassin', 'BattleLord'][Math.floor(Math.random() * 5)] + (Math.floor(Math.random() * 100)),
      joinedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 60000).toISOString()
    }))
  }));
};

const generateRewardCoupons = () => {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    code: `${['FREE', 'CASH', 'WIN', 'BONUS', 'NEW'][Math.floor(Math.random() * 5)]}${Math.floor(Math.random() * 1000)}`,
    type: ['coins', 'cash'][Math.floor(Math.random() * 2)],
    value: Math.floor(Math.random() * 10) * 50 + 100,
    usageLimit: Math.floor(Math.random() * 5) * 10 + 10,
    usageCount: Math.floor(Math.random() * 10),
    expiresAt: new Date(Date.now() + Math.floor(Math.random() * 30) * 86400000).toISOString(),
    status: Math.random() > 0.2 ? 'active' : 'expired'
  }));
};

const generateTransactions = () => {
  return Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    username: ['FireHunter', 'SniperElite', 'HeadShotKing', 'NinjaAssassin', 'BattleLord'][Math.floor(Math.random() * 5)] + (Math.floor(Math.random() * 100)),
    type: ['entry', 'win', 'withdrawal', 'deposit', 'refund', 'bonus'][Math.floor(Math.random() * 6)],
    amount: Math.floor(Math.random() * 500) + 50,
    currency: Math.random() > 0.5 ? 'coins' : 'cash',
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000).toISOString()
  }));
};

// Sidebar navigation component
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path ? 'bg-primary/10 text-primary font-medium' : 'text-sidebar-foreground hover:bg-sidebar-muted/50';
  };
  
  const navItems = [
    { icon: <LayoutDashboard className="mr-2 h-4 w-4" />, label: 'Dashboard', path: '/admin' },
    { icon: <Trophy className="mr-2 h-4 w-4" />, label: 'Tournaments', path: '/admin/tournaments' },
    { icon: <Users className="mr-2 h-4 w-4" />, label: 'Players', path: '/admin/players' },
    { icon: <Brackets className="mr-2 h-4 w-4" />, label: 'Teams', path: '/admin/teams' },
    { icon: <Hash className="mr-2 h-4 w-4" />, label: 'Custom Rooms', path: '/admin/custom-rooms' },
    { icon: <ShieldAlert className="mr-2 h-4 w-4" />, label: 'Reports & Disputes', path: '/admin/reports' },
    { icon: <Flame className="mr-2 h-4 w-4" />, label: 'Anti-Cheat Logs', path: '/admin/anticheat' },
    { icon: <Gift className="mr-2 h-4 w-4" />, label: 'Rewards & Coupons', path: '/admin/rewards' },
    { icon: <Wallet className="mr-2 h-4 w-4" />, label: 'Withdrawals', path: '/admin/withdrawals' },
    { icon: <Database className="mr-2 h-4 w-4" />, label: 'Transactions', path: '/admin/transactions' },
    { icon: <Bell className="mr-2 h-4 w-4" />, label: 'Push Notifications', path: '/admin/notifications' },
    { icon: <Crown className="mr-2 h-4 w-4" />, label: 'Leaderboard Config', path: '/admin/leaderboard' },
    { icon: <PanelTop className="mr-2 h-4 w-4" />, label: 'CMS & Banners', path: '/admin/cms' },
    { icon: <MessagesSquare className="mr-2 h-4 w-4" />, label: 'Support Tickets', path: '/admin/support' },
    { icon: <Cog className="mr-2 h-4 w-4" />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
    
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-orbitron text-sidebar-foreground">FireFight</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-2 py-4">
          <p className="px-2 mb-2 text-xs uppercase font-medium text-sidebar-foreground/60">Main</p>
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.path}
                className={`flex items-center px-2 py-2 rounded-md text-sm ${isActive(item.path)}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={getDefaultAvatar("AdminUser")} alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">admin@firefight.com</p>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

// Dashboard Overview component
function DashboardOverview() {
  const stats = [
    { label: 'Active Tournaments', value: '12', icon: <Trophy className="h-5 w-5 text-secondary" /> },
    { label: 'Active Players', value: '2,457', icon: <Users className="h-5 w-5 text-primary" /> },
    { label: 'Coins Circulating', value: '345K', icon: <CircleDollarSign className="h-5 w-5 text-accent" /> },
    { label: 'Pending Withdrawals', value: '₹24,500', icon: <Wallet className="h-5 w-5 text-destructive" /> },
  ];

  const recentActivities = [
    { 
      user: 'BattleLord27', 
      action: 'won tournament', 
      target: 'Weekend Warfare #5', 
      time: '2 mins ago',
      amount: '₹1,200' 
    },
    { 
      user: 'SniperElite42', 
      action: 'requested withdrawal', 
      target: '', 
      time: '15 mins ago',
      amount: '₹500' 
    },
    { 
      user: 'NinjaAssassin10', 
      action: 'joined tournament', 
      target: 'Squad Showdown', 
      time: '32 mins ago',
      amount: null 
    },
    { 
      user: 'HeadShotKing', 
      action: 'created team', 
      target: 'Ghost Killers', 
      time: '1 hour ago',
      amount: null 
    },
    { 
      user: 'FireHunter99', 
      action: 'reported player', 
      target: 'SpeedHacker404', 
      time: '3 hours ago',
      amount: null 
    },
  ];

  const alerts = [
    { 
      type: 'warning', 
      message: '3 tournaments starting in the next hour',
      action: 'View' 
    },
    { 
      type: 'error', 
      message: '5 unresolved user reports pending review',
      action: 'Review' 
    },
    { 
      type: 'info', 
      message: 'System maintenance scheduled for tomorrow 2 AM',
      action: 'Details' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="rounded-full p-2 bg-background">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Platform Analytics</CardTitle>
            <div className="flex items-center">
              <Tabs defaultValue="players">
                <TabsList className="h-8">
                  <TabsTrigger value="players" className="text-xs px-3">Player Growth</TabsTrigger>
                  <TabsTrigger value="earnings" className="text-xs px-3">Earnings</TabsTrigger>
                  <TabsTrigger value="matches" className="text-xs px-3">Matches</TabsTrigger>
                </TabsList>
              </Tabs>
              <Select defaultValue="7d">
                <SelectTrigger className="h-8 w-[90px] ml-auto">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart */}
            <div className="h-[250px] border border-dashed border-border rounded-md flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground text-sm">Interactive charts will display here</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-primary/5 border border-primary/10 rounded-md p-3">
                <p className="text-xs text-muted-foreground">New Players</p>
                <h4 className="text-lg font-bold mt-1">+457</h4>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowRight className="h-3 w-3 mr-1 rotate-45" /> 12% increase
                </p>
              </div>
              <div className="bg-secondary/5 border border-secondary/10 rounded-md p-3">
                <p className="text-xs text-muted-foreground">Match Participation</p>
                <h4 className="text-lg font-bold mt-1">1,245</h4>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowRight className="h-3 w-3 mr-1 rotate-45" /> 8% increase
                </p>
              </div>
              <div className="bg-accent/5 border border-accent/10 rounded-md p-3">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <h4 className="text-lg font-bold mt-1">₹52,360</h4>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowRight className="h-3 w-3 mr-1 rotate-45" /> 15% increase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest user actions</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start px-2 py-1">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={getDefaultAvatar(activity.user)} alt={activity.user} />
                    <AvatarFallback>{activity.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      {activity.target && <span className="font-medium">{activity.target}</span>}
                      {activity.amount && <span className="text-green-500 ml-1">{activity.amount}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">System Alerts</CardTitle>
          <CardDescription>Notifications requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-md border flex items-center justify-between ${
                alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
                alert.type === 'error' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                'bg-blue-500/10 border-blue-500/30 text-blue-500'
              }`}>
                <div className="flex items-center">
                  {alert.type === 'warning' && <Flame className="h-4 w-4 mr-2" />}
                  {alert.type === 'error' && <ShieldAlert className="h-4 w-4 mr-2" />}
                  {alert.type === 'info' && <Bell className="h-4 w-4 mr-2" />}
                  <p className="text-sm">{alert.message}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 hover:bg-white/10 hover:text-white ${
                    alert.type === 'warning' ? 'text-yellow-500' :
                    alert.type === 'error' ? 'text-destructive' :
                    'text-blue-500'
                  }`}
                >
                  {alert.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Custom Rooms component
function CustomRooms() {
  const [rooms, setRooms] = useState(generateCustomRooms());
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);

  const handleViewRoom = (room: any) => {
    setActiveRoom(room);
    setShowRoomDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-orbitron">Custom Rooms</h2>
          <p className="text-muted-foreground">Create and manage custom rooms for scrims, training, and events</p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" /> Create Room
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-lg">
        <Input 
          placeholder="Search by name, ID or password..." 
          className="max-w-sm" 
          prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Room Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="scrim">Scrim</SelectItem>
            <SelectItem value="event">Event</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden border border-muted bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge 
                    variant={
                      room.type === 'training' ? 'outline' : 
                      room.type === 'scrim' ? 'secondary' : 
                      'destructive'
                    }
                    className="mb-2"
                  >
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                  </Badge>
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <CardDescription>{room.mode} • {room.map}</CardDescription>
                </div>
                <Badge 
                  variant={
                    room.status === 'scheduled' ? 'outline' : 
                    room.status === 'ready' ? 'default' : 
                    room.status === 'in-progress' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {room.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                  {room.status === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {room.status === 'in-progress' && <Flame className="h-3 w-3 mr-1" />}
                  {room.status === 'completed' && <Flag className="h-3 w-3 mr-1" />}
                  {room.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-background/50 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Room ID</p>
                  <p className="font-bold">{room.roomId}</p>
                </div>
                <div className="bg-background/50 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Password</p>
                  <p className="font-bold">{room.password}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {room.players.slice(0, 4).map((player, i) => (
                    <Avatar key={i} className="border-2 border-background h-8 w-8">
                      <AvatarImage src={getDefaultAvatar(player.username)} alt={player.username} />
                      <AvatarFallback>{player.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                  {room.players.length > 4 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                      +{room.players.length - 4}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{room.players.length} players</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border pt-4">
              <Button variant="outline" size="sm" onClick={() => handleViewRoom(room)}>
                View Details
              </Button>
              <Button variant="default" size="sm">
                Send Info <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Room Details Modal */}
      {showRoomDetails && activeRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowRoomDetails(false)}>
          <div 
            className="max-w-2xl w-full bg-card border border-border rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-14 bg-muted flex items-center px-4">
              <h3 className="text-lg font-bold">{activeRoom.name} Details</h3>
              <button 
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                onClick={() => setShowRoomDetails(false)}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-background/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Room ID</p>
                  <p className="font-bold">{activeRoom.roomId}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Password</p>
                  <p className="font-bold">{activeRoom.password}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Map</p>
                  <p className="font-bold">{activeRoom.map}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="font-bold">{activeRoom.mode}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2">Room Status</h4>
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                  <div>
                    <p className="font-medium">
                      {activeRoom.status === 'scheduled' ? 'Scheduled' : 
                      activeRoom.status === 'ready' ? 'Ready to Start' : 
                      activeRoom.status === 'in-progress' ? 'In Progress' : 
                      'Completed'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activeRoom.status === 'scheduled' ? 'Starting soon' : 
                      activeRoom.status === 'ready' ? 'Room is ready' : 
                      activeRoom.status === 'in-progress' ? 'Match is live' : 
                      'Match has ended'}
                    </p>
                  </div>
                  <div>
                    <Select defaultValue={activeRoom.status}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Players ({activeRoom.players.length})</h4>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    Invite Players
                  </Button>
                </div>
                <div className="border border-border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/40 text-muted-foreground text-xs">
                      <tr>
                        <th className="p-2 text-left font-medium">Player</th>
                        <th className="p-2 text-left font-medium">Joined At</th>
                        <th className="p-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeRoom.players.map((player: any, i: number) => (
                        <tr key={i} className="hover:bg-muted/20">
                          <td className="p-2">
                            <div className="flex items-center">
                              <Avatar className="h-7 w-7 mr-2">
                                <AvatarImage src={getDefaultAvatar(player.username)} alt={player.username} />
                                <AvatarFallback>{player.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{player.username}</span>
                            </div>
                          </td>
                          <td className="p-2 text-sm">{new Date(player.joinedAt).toLocaleTimeString()}</td>
                          <td className="p-2 text-right">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" onClick={() => setShowRoomDetails(false)}>
                  Cancel
                </Button>
                <Button className="w-full">
                  <Bell className="h-4 w-4 mr-2" /> Send Room Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reports & Disputes component
function ReportsDisputes() {
  const [reports, setReports] = useState(generateReports());
  const [activeReport, setActiveReport] = useState<any>(null);
  const [showReportDetails, setShowReportDetails] = useState(false);

  const statusColors = {
    pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    investigating: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    resolved: 'text-green-500 bg-green-500/10 border-green-500/30',
    dismissed: 'text-muted-foreground bg-muted/20 border-muted',
  };

  const typeIcons = {
    'cheating': <ShieldAlert className="h-4 w-4" />,
    'abusive behavior': <Ban className="h-4 w-4" />,
    'bug report': <Database className="h-4 w-4" />,
    'payment issue': <Wallet className="h-4 w-4" />,
  };

  const handleViewReport = (report: any) => {
    setActiveReport(report);
    setShowReportDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-orbitron">Reports & Disputes</h2>
          <p className="text-muted-foreground">Manage player reports, cheating claims, and match disputes</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button variant="default">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30 text-xs text-muted-foreground">
              <th className="py-3 px-4 text-left font-medium">ID</th>
              <th className="py-3 px-4 text-left font-medium">Type</th>
              <th className="py-3 px-4 text-left font-medium">Reported By</th>
              <th className="py-3 px-4 text-left font-medium">Reported User</th>
              <th className="py-3 px-4 text-left font-medium">Description</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-muted/10">
                <td className="py-3 px-4 text-sm">{report.id}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-sm">
                    <span className="mr-1.5">
                      {typeIcons[report.type as keyof typeof typeIcons]}
                    </span>
                    <span className="capitalize">{report.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">{report.reportedBy}</td>
                <td className="py-3 px-4 text-sm">{report.reportedUser}</td>
                <td className="py-3 px-4 text-sm max-w-xs truncate">{report.description}</td>
                <td className="py-3 px-4">
                  <Badge 
                    className={`font-normal border ${
                      statusColors[report.status as keyof typeof statusColors]
                    }`}
                    variant="outline"
                  >
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {report.hasScreenshot && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button onClick={() => handleViewReport(report)} variant="ghost" size="sm" className="h-8">
                      View Details
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Details Modal */}
      {showReportDetails && activeReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowReportDetails(false)}>
          <div 
            className="max-w-2xl w-full bg-card border border-border rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-14 bg-muted flex items-center px-4">
              <h3 className="text-lg font-bold">Report #{activeReport.id} Details</h3>
              <button 
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                onClick={() => setShowReportDetails(false)}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex flex-col space-y-6">
                <div className="flex justify-between">
                  <Badge 
                    className={`px-3 py-1 font-normal border ${
                      statusColors[activeReport.status as keyof typeof statusColors]
                    }`}
                    variant="outline"
                  >
                    {activeReport.status.charAt(0).toUpperCase() + activeReport.status.slice(1)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Reported on {new Date(activeReport.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Report Type</h4>
                      <p className="text-base font-medium capitalize flex items-center">
                        {typeIcons[activeReport.type as keyof typeof typeIcons]}
                        <span className="ml-1.5">{activeReport.type}</span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Match ID</h4>
                      <p className="text-base font-medium">{activeReport.matchId}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Reported By</h4>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={getDefaultAvatar(activeReport.reportedBy)} alt={activeReport.reportedBy} />
                          <AvatarFallback>{activeReport.reportedBy.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{activeReport.reportedBy}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Reported User</h4>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={getDefaultAvatar(activeReport.reportedUser)} alt={activeReport.reportedUser} />
                          <AvatarFallback>{activeReport.reportedUser.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{activeReport.reportedUser}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Description</h4>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p>{activeReport.description}</p>
                  </div>
                </div>

                {activeReport.hasScreenshot && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Attached Screenshot</h4>
                    <div className="bg-muted/30 border border-dashed border-border rounded-md h-48 flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">Screenshot preview will appear here</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Admin Notes</h4>
                  <textarea 
                    className="w-full h-24 bg-muted/20 border border-border rounded-md p-3 resize-none"
                    placeholder="Enter notes about this report..."
                  />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Update Status</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Clock className="h-4 w-4 mr-2" /> Investigating
                    </Button>
                    <Button variant="default" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" /> Resolve
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <Ban className="h-4 w-4 mr-2" /> Dismiss
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between">
                  <div className="space-x-2">
                    <Button variant="outline">
                      View Player Profile
                    </Button>
                    <Button variant="outline">
                      View Match Details
                    </Button>
                  </div>
                  <div className="space-x-2">
                    <Button variant="destructive">
                      Ban User
                    </Button>
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Rewards & Coupons component
function RewardsCoupons() {
  const [coupons, setCoupons] = useState(generateRewardCoupons());
  const [activeCoupon, setActiveCoupon] = useState<any>(null);
  const [showCouponDetails, setShowCouponDetails] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  const handleViewCoupon = (coupon: any) => {
    setActiveCoupon(coupon);
    setShowCouponDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-orbitron">Rewards & Coupons</h2>
          <p className="text-muted-foreground">Manage promotional codes, coin rewards, and special drops</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button onClick={() => setShowAddCoupon(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Coupon
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="overflow-hidden border border-muted bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge 
                    variant={coupon.status === 'active' ? 'default' : 'outline'}
                    className="mb-2"
                  >
                    {coupon.status.toUpperCase()}
                  </Badge>
                  <CardTitle className="text-lg font-mono">{coupon.code}</CardTitle>
                  <CardDescription>{`${formatCurrency(coupon.value)} ${coupon.type}`}</CardDescription>
                </div>
                <div>
                  <Badge 
                    variant={coupon.type === 'coins' ? 'secondary' : 'destructive'}
                    className="uppercase"
                  >
                    {coupon.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Usage:</span>
                  <span className="font-medium">{coupon.usageCount} / {coupon.usageLimit}</span>
                </div>
                <Progress value={(coupon.usageCount / coupon.usageLimit) * 100} className="h-2" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">{new Date(coupon.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border pt-4">
              <Button variant="ghost" size="sm" onClick={() => handleViewCoupon(coupon)}>
                View Details
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Ban className="h-4 w-4 mr-2" /> Deactivate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" /> Export Usage
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAddCoupon(false)}>
          <div 
            className="max-w-md w-full bg-card border border-border rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-14 bg-muted flex items-center px-4">
              <h3 className="text-lg font-bold">Add New Coupon</h3>
              <button 
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                onClick={() => setShowAddCoupon(false)}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coupon Code</label>
                  <Input placeholder="e.g., SUMMERCASH100" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Unique code for the coupon. Use uppercase for better readability.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Reward Type</label>
                    <Select defaultValue="coins">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coins">Coins</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Value</label>
                    <Input type="number" placeholder="e.g., 500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Usage Limit</label>
                    <Input type="number" placeholder="e.g., 100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expires On</label>
                    <Input type="date" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <textarea 
                    className="w-full h-20 bg-muted/20 border border-border rounded-md p-3 resize-none"
                    placeholder="Details about this coupon..."
                  />
                </div>
                
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddCoupon(false)}>
                    Cancel
                  </Button>
                  <Button>
                    Create Coupon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    document.title = "Admin Dashboard | FireFight";
    
    // Set active tab based on path
    const path = location.split('/').pop() || 'dashboard';
    setActiveTab(path);
  }, [location]);

  // Check if user has admin rights - in a real app we'd check this on the server too
  // For demo purposes, we're letting everyone see the admin UI
  // if (!user || user.role !== "admin") {
  //   return <Redirect to="/" />;
  // }

  const renderContent = () => {
    switch(activeTab) {
      case 'custom-rooms':
        return <CustomRooms />;
      case 'reports':
        return <ReportsDisputes />;
      case 'rewards':
        return <RewardsCoupons />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* Top header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-orbitron hidden md:block">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm flex items-center">
              <Home className="h-4 w-4 mr-1" /> View Site
            </Link>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={getDefaultAvatar("AdminUser")} alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
