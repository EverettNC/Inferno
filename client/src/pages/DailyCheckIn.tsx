import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserContext } from '@/contexts/UserContext';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmojiButton } from '@/components/ui/emoji-button';
import { apiRequest } from '@/lib/queryClient';
import useVoiceMode from '@/hooks/useVoiceMode';
import { format } from 'date-fns';

const moodOptions = [
  { id: 'veryGood', emoji: '😊', label: 'Very Good' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'difficult', emoji: '😕', label: 'Difficult' },
  { id: 'veryDifficult', emoji: '😣', label: 'Very Difficult' }
];

export default function DailyCheckIn() {
  const [location, navigate] = useLocation();
  const { user } = useUserContext();
  const { isVoiceModeEnabled, speak } = useVoiceContext();
  const queryClient = useQueryClient();
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [checkInText, setCheckInText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInComplete, setCheckInComplete] = useState(false);
  
  const { isRecording, lastTranscript, startRecording, stopRecording } = useVoiceMode({
    onTranscript: (text) => setCheckInText(text)
  });
  
  // Fetch streak data if user is logged in
  const { data: streakData } = useQuery<{ streak: number; lastCheckIn?: string }>({
    queryKey: [`/api/users/${user?.id}/check-in-streak`],
    enabled: !!user
  });
  
  // Voice guidance on component mount
  useEffect(() => {
    if (isVoiceModeEnabled) {
      speak('Welcome to your daily check-in. How are you feeling today? You can select a mood and optionally share more about your experience.');
    }
  }, [isVoiceModeEnabled, speak]);
  
  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    
    if (isVoiceModeEnabled) {
      const selectedOption = moodOptions.find(option => option.id === mood);
      if (selectedOption) {
        speak(`You selected ${selectedOption.label}. Would you like to share more about how you are feeling?`);
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!user) {
      // Handle not logged in state
      navigate('/login');
      return;
    }
    
    if (!selectedMood) {
      if (isVoiceModeEnabled) {
        speak('Please select how you are feeling today before submitting.');
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/check-ins', {
        userId: user.id,
        mood: selectedMood,
        notes: checkInText
      });
      
      // Invalidate streak query to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/check-in-streak`] });
      
      // Show success state
      setCheckInComplete(true);
      
      if (isVoiceModeEnabled) {
        speak('Thank you for checking in today. Your response has been recorded.');
      }
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit check-in:', error);
      if (isVoiceModeEnabled) {
        speak('Sorry, there was a problem submitting your check-in. Please try again.');
      }
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
  
  if (checkInComplete) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex items-center mb-6">
          <Link href="/">
            <a className="mr-3 p-2 rounded-full hover:bg-neutral-100 transition" aria-label="Go back">
              <i className="fas fa-arrow-left text-neutral-600"></i>
            </a>
          </Link>
          <h1 className="font-display text-2xl font-bold text-neutral-800">Daily Check-in</h1>
        </div>
        
        <Card className="mb-8 p-6">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-check text-2xl text-success-600"></i>
            </div>
            <h2 className="text-xl font-medium text-neutral-800 mb-2">Check-in Complete</h2>
            <p className="text-neutral-600 mb-4 text-center">
              Thank you for checking in today. Your response has been recorded.
            </p>
            <p className="text-sm text-neutral-500">
              Redirecting to home page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <a className="mr-3 p-2 rounded-full hover:bg-neutral-100 transition" aria-label="Go back">
            <i className="fas fa-arrow-left text-neutral-600"></i>
          </a>
        </Link>
        <h1 className="font-display text-2xl font-bold text-neutral-800">Daily Check-in</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft mb-8 overflow-hidden border border-neutral-200">
        <div className="p-5">
          <p className="text-neutral-600 mb-4">
            Regular check-ins help you track your emotional state and identify patterns over time.
          </p>
          
          <div className="mb-6">
            <p className="text-sm text-neutral-600 mb-2">How are you feeling right now?</p>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map(option => (
                <EmojiButton
                  key={option.id}
                  emoji={option.emoji}
                  label={option.label}
                  isSelected={selectedMood === option.id}
                  onClick={() => handleMoodSelection(option.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-neutral-600 mb-2">Would you like to share more about how you're feeling?</p>
            
            {!isVoiceModeEnabled ? (
              <div className="mb-3">
                <Textarea 
                  className="w-full border border-neutral-300 rounded-lg p-3 text-neutral-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition h-24"
                  placeholder="Type here..."
                  value={checkInText}
                  onChange={(e) => setCheckInText(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <button 
                  className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-2 hover:bg-primary-200 transition"
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  <i className={`fas fa-microphone text-2xl ${isRecording ? 'text-primary-600 animate-pulse' : 'text-primary-600'}`}></i>
                </button>
                <p className="text-sm text-neutral-500 italic">Press and hold to speak</p>
                {lastTranscript && (
                  <p className="mt-3 text-neutral-700 bg-white p-2 rounded border border-neutral-200 w-full">{lastTranscript}</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition shadow-sm"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-neutral-600 text-sm">Your check-in streak:</span>
              <span className="font-semibold text-primary-700">{streakData?.streak || 0} days</span>
            </div>
            <div className="text-xs text-neutral-500">
              Last check-in: <span>{formatLastCheckIn(streakData?.lastCheckIn)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-neutral-50 rounded-lg p-4 mb-8 border border-neutral-100">
        <h2 className="font-medium text-neutral-800 mb-2">Daily Check-in Tips</h2>
        <ul className="text-sm text-neutral-600 space-y-2">
          <li className="flex items-start">
            <i className="fas fa-check-circle text-primary-600 mt-1 mr-2"></i>
            <span>Be honest with yourself - there are no "wrong" feelings.</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check-circle text-primary-600 mt-1 mr-2"></i>
            <span>Try to check in at the same time each day to build a habit.</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check-circle text-primary-600 mt-1 mr-2"></i>
            <span>Notice patterns in your mood over time to identify triggers.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
