import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { useUserContext } from '@/contexts/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

interface BreathingPattern {
  id: string;
  name: string;
  pattern: number[];
  instructions: string[];
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    pattern: [4, 4, 4, 4],
    instructions: ['Breathe in through your nose...', 'Hold your breath...', 'Exhale slowly through your mouth...', 'Hold...']
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    pattern: [4, 7, 8, 0],
    instructions: ['Breathe in through your nose...', 'Hold your breath...', 'Exhale slowly through your mouth...', '']
  },
  {
    id: 'equal',
    name: 'Equal Breathing',
    pattern: [5, 0, 5, 0],
    instructions: ['Breathe in through your nose...', '', 'Exhale slowly through your mouth...', '']
  }
];

export default function BreathingExercise() {
  const { isVoiceModeEnabled, speak } = useVoiceContext();
  const { user } = useUserContext();
  const [selectedPattern, setSelectedPattern] = useState<string>('box');
  const [duration, setDuration] = useState<string>('5');
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [count, setCount] = useState(4);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<Date | null>(null);
  
  // Get the current pattern
  const getCurrentPattern = () => {
    return breathingPatterns.find(pattern => pattern.id === selectedPattern) || breathingPatterns[0];
  };
  
  // Start the exercise in the database
  const startExercise = async () => {
    if (!user) return;

    try {
      const response = await apiRequest('POST', '/api/exercises', {
        userId: user.id,
        type: 'breathing',
        subtype: getCurrentPattern().name,
        completed: false
      });
      
      const data = await response.json();
      setExerciseId(data.id);
      setExerciseStarted(true);
      const now = new Date();
      setStartTime(now);
      
      // Calculate end time
      const durationMs = parseInt(duration) * 60 * 1000;
      endTimeRef.current = new Date(now.getTime() + durationMs);
    } catch (error) {
      console.error('Failed to start exercise:', error);
    }
  };
  
  // Complete the exercise in the database
  const completeExercise = async () => {
    if (!user || !exerciseId || !startTime) return;

    try {
      const duration = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
      
      await apiRequest('PATCH', `/api/exercises/${exerciseId}`, {
        completed: true,
        duration
      });
    } catch (error) {
      console.error('Failed to complete exercise:', error);
    }
  };
  
  // Start breathing exercise
  const startBreathingExercise = () => {
    if (!exerciseStarted) {
      startExercise();
    }
    
    setIsRunning(true);
    
    const pattern = getCurrentPattern();
    setCurrentPhase(0);
    setCount(pattern.pattern[0]);
    
    // Set up voice instruction if enabled
    if (isVoiceModeEnabled) {
      speak(pattern.instructions[0]);
    }
    
    // Start interval for counting
    intervalRef.current = window.setInterval(() => {
      setCount(prevCount => {
        if (prevCount <= 1) {
          // Move to next phase
          const nextPhase = (currentPhase + 1) % 4;
          setCurrentPhase(nextPhase);
          
          // If next phase has a duration of 0, skip it
          if (pattern.pattern[nextPhase] === 0) {
            const skipToPhase = (nextPhase + 1) % 4;
            setCurrentPhase(skipToPhase);
            
            // Speak the instruction if voice mode is enabled
            if (isVoiceModeEnabled && pattern.instructions[skipToPhase]) {
              speak(pattern.instructions[skipToPhase]);
            }
            
            return pattern.pattern[skipToPhase];
          }
          
          // Speak the instruction if voice mode is enabled
          if (isVoiceModeEnabled && pattern.instructions[nextPhase]) {
            speak(pattern.instructions[nextPhase]);
          }
          
          return pattern.pattern[nextPhase];
        }
        return prevCount - 1;
      });
      
      // Update elapsed time
      if (startTime) {
        const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        // Check if we've reached the end of the duration
        if (endTimeRef.current && new Date() >= endTimeRef.current) {
          pauseBreathingExercise();
          completeExercise();
          
          if (isVoiceModeEnabled) {
            speak("Great job! You've completed your breathing exercise.");
          }
        }
      }
    }, 1000);
  };
  
  // Pause breathing exercise
  const pauseBreathingExercise = () => {
    setIsRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      
      // If exercise was started but not completed, mark it as completed
      if (exerciseStarted && exerciseId) {
        completeExercise();
      }
    };
  }, [exerciseStarted, exerciseId]);
  
  // Format remaining time
  const formatRemainingTime = () => {
    if (!endTimeRef.current || !startTime) return '0:00';
    
    const totalDuration = parseInt(duration) * 60;
    const remaining = Math.max(0, totalDuration - elapsedTime);
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <a className="mr-3 p-2 rounded-full hover:bg-neutral-100 transition" aria-label="Go back">
            <i className="fas fa-arrow-left text-neutral-600"></i>
          </a>
        </Link>
        <h1 className="font-display text-2xl font-bold text-neutral-800">Deep Breathing Exercise</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft p-5 mb-8 border border-neutral-200">
        <p className="text-neutral-700 mb-6">
          Deep breathing helps calm your nervous system and reduce anxiety. Follow the animation below and breathe along with it.
        </p>
        
        <div className="flex flex-col items-center justify-center py-8">
          {/* Breathing Animation Circle */}
          <div className="relative mb-8">
            <div className={`w-40 h-40 rounded-full bg-calm-100 flex items-center justify-center ${isRunning ? 'breathing-animation' : ''}`}>
              <div className="w-32 h-32 rounded-full bg-calm-200 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-calm-300 flex items-center justify-center text-white font-medium">
                  Breathe
                </div>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="text-center max-w-md">
            <p className="text-xl font-medium text-neutral-800 mb-2" id="breathing-instruction">
              {isRunning 
                ? getCurrentPattern().instructions[currentPhase]
                : "Press start when you're ready"}
            </p>
            <p className="text-neutral-600">
              {isRunning 
                ? `Count: ${count}`
                : `Duration: ${formatRemainingTime()}`}
            </p>
          </div>
          
          {/* Control buttons */}
          <div className="flex space-x-4 mt-8">
            {isRunning ? (
              <Button 
                variant="outline"
                className="px-5 py-2 rounded-lg bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition"
                onClick={pauseBreathingExercise}>
                <i className="fas fa-pause mr-2"></i> Pause
              </Button>
            ) : (
              <Button 
                className="px-5 py-2 rounded-lg bg-calm-600 text-white font-medium hover:bg-calm-700 transition"
                onClick={startBreathingExercise}>
                <i className="fas fa-play mr-2"></i> Start
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-neutral-800 mb-2">Exercise Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-600 mb-1">Breathing Pattern</label>
              <Select
                value={selectedPattern}
                onValueChange={setSelectedPattern}
                disabled={isRunning}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a breathing pattern" />
                </SelectTrigger>
                <SelectContent>
                  {breathingPatterns.map(pattern => (
                    <SelectItem key={pattern.id} value={pattern.id}>
                      {pattern.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-neutral-600 mb-1">Duration</label>
              <Select
                value={duration}
                onValueChange={setDuration}
                disabled={isRunning}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
