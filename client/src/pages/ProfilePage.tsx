import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '@/contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Activity, Heart, Brain, Wind, Mountain } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user } = useUserContext();
  
  // Fetch user stats
  const { data: streakData } = useQuery<{ streak: number; lastCheckIn: string }>({
    queryKey: [`/api/users/${user?.id || 'none'}/check-in-streak`],
    enabled: !!user
  });
  
  // Fetch check-ins
  const { data: checkIns } = useQuery<any[]>({
    queryKey: [`/api/check-ins?userId=${user?.id}`],
    enabled: !!user
  });
  
  // Fetch exercises
  const { data: exercises } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id || 'none'}/exercises`],
    enabled: !!user
  });
  
  const totalCheckIns = checkIns?.length || 0;
  const totalExercises = exercises?.length || 0;
  
  // Count exercises by type
  const exercisesByType = exercises?.reduce((acc: any, ex: any) => {
    acc[ex.type] = (acc[ex.type] || 0) + 1;
    return acc;
  }, {}) || {};
  
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'Never';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Never';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
          Your Profile
        </h1>
        <p className="text-text-secondary">
          Track your progress and manage your wellness journey
        </p>
      </div>
      
      {/* User Info Card */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-accent bg-opacity-15 flex items-center justify-center mr-4">
              <User className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName || user?.username || 'User'}
              </h2>
              <p className="text-text-secondary">@{user?.username}</p>
              <p className="text-xs text-text-secondary mt-1">
                Member since {formatDate(user?.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link 
              href="/settings"
              className="px-4 py-2 bg-button-bg hover:bg-button-hover text-text-primary rounded-lg transition text-sm font-medium"
              data-testid="link-settings"
            >
              Edit Profile
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Grid */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Check-in Streak */}
          <Card className="bg-bg-secondary border-border" data-testid="card-streak">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-accent bg-opacity-15 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">{streakData?.streak || 0}</div>
              <div className="text-xs text-text-secondary">Day Streak</div>
            </CardContent>
          </Card>
          
          {/* Total Check-ins */}
          <Card className="bg-bg-secondary border-border" data-testid="card-checkins">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-success bg-opacity-15 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-success">{totalCheckIns}</div>
              <div className="text-xs text-text-secondary">Check-ins</div>
            </CardContent>
          </Card>
          
          {/* Total Exercises */}
          <Card className="bg-bg-secondary border-border" data-testid="card-exercises">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-info bg-opacity-15 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-6 h-6 text-info" />
              </div>
              <div className="text-2xl font-bold text-info">{totalExercises}</div>
              <div className="text-xs text-text-secondary">Exercises</div>
            </CardContent>
          </Card>
          
          {/* Last Check-in */}
          <Card className="bg-bg-secondary border-border" data-testid="card-last-checkin">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-15 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-sm font-bold text-secondary">
                {streakData?.lastCheckIn ? formatDate(streakData.lastCheckIn) : 'None'}
              </div>
              <div className="text-xs text-text-secondary">Last Check-in</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Exercise Breakdown */}
      {totalExercises > 0 && (
        <div className="mb-6">
          <h2 className="font-display text-lg font-semibold mb-4">Exercise Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Grounding */}
            <Card className="bg-bg-secondary border-border" data-testid="card-grounding-count">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-15 flex items-center justify-center mr-3">
                    <Mountain className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{exercisesByType.grounding || 0}</div>
                    <div className="text-xs text-text-secondary">Grounding</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Breathing */}
            <Card className="bg-bg-secondary border-border" data-testid="card-breathing-count">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-info bg-opacity-15 flex items-center justify-center mr-3">
                    <Wind className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{exercisesByType.breathing || 0}</div>
                    <div className="text-xs text-text-secondary">Breathing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Mindfulness */}
            <Card className="bg-bg-secondary border-border" data-testid="card-mindfulness-count">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-15 flex items-center justify-center mr-3">
                    <Brain className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{exercisesByType.mindfulness || 0}</div>
                    <div className="text-xs text-text-secondary">Mindfulness</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Recent Check-ins */}
      {checkIns && checkIns.length > 0 && (
        <div className="mb-6">
          <h2 className="font-display text-lg font-semibold mb-4">Recent Check-ins</h2>
          <div className="space-y-3">
            {checkIns.slice(0, 5).map((checkIn: any) => (
              <Card key={checkIn.id} className="bg-bg-secondary border-border" data-testid={`checkin-${checkIn.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">
                          {checkIn.mood === 'veryGood' ? '😊' :
                           checkIn.mood === 'good' ? '🙂' :
                           checkIn.mood === 'okay' ? '😐' :
                           checkIn.mood === 'difficult' ? '😕' : '😣'}
                        </span>
                        <span className="font-medium capitalize">
                          {checkIn.mood === 'veryGood' ? 'Very Good' :
                           checkIn.mood === 'veryDifficult' ? 'Very Difficult' :
                           checkIn.mood}
                        </span>
                      </div>
                      {checkIn.notes && (
                        <p className="text-sm text-text-secondary">{checkIn.notes}</p>
                      )}
                    </div>
                    <span className="text-xs text-text-secondary">
                      {formatDate(checkIn.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
