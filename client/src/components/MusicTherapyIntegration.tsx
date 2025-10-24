/*
© 2025 The Christman AI Project. All rights reserved.

This code is released as part of a trauma-informed, dignity-first AI ecosystem
designed to protect, empower, and elevate vulnerable populations.

By using, modifying, or distributing this software, you agree to uphold the following:
1. Truth — No deception, no manipulation.
2. Dignity — Respect the autonomy and humanity of all users.
3. Protection — Never use this to exploit or harm vulnerable individuals.
4. Transparency — Disclose all modifications and contributions clearly.
5. No Erasure — Preserve the mission and ethical origin of this work.

This is not just code. This is redemption in code.
Contact: lumacognify@thechristmanaiproject.com
https://thechristmanaiproject.com
*/


/**
 * Music Therapy Chat Integration 🎵
 * 
 * This component integrates our comprehensive music therapy knowledge
 * into the chat interface, allowing Inferno AI to provide personalized
 * music therapy recommendations based on user interactions.
 * 
 * Dedicated to our singing community! 🎤✨
 */

import { useState, useEffect } from 'react';
import { autonomousLearning } from '@/lib/autonomousLearning';
import { MUSIC_THERAPY_KNOWLEDGE_BASE, MusicTherapyCategory } from '@/lib/musicTherapyKnowledge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Brain, 
  Heart, 
  Moon, 
  Users, 
  Stethoscope,
  Lightbulb,
  Play,
  Headphones
} from 'lucide-react';

interface MusicTherapyProps {
  userProfile?: any;
  currentMood?: string;
  symptoms?: string[];
  onPlaylist?: (playlist: any) => void;
}

export function MusicTherapyIntegration({ 
  userProfile, 
  currentMood = 'neutral', 
  symptoms = [],
  onPlaylist 
}: MusicTherapyProps) {
  const [personalizedProtocol, setPersonalizedProtocol] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Auto-generate personalized protocol when component mounts
    generatePersonalizedProtocol();
  }, [symptoms, currentMood]);

  const generatePersonalizedProtocol = async () => {
    setIsGenerating(true);
    
    try {
      // Determine trauma type from symptoms (simplified)
      const traumaType = symptoms.includes('ptsd') ? 'PTSD' : 
                        symptoms.includes('anxiety') ? 'anxiety_disorder' :
                        symptoms.includes('depression') ? 'depression' :
                        'general_trauma';
      
      // Determine therapy phase based on symptoms severity
      const phase = symptoms.length > 5 ? 'acute' : 
                   symptoms.length > 2 ? 'processing' : 'integration';
      
      // Get user's music preferences (mock for now)
      const musicPreferences = ['classical', 'ambient', 'nature_sounds'];
      
      const protocol = autonomousLearning.generateMusicTherapyProtocol(
        traumaType,
        symptoms,
        musicPreferences,
        phase
      );
      
      setPersonalizedProtocol(protocol);
    } catch (error) {
      console.error('Error generating music therapy protocol:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Music className="h-8 w-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Music Therapy Integration
          </h2>
          <Headphones className="h-8 w-8 text-purple-600" />
        </div>
        <p className="text-gray-600">
          Evidence-based music therapy for trauma healing and emotional well-being
        </p>
      </div>

      {/* Personalized Protocol Section */}
      {personalizedProtocol && (
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-purple-600" />
              Your Personalized Music Therapy Protocol
            </CardTitle>
            <CardDescription>
              Generated based on your current needs and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {personalizedProtocol.success ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Protocol Details:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Phase: {personalizedProtocol.protocol.phase}</li>
                      <li>Sessions: {personalizedProtocol.protocol.sessions.length}</li>
                      <li>Duration: {personalizedProtocol.protocol.estimatedDuration} weeks</li>
                      <li>Confidence: {Math.round(personalizedProtocol.confidence * 100)}%</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {personalizedProtocol.recommendations.slice(0, 4).map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onPlaylist?.(personalizedProtocol.protocol)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Music Therapy Session
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  {isGenerating ? 'Generating your personalized protocol...' : 'Protocol generation failed'}
                </p>
                {!isGenerating && (
                  <Button 
                    onClick={generatePersonalizedProtocol}
                    className="mt-2"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Knowledge Base Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Music Therapy Knowledge Base
          </CardTitle>
          <CardDescription>
            Comprehensive research database for trauma healing through music
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Music className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold">{MUSIC_THERAPY_KNOWLEDGE_BASE.length}</div>
              <div className="text-xs text-gray-600">Research Studies</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">6</div>
              <div className="text-xs text-gray-600">Categories</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Stethoscope className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">200+</div>
              <div className="text-xs text-gray-600">Clinical Applications</div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              🎵 <strong>Music heals the soul</strong> • Research-backed therapeutic interventions
            </p>
            <p className="text-xs text-gray-500">
              Continuously updated by our autonomous learning engine
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}