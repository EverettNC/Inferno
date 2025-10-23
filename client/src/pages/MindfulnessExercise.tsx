import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { useUserContext } from '@/contexts/UserContext';
import { apiRequest } from '@/lib/queryClient';

interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: string;
  iconClass: string;
  bgClass: string;
}

const mindfulnessExercises: MindfulnessExercise[] = [
  {
    id: 'bodyScan',
    title: 'Body Scan Meditation',
    description: 'A gentle guide to bring awareness to each part of your body, releasing tension and promoting relaxation.',
    duration: 8,
    icon: 'fas fa-tree',
    iconClass: 'text-secondary-600',
    bgClass: 'bg-secondary-100'
  },
  {
    id: 'lovingKindness',
    title: 'Loving-Kindness Meditation',
    description: 'Develop feelings of goodwill, kindness and warmth towards yourself and others.',
    duration: 10,
    icon: 'fas fa-water',
    iconClass: 'text-primary-600',
    bgClass: 'bg-primary-100'
  },
  {
    id: 'mountain',
    title: 'Mountain Meditation',
    description: 'Cultivate a sense of strength, stability and resilience by connecting with the image of a mountain.',
    duration: 15,
    icon: 'fas fa-mountain',
    iconClass: 'text-calm-600',
    bgClass: 'bg-calm-100'
  }
];

export default function MindfulnessExercise() {
  const { isVoiceModeEnabled, speak } = useVoiceContext();
  const { user } = useUserContext();
  const [activeExercise, setActiveExercise] = useState<MindfulnessExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string | null>(null);
  
  // Fetch recently played exercise
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch this from the backend
      // For now, we'll just pull from localStorage as a demo
      const recent = localStorage.getItem('recentMindfulness');
      if (recent) {
        setRecentlyPlayed(recent);
      }
    }
  }, [user]);
  
  // Start the exercise
  const startExercise = async (exerciseType: string) => {
    if (!user) return;
    
    const exercise = mindfulnessExercises.find(e => e.id === exerciseType);
    if (!exercise) return;
    
    setActiveExercise(exercise);
    setIsPlaying(true);
    
    // Save to recently played
    localStorage.setItem('recentMindfulness', exerciseType);
    
    // Start the exercise in the database
    try {
      const response = await apiRequest('POST', '/api/exercises', {
        userId: user.id,
        type: 'mindfulness',
        subtype: exercise.title,
        completed: false
      });
      
      const data = await response.json();
      setExerciseId(data.id);
      setStartTime(new Date());
      
      // Use voice instructions if enabled
      if (isVoiceModeEnabled) {
        speak(`Starting ${exercise.title}. ${exercise.description}`);
      }
      
      // In a real app, we would play audio or guide the user through the exercise
      // For this demo, we'll simulate the exercise with a timeout
      simulateExercise(exercise.duration);
    } catch (error) {
      console.error('Failed to start exercise:', error);
    }
  };
  
  // Simulate the exercise with a timeout
  const simulateExercise = (duration: number) => {
    // In a real app, this would be actual audio playback
    // For demo purposes, we'll use setTimeout to "complete" the exercise
    setTimeout(() => {
      completeExercise();
    }, duration * 1000); // In a real app, this would be minutes not seconds
  };
  
  // Complete the exercise
  const completeExercise = async () => {
    if (!user || !exerciseId || !startTime || !activeExercise) return;
    
    setIsPlaying(false);
    
    // In a real app, this would be the actual duration of the audio
    const duration = activeExercise.duration * 60; // Convert minutes to seconds
    
    try {
      await apiRequest('PATCH', `/api/exercises/${exerciseId}`, {
        completed: true,
        duration
      });
      
      if (isVoiceModeEnabled) {
        speak(`You've completed the ${activeExercise.title}. How do you feel?`);
      }
    } catch (error) {
      console.error('Failed to complete exercise:', error);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <a className="mr-3 p-2 rounded-full hover:bg-neutral-100 transition" aria-label="Go back">
            <i className="fas fa-arrow-left text-neutral-600"></i>
          </a>
        </Link>
        <h1 className="font-display text-2xl font-bold text-neutral-800">Guided Mindfulness</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft p-5 mb-8 border border-neutral-200">
        <p className="text-neutral-700 mb-6">
          Choose a guided mindfulness exercise below to help center your thoughts and reduce anxiety.
        </p>
        
        <div className="space-y-4 mb-8">
          {mindfulnessExercises.map(exercise => (
            <div key={exercise.id} className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className={`sm:w-1/4 ${exercise.bgClass} h-40 sm:h-auto flex items-center justify-center`}>
                  <i className={`${exercise.icon} text-4xl ${exercise.iconClass}`}></i>
                </div>
                <div className="sm:w-3/4 p-4">
                  <h3 className="font-medium text-lg text-neutral-800 mb-1">{exercise.title}</h3>
                  <p className="text-neutral-600 text-sm mb-3">{exercise.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-500">
                      <i className="far fa-clock mr-1"></i> {exercise.duration} minutes
                    </div>
                    <Button 
                      className="px-4 py-2 bg-secondary-600 text-white rounded-lg text-sm font-medium hover:bg-secondary-700 transition"
                      onClick={() => startExercise(exercise.id)}
                      disabled={isPlaying}
                    >
                      {isPlaying && activeExercise?.id === exercise.id 
                        ? 'In Progress...' 
                        : 'Start Exercise'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recentlyPlayed && (
          <div className="bg-neutral-50 rounded-lg p-4">
            <h3 className="font-medium text-neutral-800 mb-2">Recently Played</h3>
            {(() => {
              const exercise = mindfulnessExercises.find(e => e.id === recentlyPlayed);
              if (!exercise) return null;
              
              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${exercise.bgClass} flex items-center justify-center mr-3`}>
                      <i className={`${exercise.icon} ${exercise.iconClass}`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">{exercise.title}</p>
                      <p className="text-xs text-neutral-500">Last played: 3 days ago</p>
                    </div>
                  </div>
                  <Button 
                    className={`px-3 py-1 ${exercise.bgClass} text-${exercise.iconClass.replace('text-', '')} rounded-lg text-sm hover:bg-${exercise.bgClass.replace('bg-', '')}-200 transition`}
                    onClick={() => startExercise(exercise.id)}
                    disabled={isPlaying}
                  >
                    Play Again
                  </Button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
