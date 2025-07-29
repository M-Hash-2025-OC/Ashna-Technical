import { useState, useEffect, useMemo } from 'react';
import { Trophy, Search, Filter, RotateCcw, Moon, Sun, TrendingUp, Users, Award, ChevronDown, ChevronUp, Edit, Save, X, Plus, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Label } from './components/ui/label';
import { Separator } from './components/ui/separator';
import { Alert, AlertDescription } from './components/ui/alert';
import manipalLogo from 'figma:asset/037849985660164f792e54493d1678ce817cdf52.png';

// Backend-ready interfaces
interface Round {
  id: string;
  name: string;
  maxPoints: number;
  description: string;
}

interface TeamScore {
  roundId: string;
  roundName: string;
  points: number;
  maxPoints: number;
  timestamp: string;
  updatedBy: string;
}

interface Team {
  id: string;
  rank: number;
  name: string;
  points: number;
  mascot: string;
  members: number;
  lastUpdate: string;
  trend: 'up' | 'down' | 'stable';
  scores: TeamScore[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team';
  teamId?: string;
}

interface DashboardStats {
  totalTeams: number;
  totalPoints: number;
  avgPoints: number;
  lastUpdate: string;
  activeRounds: number;
}

// Mock rounds data
const mockRounds: Round[] = [
  {
    id: "round-1",
    name: "Problem Statement",
    maxPoints: 500,
    description: "Initial problem identification and solution approach"
  },
  {
    id: "round-2", 
    name: "Technical Implementation",
    maxPoints: 800,
    description: "Code quality, architecture, and functionality"
  },
  {
    id: "round-3",
    name: "Innovation & Creativity",
    maxPoints: 600,
    description: "Originality and creative problem solving"
  },
  {
    id: "round-4",
    name: "Presentation",
    maxPoints: 400,
    description: "Communication and demo effectiveness"
  },
  {
    id: "round-5",
    name: "Business Viability",
    maxPoints: 700,
    description: "Market potential and scalability"
  }
];

// Refined mascot system
const mascots = [
  "🦊", "🐺", "🦁", "🐯", "🦄", "🐉", "🦅", "🐙", 
  "🐧", "🦉", "🦋", "🐢", "🦒", "🦓", "🐘", "🐼"
];

// Mock users
const mockUsers: User[] = [
  {
    id: "user-admin-1",
    name: "Sarah Johnson",
    email: "admin@manipal.edu",
    role: "admin"
  },
  {
    id: "user-team-1",
    name: "Alex Chen",
    email: "alex@team1.com", 
    role: "team",
    teamId: "team-001"
  }
];

// Mock teams with detailed scoring
const mockTeams: Team[] = [
  {
    id: "team-001",
    rank: 1,
    name: "Code Wizards",
    points: 2850,
    mascot: mascots[0],
    members: 4,
    lastUpdate: "2 min ago",
    trend: "up",
    scores: [
      { roundId: "round-1", roundName: "Problem Statement", points: 450, maxPoints: 500, timestamp: "2024-01-15T10:30:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-2", roundName: "Technical Implementation", points: 750, maxPoints: 800, timestamp: "2024-01-15T14:20:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-3", roundName: "Innovation & Creativity", points: 580, maxPoints: 600, timestamp: "2024-01-15T16:45:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-4", roundName: "Presentation", points: 380, maxPoints: 400, timestamp: "2024-01-15T18:10:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-5", roundName: "Business Viability", points: 690, maxPoints: 700, timestamp: "2024-01-15T19:30:00Z", updatedBy: "Sarah Johnson" }
    ]
  },
  {
    id: "team-002",
    rank: 2,
    name: "Tech Innovators", 
    points: 2720,
    mascot: mascots[1],
    members: 5,
    lastUpdate: "5 min ago",
    trend: "stable",
    scores: [
      { roundId: "round-1", roundName: "Problem Statement", points: 420, maxPoints: 500, timestamp: "2024-01-15T10:35:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-2", roundName: "Technical Implementation", points: 720, maxPoints: 800, timestamp: "2024-01-15T14:25:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-3", roundName: "Innovation & Creativity", points: 550, maxPoints: 600, timestamp: "2024-01-15T16:50:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-4", roundName: "Presentation", points: 350, maxPoints: 400, timestamp: "2024-01-15T18:15:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-5", roundName: "Business Viability", points: 680, maxPoints: 700, timestamp: "2024-01-15T19:35:00Z", updatedBy: "Sarah Johnson" }
    ]
  },
  {
    id: "team-003",
    rank: 3,
    name: "Digital Pioneers",
    points: 2580,
    mascot: mascots[2],
    members: 3,
    lastUpdate: "8 min ago", 
    trend: "up",
    scores: [
      { roundId: "round-1", roundName: "Problem Statement", points: 400, maxPoints: 500, timestamp: "2024-01-15T10:40:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-2", roundName: "Technical Implementation", points: 680, maxPoints: 800, timestamp: "2024-01-15T14:30:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-3", roundName: "Innovation & Creativity", points: 520, maxPoints: 600, timestamp: "2024-01-15T16:55:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-4", roundName: "Presentation", points: 320, maxPoints: 400, timestamp: "2024-01-15T18:20:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-5", roundName: "Business Viability", points: 660, maxPoints: 700, timestamp: "2024-01-15T19:40:00Z", updatedBy: "Sarah Johnson" }
    ]
  },
  {
    id: "team-004",
    rank: 4, 
    name: "Future Builders",
    points: 2340,
    mascot: mascots[3],
    members: 4,
    lastUpdate: "12 min ago",
    trend: "down",
    scores: [
      { roundId: "round-1", roundName: "Problem Statement", points: 380, maxPoints: 500, timestamp: "2024-01-15T10:45:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-2", roundName: "Technical Implementation", points: 620, maxPoints: 800, timestamp: "2024-01-15T14:35:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-3", roundName: "Innovation & Creativity", points: 480, maxPoints: 600, timestamp: "2024-01-15T17:00:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-4", roundName: "Presentation", points: 300, maxPoints: 400, timestamp: "2024-01-15T18:25:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-5", roundName: "Business Viability", points: 560, maxPoints: 700, timestamp: "2024-01-15T19:45:00Z", updatedBy: "Sarah Johnson" }
    ]
  },
  {
    id: "team-005",
    rank: 5,
    name: "Code Crafters", 
    points: 2180,
    mascot: mascots[4],
    members: 4,
    lastUpdate: "15 min ago",
    trend: "up",
    scores: [
      { roundId: "round-1", roundName: "Problem Statement", points: 360, maxPoints: 500, timestamp: "2024-01-15T10:50:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-2", roundName: "Technical Implementation", points: 580, maxPoints: 800, timestamp: "2024-01-15T14:40:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-3", roundName: "Innovation & Creativity", points: 460, maxPoints: 600, timestamp: "2024-01-15T17:05:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-4", roundName: "Presentation", points: 280, maxPoints: 400, timestamp: "2024-01-15T18:30:00Z", updatedBy: "Sarah Johnson" },
      { roundId: "round-5", roundName: "Business Viability", points: 500, maxPoints: 700, timestamp: "2024-01-15T19:50:00Z", updatedBy: "Sarah Johnson" }
    ]
  }
];

const mockStats: DashboardStats = {
  totalTeams: mockTeams.length,
  totalPoints: mockTeams.reduce((sum, team) => sum + team.points, 0),
  avgPoints: Math.round(mockTeams.reduce((sum, team) => sum + team.points, 0) / mockTeams.length),
  lastUpdate: "Just now",
  activeRounds: mockRounds.length
};

// Mock API functions
const mockAPI = {
  updateTeamScore: async (teamId: string, roundId: string, points: number, authToken: string) => {
    // Mock POST/PATCH endpoint: /api/teams/{teamId}/scores/{roundId}
    console.log('API Call:', {
      endpoint: `/api/teams/${teamId}/scores/${roundId}`,
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: { points }
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    return { success: true, message: 'Score updated successfully' };
  },
  
  createTeam: async (teamData: any, authToken: string) => {
    console.log('API Call:', {
      endpoint: '/api/teams',
      method: 'POST', 
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: teamData
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, teamId: `team-${Date.now()}` };
  }
};

// Podium markers
const getPodiumIcon = (rank: number) => {
  switch (rank) {
    case 1: return "🏆";
    case 2: return "🥈"; 
    case 3: return "🥉";
    default: return null;
  }
};

// Trend indicator
const TrendIndicator = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  const colors = {
    up: 'text-emerald-600',
    down: 'text-red-400',
    stable: 'text-muted-foreground'
  };
  
  if (trend === 'stable') return null;
  
  return (
    <TrendingUp 
      className={`w-3 h-3 ${colors[trend]} ${trend === 'down' ? 'rotate-180' : ''}`}
    />
  );
};

// Score Breakdown Component
const ScoreBreakdown = ({ team, isAdmin, onScoreUpdate }: { 
  team: Team, 
  isAdmin: boolean,
  onScoreUpdate: (teamId: string, roundId: string, points: number) => void 
}) => {
  const [editingRound, setEditingRound] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number>(0);

  const handleEditStart = (roundId: string, currentPoints: number) => {
    setEditingRound(roundId);
    setEditScore(currentPoints);
  };

  const handleEditSave = (roundId: string) => {
    onScoreUpdate(team.id, roundId, editScore);
    setEditingRound(null);
  };

  const handleEditCancel = () => {
    setEditingRound(null);
    setEditScore(0);
  };

  return (
    <Card className="mt-4 border-emerald-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-emerald-800">Score Breakdown - {team.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {team.scores.map((score) => (
            <div key={score.roundId} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-emerald-900">{score.roundName}</h4>
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                    Round {score.roundId.split('-')[1]}
                  </Badge>
                </div>
                <div className="text-sm text-emerald-600">
                  Updated by {score.updatedBy} • {new Date(score.timestamp).toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {editingRound === score.roundId ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editScore}
                      onChange={(e) => setEditScore(Number(e.target.value))}
                      max={score.maxPoints}
                      min={0}
                      className="w-20 h-8"
                    />
                    <span className="text-sm text-muted-foreground">/ {score.maxPoints}</span>
                    <Button size="sm" onClick={() => handleEditSave(score.roundId)} className="h-8 px-2">
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleEditCancel} className="h-8 px-2">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-bold text-lg text-emerald-700">{score.points}</div>
                      <div className="text-sm text-muted-foreground">/ {score.maxPoints}</div>
                    </div>
                    {isAdmin && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditStart(score.roundId, score.points)}
                        className="h-8 px-2 text-emerald-600 hover:bg-emerald-100"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-100 border border-emerald-200">
          <span className="font-semibold text-emerald-900">Total Score</span>
          <div className="text-right">
            <div className="font-bold text-xl text-emerald-700">{team.points}</div>
            <div className="text-sm text-emerald-600">/ {mockRounds.reduce((sum, round) => sum + round.maxPoints, 0)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Team row component with expandable details
const TeamRow = ({ 
  team, 
  isTopThree, 
  isAdmin, 
  onScoreUpdate,
  expandedTeam,
  onToggleExpand 
}: { 
  team: Team, 
  isTopThree: boolean,
  isAdmin: boolean,
  onScoreUpdate: (teamId: string, roundId: string, points: number) => void,
  expandedTeam: string | null,
  onToggleExpand: (teamId: string | null) => void
}) => {
  const podiumIcon = getPodiumIcon(team.rank);
  const isExpanded = expandedTeam === team.id;
  
  return (
    <div>
      <div 
        className={`
          group relative bg-card rounded-xl border transition-all duration-300 ease-out cursor-pointer
          ${isTopThree 
            ? 'shadow-lg hover:shadow-xl border-emerald-300 bg-gradient-to-r from-emerald-50 to-transparent' 
            : 'shadow-sm hover:shadow-md border-border hover:border-emerald-300'
          }
          ${isTopThree ? 'py-6 px-6' : 'py-4 px-6'}
          ${isExpanded ? 'shadow-xl border-emerald-400' : 'hover:scale-[1.01]'}
        `}
        onClick={() => onToggleExpand(isExpanded ? null : team.id)}
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-1 flex items-center justify-center">
            <div className={`
              flex items-center justify-center rounded-full transition-all duration-200
              ${isTopThree 
                ? 'w-10 h-10 bg-emerald-600 text-white font-bold text-lg shadow-lg' 
                : 'w-8 h-8 bg-gray-100 text-gray-600 font-medium'
              }
            `}>
              {team.rank}
            </div>
          </div>

          <div className="col-span-8 flex items-center gap-4">
            <div className={`
              flex items-center justify-center rounded-full border-2 shadow-sm transition-all duration-200
              ${isTopThree 
                ? 'w-12 h-12 bg-white border-emerald-300' 
                : 'w-10 h-10 bg-white border-gray-200'
              }
              group-hover:scale-110
            `}>
              <span className={`${isTopThree ? 'text-2xl' : 'text-lg'} animate-pulse`}>
                {team.mascot}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {podiumIcon && (
                  <span className="text-lg">{podiumIcon}</span>
                )}
                <h3 className={`
                  font-semibold truncate
                  ${isTopThree ? 'text-lg text-emerald-800' : 'text-base text-foreground'}
                `}>
                  {team.name}
                </h3>
                <TrendIndicator trend={team.trend} />
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {team.members} members
                </span>
                <span>•</span>
                <span>Updated {team.lastUpdate}</span>
              </div>
            </div>
          </div>

          <div className="col-span-3 flex items-center justify-between">
            <div className="text-right flex-1">
              <div className={`
                font-bold
                ${isTopThree ? 'text-xl text-emerald-700' : 'text-lg text-foreground'}
              `}>
                {team.points.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">points</div>
            </div>
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2">
          <ScoreBreakdown 
            team={team} 
            isAdmin={isAdmin}
            onScoreUpdate={onScoreUpdate}
          />
        </div>
      )}
    </div>
  );
};

// Stats cards component
const StatsCards = ({ stats }: { stats: DashboardStats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <Card className="border-emerald-300 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100">
            <Trophy className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Leading Score</p>
            <p className="font-bold text-xl text-emerald-700">
              {mockTeams[0]?.points.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Teams</p>
            <p className="font-bold text-xl text-foreground">{stats.totalTeams}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Award className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Rounds</p>
            <p className="font-bold text-xl text-foreground">{stats.activeRounds}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Update</p>
            <p className="font-bold text-xl text-foreground">{stats.lastUpdate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Login Component
const LoginForm = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login logic
    const user = email === 'admin@manipal.edu' 
      ? mockUsers.find(u => u.role === 'admin')!
      : mockUsers.find(u => u.role === 'team')!;
    
    onLogin(user);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl shadow-lg overflow-hidden bg-emerald-100 border border-emerald-200">
            <img src={manipalLogo} alt="Manipal Logo" className="w-full h-full object-cover" />
          </div>
          <CardTitle className="text-2xl text-emerald-800">Hackathon Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@manipal.edu or alex@team1.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <Button 
            onClick={handleLogin} 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          
          <Alert>
            <AlertDescription>
              <strong>Demo Credentials:</strong><br />
              Admin: admin@manipal.edu<br />
              Team: alex@team1.com
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'points'>('rank');
  const [filterBy, setFilterBy] = useState<'all' | 'top3' | 'trending'>('all');
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [teams, setTeams] = useState(mockTeams);

  // Set Light Emerald theme by default
  useEffect(() => {
    document.documentElement.classList.add('theme-light-emerald');
    document.documentElement.classList.remove('dark');
  }, []);

  // Handle score updates (Admin only)
  const handleScoreUpdate = async (teamId: string, roundId: string, points: number) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    try {
      // Mock API call with authentication
      const authToken = 'mock-admin-token-' + currentUser.id;
      await mockAPI.updateTeamScore(teamId, roundId, points, authToken);
      
      // Update local state
      setTeams(prev => prev.map(team => {
        if (team.id === teamId) {
          const updatedScores = team.scores.map(score => 
            score.roundId === roundId 
              ? { ...score, points, timestamp: new Date().toISOString(), updatedBy: currentUser.name }
              : score
          );
          const newTotalPoints = updatedScores.reduce((sum, score) => sum + score.points, 0);
          return { ...team, scores: updatedScores, points: newTotalPoints, lastUpdate: "Just now" };
        }
        return team;
      }));
      
      // Recalculate ranks
      setTeams(prev => {
        const sorted = [...prev].sort((a, b) => b.points - a.points);
        return sorted.map((team, index) => ({ ...team, rank: index + 1 }));
      });
      
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  };

  // Filter and sort teams
  const filteredAndSortedTeams = useMemo(() => {
    let filtered = teams.filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filterBy === 'all' || 
        (filterBy === 'top3' && team.rank <= 3) ||
        (filterBy === 'trending' && team.trend === 'up');
      
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'points': return b.points - a.points;
        default: return a.rank - b.rank;
      }
    });
  }, [teams, searchTerm, sortBy, filterBy]);

  if (!currentUser) {
    return <LoginForm onLogin={setCurrentUser} />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-emerald-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl shadow-lg overflow-hidden bg-emerald-100 border border-emerald-200">
              <img src={manipalLogo} alt="Manipal Hackathon Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-800">Hackathon Leaderboard</h1>
              <p className="text-muted-foreground">Real-time team standings and performance</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <Badge variant={isAdmin ? "default" : "secondary"} className={isAdmin ? "bg-emerald-600" : ""}>
              <Shield className="w-3 h-3 mr-1" />
              {currentUser.role === 'admin' ? 'Admin' : 'Team Member'}
            </Badge>
            <span className="text-sm text-muted-foreground">Welcome, {currentUser.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentUser(null)}
              className="gap-2 hover:bg-emerald-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <StatsCards stats={mockStats} />

        {/* Admin Controls */}
        {isAdmin && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50">
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Admin Mode:</strong> You can edit team scores by clicking on any team to expand their details, then use the edit buttons next to each round score.
            </AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Sort by Rank</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="points">Sort by Points</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="top3">Top 3</SelectItem>
              <SelectItem value="trending">Trending Up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Badge */}
        {(searchTerm || filterBy !== 'all') && (
          <div className="mb-4">
            <Badge variant="secondary" className="gap-2 bg-emerald-100 text-emerald-700">
              {filteredAndSortedTeams.length} teams found
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  ✕
                </Button>
              )}
            </Badge>
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-3">
          {filteredAndSortedTeams.map((team) => (
            <TeamRow 
              key={team.id} 
              team={team} 
              isTopThree={team.rank <= 3}
              isAdmin={isAdmin}
              onScoreUpdate={handleScoreUpdate}
              expandedTeam={expandedTeam}
              onToggleExpand={setExpandedTeam}
            />
          ))}
        </div>

        {filteredAndSortedTeams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-semibold mb-2">No teams found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}