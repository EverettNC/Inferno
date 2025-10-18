import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { useUserContext } from '@/contexts/UserContext';
import useVoiceMode from '@/hooks/useVoiceMode';
import { apiRequest } from '@/lib/queryClient';

interface GroundingStep {
  title: string;
  instruction: string;
  count: number;
  verb: string;
}

const groundingSteps: GroundingStep[] = [
  {
    title: "Step 1: Acknowledge 5 things you see around you",
    instruction: "Look around and name 5 things you can see right now. Take your time to notice details.",
    count: 5,
    verb: "see"
  },
  {
    title: "Step 2: Touch 4 things around you",
    instruction: "Pay attention to how they feel: texture, temperature, smoothness.",
    count: 4,
    verb: "touch"
  },
  {
    title: "Step 3: Listen for 3 sounds",
    instruction: "Notice sounds nearby or in the distance. What do you hear?",
    count: 3,
    verb: "hear"
  },
  {
    title: "Step 4: Identify 2 things you can smell",
    instruction: "Notice any scents or smells in your environment.",
    count: 2,
    verb: "smell"
  },
  {
    title: "Step 5: Acknowledge 1 thing you can taste",
    instruction: "Notice the taste in your mouth right now.",
    count: 1,
    verb: "taste"
  }
];

export default function GroundingExercise() {
  const [location, navigate] = useLocation();
  const { isVoiceModeEnabled, speak } = useVoiceContext();
  const { user } = useUserContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepInput, setStepInput] = useState('');
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const { lastTranscript, startRecording, stopRecording } = useVoiceMode({
    onTranscript: (text) => setStepInput(text)
  });

  // Start the exercise when component mounts
  useEffect(() => {
    if (!exerciseStarted && user) {
      startExercise();
    }
  }, [user]);

  // Handle voice instructions
  useEffect(() => {
    if (isVoiceModeEnabled && currentStep < groundingSteps.length) {
      const step = groundingSteps[currentStep];
      speak(`${step.title}. ${step.instruction}`);
    }
  }, [currentStep, isVoiceModeEnabled, speak]);

  // Start the exercise in the database
  const startExercise = async () => {
    if (!user) return;

    try {
      const response = await apiRequest('POST', '/api/exercises', {
        userId: user.id,
        type: 'grounding',
        subtype: '5-4-3-2-1',
        completed: false
      });
      
      const data = await response.json();
      setExerciseId(data.id);
      setExerciseStarted(true);
      setStartTime(new Date());
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

  const handleSubmitStep = () => {
    if (currentStep < groundingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setStepInput('');
    } else {
      // Exercise complete
      if (isVoiceModeEnabled) {
        speak("Great job! You've completed the grounding exercise. How are you feeling now?");
      }
      
      completeExercise();
      navigate('/');
    }
  };

  const calculateProgress = () => {
    return ((currentStep + 1) / groundingSteps.length) * 100;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <a className="mr-3 p-2 rounded-full hover:bg-neutral-100 transition" aria-label="Go back">
            <i className="fas fa-arrow-left text-neutral-600"></i>
          </a>
        </Link>
        <h1 className="font-display text-2xl font-bold text-neutral-800">5-4-3-2-1 Grounding Exercise</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft p-5 mb-8 border border-neutral-200">
        <p className="text-neutral-700 mb-6">
          This exercise helps bring your awareness to the present moment by using your five senses. Let's start when you're ready.
        </p>
        
        <div className="space-y-8">
          {groundingSteps.map((step, index) => (
            <div 
              key={index} 
              className={`${index === currentStep 
                ? 'bg-primary-50 rounded-lg p-4' 
                : index < currentStep 
                  ? 'bg-neutral-50 rounded-lg p-4' 
                  : 'bg-neutral-100 rounded-lg p-4 opacity-50'
              }`}
            >
              <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
              <p className="text-neutral-700 mb-4">{step.instruction}</p>
              
              {index === currentStep && (
                <>
                  {!isVoiceModeEnabled ? (
                    <div className="flex items-center">
                      <Input 
                        type="text" 
                        className="flex-1 border border-neutral-300 rounded-lg p-3 text-neutral-700" 
                        placeholder={`Type what you ${step.verb}...`}
                        value={stepInput}
                        onChange={(e) => setStepInput(e.target.value)}
                      />
                      <Button 
                        className="ml-2 px-4 py-3 bg-primary-600 text-white rounded-lg" 
                        onClick={handleSubmitStep}
                      >
                        Next
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <button 
                        className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition mb-2"
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onTouchStart={startRecording}
                        onTouchEnd={stopRecording}
                      >
                        <i className="fas fa-microphone text-2xl text-primary-600"></i>
                      </button>
                      <p className="text-sm text-neutral-500 italic mb-3">Press and hold to speak</p>
                      
                      {lastTranscript && (
                        <>
                          <p className="mb-3 text-neutral-700 bg-white p-2 rounded border border-neutral-200 w-full">
                            {lastTranscript}
                          </p>
                          <Button 
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                            onClick={handleSubmitStep}
                          >
                            Next
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-neutral-600">
            Step <span className="font-semibold">{currentStep + 1}</span> of {groundingSteps.length}
          </div>
          <div className="w-1/2">
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
