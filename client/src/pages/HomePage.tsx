import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { useUserContext } from '@/contexts/UserContext';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { EmojiButton } from '@/components/ui/emoji-button';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import useVoiceMode from '@/hooks/useVoiceMode';
import { format } from 'date-fns';

export default function HomePage() {
  const { user } = useUserContext();
  const { isVoiceModeEnabled, speak } = useVoiceContext();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [checkInText, setCheckInText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isRecording, lastTranscript, startRecording, stopRecording } = useVoiceMode({
    onTranscript: (text) => setCheckInText(text)
  });
  
  // Fetch check-in streak data if user is logged in
  const { data: streakData } = useQuery<{ streak: number; lastCheckIn: string }>({
    queryKey: [`/api/users/${user?.id || 'none'}/check-in-streak`],
    enabled: !!user
  });
  
  // Fetch recent activities if user is logged in
  const { data: recentActivities } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id || 'none'}/exercises`],
    enabled: !!user
  });
  
  // Welcome user with voice on first load
  useEffect(() => {
    if (isVoiceModeEnabled && user) {
      speak(`Hello ${user.firstName || 'there'}. How are you feeling today? I'm here to support you.`);
    }
  }, [isVoiceModeEnabled, user, speak]);
  
  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
  };
  
  const handleCheckInSubmit = async () => {
    if (!user) return;
    
    if (!selectedMood) {
      alert("Please select how you're feeling today");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/check-ins', {
        userId: user.id,
        mood: selectedMood,
        notes: checkInText
      });
      
      // Reset form
      setSelectedMood(null);
      setCheckInText('');
      
      if (isVoiceModeEnabled) {
        speak('Thank you for checking in today. Your response has been recorded.');
      }
      
    } catch (error) {
      console.error('Failed to submit check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatLastCheckIn = (date?: string) => {
    if (!date) return 'No previous check-ins';
    
    const checkInDate = new Date(date);
    const today = new Date();
    
    if (checkInDate.toDateString() === today.toDateString()) {
      return `Today, ${format(checkInDate, 'h:mm a')}`;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (checkInDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(checkInDate, 'h:mm a')}`;
    }
    
    return format(checkInDate, 'MMM d, h:mm a');
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      {/* Welcome Message */}
      <section className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
          Hello, <span className="text-accent">{user?.firstName || 'there'}</span>
        </h1>
        <p className="text-text-secondary">
          How are you feeling today? I'm here to support you.
        </p>
      </section>
      
      {/* Daily Check-in Card */}
      <section className="card mb-8">
        <div className="p-5">
          <h2 className="font-display text-lg font-semibold mb-3">Daily Check-in</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            {/* Mood Selection */}
            <div className="flex-1 w-full">
              <p className="text-sm text-text-secondary mb-2">How are you feeling right now?</p>
              <div className="grid grid-cols-5 gap-2">
                <EmojiButton 
                  emoji="😊" 
                  label="Very Good" 
                  isSelected={selectedMood === 'veryGood'}
                  onClick={() => handleMoodSelection('veryGood')}
                />
                <EmojiButton 
                  emoji="🙂" 
                  label="Good" 
                  isSelected={selectedMood === 'good'}
                  onClick={() => handleMoodSelection('good')}
                />
                <EmojiButton 
                  emoji="😐" 
                  label="Okay" 
                  isSelected={selectedMood === 'okay'}
                  onClick={() => handleMoodSelection('okay')}
                />
                <EmojiButton 
                  emoji="😕" 
                  label="Difficult" 
                  isSelected={selectedMood === 'difficult'}
                  onClick={() => handleMoodSelection('difficult')}
                />
                <EmojiButton 
                  emoji="😣" 
                  label="Very Difficult" 
                  isSelected={selectedMood === 'veryDifficult'}
                  onClick={() => handleMoodSelection('veryDifficult')}
                />
              </div>
            </div>
          </div>
          
          {/* Voice/Text Input Area */}
          <div className="bg-bg-tertiary rounded-lg p-4 mb-4 border border-border">
            <p className="text-sm text-text-secondary mb-2">Would you like to share more about how you're feeling?</p>
            
            {/* Text Input (shown when voice mode is disabled) */}
            {!isVoiceModeEnabled && (
              <div className="mb-3">
                <Textarea 
                  className="w-full bg-input-bg border-input-border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:ring-opacity-30 focus:border-accent transition h-24"
                  placeholder="Type here..."
                  value={checkInText}
                  onChange={(e) => setCheckInText(e.target.value)}
                />
              </div>
            )}
            
            {/* Voice Input (shown when voice mode is enabled) */}
            {isVoiceModeEnabled && (
              <div className="flex flex-col items-center py-4">
                <button 
                  className={`w-16 h-16 rounded-full transition ${
                    isRecording 
                      ? 'bg-danger-light bg-opacity-20 animate-pulse' 
                      : 'bg-accent bg-opacity-15 hover:bg-opacity-25'
                  }`}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  <i className={`fas fa-microphone text-2xl ${isRecording ? 'text-danger-light' : 'text-accent'}`}></i>
                </button>
                <p className="text-sm text-text-secondary italic">Press and hold to speak</p>
                {lastTranscript && (
                  <p className="mt-3 bg-bg-primary p-3 rounded-md border border-border w-full">{lastTranscript}</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                className="px-4 py-2 rounded-lg bg-button-bg hover:bg-button-hover text-text-primary transition"
                onClick={handleCheckInSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
          
          {/* Check-in Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary text-sm">Your check-in streak:</span>
              <span className="font-semibold text-accent">{streakData?.streak || 0} days</span>
            </div>
            <div className="text-xs text-text-secondary">
              Last check-in: <span className="text-text-primary opacity-90">{formatLastCheckIn(streakData?.lastCheckIn)}</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Tools Grid */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-4">Quick Tools</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/grounding">
            <a className="card block bg-bg-secondary rounded-xl p-4 border border-border hover:border-accent-subtle transition text-center">
              <div className="w-12 h-12 rounded-full bg-primary bg-opacity-15 flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-mountain text-accent"></i>
              </div>
              <h3 className="font-medium mb-1">Grounding</h3>
              <p className="text-xs text-text-secondary">5-4-3-2-1 technique</p>
            </a>
          </Link>
          
          <Link href="/breathing">
            <a className="card block bg-bg-secondary rounded-xl p-4 border border-border hover:border-accent-subtle transition text-center">
              <div className="w-12 h-12 rounded-full bg-info bg-opacity-15 flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-wind text-info"></i>
              </div>
              <h3 className="font-medium mb-1">Breathing</h3>
              <p className="text-xs text-text-secondary">Guided breathing exercises</p>
            </a>
          </Link>
          
          <Link href="/mindfulness">
            <a className="card block bg-bg-secondary rounded-xl p-4 border border-border hover:border-accent-subtle transition text-center">
              <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-15 flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-brain text-secondary"></i>
              </div>
              <h3 className="font-medium mb-1">Mindfulness</h3>
              <p className="text-xs text-text-secondary">Guided meditation</p>
            </a>
          </Link>
          
          <Link href="/resources">
            <a className="card block bg-bg-secondary rounded-xl p-4 border border-border hover:border-accent-subtle transition text-center">
              <div className="w-12 h-12 rounded-full bg-accent-subtle bg-opacity-15 flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-book-open text-accent-subtle"></i>
              </div>
              <h3 className="font-medium mb-1">Resources</h3>
              <p className="text-xs text-text-secondary">Educational materials</p>
            </a>
          </Link>
        </div>
      </section>
      
      {/* Crisis Support Section */}
      <section className="card p-5 mb-8">
        <h2 className="font-display text-lg font-semibold mb-3">Crisis Support</h2>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center bg-bg-tertiary p-3 rounded-lg border border-border">
            <div className="w-10 h-10 rounded-full bg-warning bg-opacity-15 flex items-center justify-center mr-3">
              <i className="fas fa-phone text-warning"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">National Crisis Helpline</h3>
              <a href="tel:988" className="text-accent font-medium text-sm">988</a>
            </div>
            <a href="tel:988" className="px-4 py-2 bg-warning bg-opacity-15 text-warning rounded-lg font-medium text-sm hover:bg-opacity-25 transition">
              Call Now
            </a>
          </div>
          
          <div className="flex items-center bg-bg-tertiary p-3 rounded-lg border border-border">
            <div className="w-10 h-10 rounded-full bg-accent bg-opacity-15 flex items-center justify-center mr-3">
              <i className="fas fa-comment-dots text-accent"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Crisis Text Line</h3>
              <p className="text-text-secondary text-sm">Text HOME to 741741</p>
            </div>
            <a href="sms:741741?body=HOME" className="px-4 py-2 bg-accent bg-opacity-15 text-accent rounded-lg font-medium text-sm hover:bg-opacity-25 transition">
              Text Now
            </a>
          </div>
          
          <div className="flex items-center bg-bg-tertiary p-3 rounded-lg border border-border">
            <div className="w-10 h-10 rounded-full bg-success bg-opacity-15 flex items-center justify-center mr-3">
              <i className="fas fa-user-friends text-success"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Veterans Crisis Line</h3>
              <a href="tel:988" className="text-accent font-medium text-sm">988, Press 1</a>
            </div>
            <a href="tel:988,1" className="px-4 py-2 bg-success bg-opacity-15 text-success rounded-lg font-medium text-sm hover:bg-opacity-25 transition">
              Call Now
            </a>
          </div>
        </div>
        
        <p className="text-xs text-text-secondary mt-4">
          If you're experiencing a life-threatening emergency, please call 911 or go to your nearest emergency room.
        </p>
      </section>
      
      {/* Recent Activity Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-semibold">Recent Activity</h2>
          <Link href="/activity">
            <a className="text-sm text-accent hover:text-accent-subtle transition-colors">View all</a>
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentActivities && recentActivities.length > 0 ? (
            recentActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="card bg-bg-secondary rounded-lg p-4 border border-border">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{
                        backgroundColor: activity.type === 'mindfulness' ? 'rgba(66, 72, 116, 0.15)' : 
                                         activity.type === 'breathing' ? 'rgba(90, 137, 173, 0.15)' : 
                                         'rgba(166, 177, 225, 0.15)'
                      }}
                    >
                      <i className="fas fa-brain text-accent"
                        style={{
                          color: activity.type === 'mindfulness' ? 'var(--secondary)' : 
                                activity.type === 'breathing' ? 'var(--info)' : 
                                'var(--accent)'
                        }}
                      ></i>
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {activity.type === 'grounding' ? 'Grounding Exercise' : 
                         activity.type === 'breathing' ? 'Breathing Exercise' :
                         activity.type === 'mindfulness' ? `Mindfulness: ${activity.subtype}` :
                         'Activity'}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {formatLastCheckIn(activity.createdAt)}
                        {activity.duration && ` • ${Math.floor(activity.duration / 60)} minutes`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" 
                    style={{
                      backgroundColor: activity.type === 'mindfulness' ? 'rgba(66, 72, 116, 0.15)' : 
                                       activity.type === 'breathing' ? 'rgba(90, 137, 173, 0.15)' : 
                                       'rgba(166, 177, 225, 0.15)',
                      color: activity.type === 'mindfulness' ? 'var(--secondary)' : 
                             activity.type === 'breathing' ? 'var(--info)' : 
                             'var(--accent)'
                    }}
                  >
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-6">
              <p className="text-text-secondary text-center">No recent activity. Try some exercises to get started!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
