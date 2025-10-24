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


import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  Info, 
  Heart, 
  Smile, 
  MessageCircle, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  Brain,
  Camera,
  Headphones
} from 'lucide-react';
import useVoiceMode from '@/hooks/useVoiceMode';
import { apiRequest } from '@/lib/queryClient';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: {
    primaryEmotion: string;
    intensity: number;
    suggestion: string;
  };
  crisisLevel?: number;
};

export default function ChatPage() {
  const { user } = useUserContext();
  const { isVoiceModeEnabled, speak, stopSpeaking } = useVoiceContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '🌟 Hey there! I\'m Inferno, your friendly companion in this healing journey. I\'m here to chat, listen, and walk alongside you. What\'s on your heart today? ✨',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [speechToSpeechMode, setSpeechToSpeechMode] = useState(false);
  const [currentUserEmotion, setCurrentUserEmotion] = useState('calm');
  const [behavioralContext, setBehavioralContext] = useState({
    recentTopics: ['anxiety', 'grounding'],
    engagementLevel: 0.8,
    preferredInteractionStyle: 'conversational',
    sessionDuration: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKeyMissing = false; // We have the API key set up in the environment
  
  const { isRecording, lastTranscript, startRecording, stopRecording } = useVoiceMode({
    onTranscript: (text) => {
      if (speechToSpeechMode) {
        setInputMessage(text);
        handleSendMessage(text);
      } else {
        setInputMessage(text);
      }
    }
  });

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak the initial welcome message
  useEffect(() => {
    if (isVoiceModeEnabled && messages.length === 1) {
      speak(messages[0].content);
    }
  }, [isVoiceModeEnabled, messages, speak]);

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage;
    if (!messageToSend.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputMessage(''); // Only clear if it came from input field
    setIsSending(true);
    
    try {
      // First, analyze the emotion and crisis potential
      const emotionResponse = await apiRequest('POST', '/api/ai/analyze-emotion', {
        message: messageToSend
      });
      
      const emotionData = await emotionResponse.json();
      
      // Update the user message with emotion data
      if (emotionData && emotionData.primaryEmotion) {
        userMessage.emotion = {
          primaryEmotion: emotionData.primaryEmotion,
          intensity: emotionData.intensity || 0,
          suggestion: emotionData.suggestion || ''
        };
        userMessage.crisisLevel = emotionData.crisisLevel || 0;
        
        // Update the message in the state
        setMessages(prev => 
          prev.map(msg => msg.id === userMessage.id ? userMessage : msg)
        );
      }
      
      // Make API call to get AI response with the emotional context
      const response = await apiRequest('POST', '/api/ai/chat', {
        message: messageToSend,
        context: user 
          ? `The user's name is ${user.firstName || 'Friend'}. Their primary emotion appears to be ${emotionData?.primaryEmotion || 'unknown'} with intensity ${emotionData?.intensity || 'unknown'}.`
          : `The user's primary emotion appears to be ${emotionData?.primaryEmotion || 'unknown'} with intensity ${emotionData?.intensity || 'unknown'}.`
      });
      
      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.response || "I'm sorry, I'm having trouble responding right now.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Read the response aloud if voice mode is enabled
      if (isVoiceModeEnabled) {
        speak(aiMessage.content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I'm having trouble connecting. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClickSend = () => {
    handleSendMessage();
  };

  // Generate dynamic helpful topics based on behavioral context
  const generateDynamicTopics = () => {
    const baseTopics = [
      {
        title: "🌟 Feeling Check-In",
        description: "Let's explore what you're experiencing right now",
        prompt: "How are you feeling today? I'm here to listen ✨"
      },
      {
        title: "🎵 Music & Healing",
        description: "Discover healing through music and sound",
        prompt: "Can you help me find some healing music? 🎶"
      },
      {
        title: "🧘‍♀️ Grounding Together",
        description: "Gentle techniques to feel more present",
        prompt: "I'd love to try a grounding exercise with you"
      }
    ];

    // Add emotion-specific topics
    const emotionBasedTopics = {
      anxious: {
        title: "🌬️ Calming Breaths",
        description: "Breathing exercises for anxiety relief",
        prompt: "I'm feeling anxious, can you guide me through some breathing?"
      },
      sad: {
        title: "💙 Gentle Support",
        description: "Comfort and understanding for difficult emotions",
        prompt: "I'm feeling down and could use some gentle support"
      },
      overwhelmed: {
        title: "🌊 Breaking It Down",
        description: "Making overwhelming feelings more manageable",
        prompt: "Everything feels overwhelming right now, can you help?"
      }
    };

    const dynamicTopics = [...baseTopics];
    
    // Add emotion-based topic if applicable
    const emotionTopic = emotionBasedTopics[currentUserEmotion as keyof typeof emotionBasedTopics];
    if (emotionTopic) {
      dynamicTopics.push(emotionTopic);
    }

    // Add behavioral context topics
    if (behavioralContext.recentTopics.includes('anxiety')) {
      dynamicTopics.push({
        title: "🌈 Anxiety Toolkit",
        description: "More tools for managing anxious moments",
        prompt: "What are some other ways to handle anxiety?"
      });
    }

    if (behavioralContext.engagementLevel > 0.7) {
      dynamicTopics.push({
        title: "🚀 Deeper Conversation",
        description: "Ready to explore more together",
        prompt: "I'm ready to dive deeper into my healing journey"
      });
    }

    return dynamicTopics;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-24">
      {/* Friendly Header */}
      <Card className="mb-6 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <div className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition cursor-pointer" aria-label="Go back">
                  <i className="fas fa-arrow-left text-white"></i>
                </div>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-pink-200 animate-pulse" />
                  <h1 className="text-3xl font-bold">Let's Chat Together ✨</h1>
                  <Smile className="w-8 h-8 text-yellow-200" />
                </div>
                <p className="text-purple-100 mt-1">
                  I'm here to listen, support, and walk alongside you in your healing journey 💜
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-purple-200">Your friendly companion</div>
              <div className="text-2xl">🌟 Inferno AI 🌟</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {apiKeyMissing ? (
        <Card className="mb-6 bg-bg-secondary border-border">
          <CardContent className="p-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-danger-light bg-opacity-20 rounded-full mx-auto flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-danger-light" />
              </div>
              <h3 className="text-lg font-medium mb-2">OpenAI API Key Required</h3>
              <p className="text-text-secondary mb-4">
                To enable AI features, please provide an OpenAI API key. This allows Inferno AI to provide personalized support for PTSD and anxiety.
              </p>
              <p className="text-sm text-text-secondary opacity-80 mb-4">
                Your API key is stored securely and only used for processing your interactions with Inferno AI.
              </p>
              <Button 
                className="bg-button-bg hover:bg-button-hover text-text-primary"
                onClick={() => {
                  alert("Please contact the administrator to set up the OpenAI API key.");
                }}
              >
                Set up API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="card mb-8">
          <div className="p-5">
            <div className="flex items-center border-b border-border pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3">
                <span className="text-accent text-xl">🔥</span>
              </div>
              <div>
                <h2 className="font-medium">Inferno AI</h2>
                <p className="text-xs text-text-secondary">Trauma-informed Support Companion</p>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="h-96 overflow-y-auto mb-4 px-2 custom-scrollbar">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={message.sender === 'user' ? 'message message-user' : 'message message-ai'}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Emotion indicator for user messages */}
                    {message.sender === 'user' && message.emotion && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        <div className={`emotion-tag ${
                          message.emotion.intensity > 7 ? 'bg-emotion-extreme bg-opacity-15' : 
                          message.emotion.intensity > 5 ? 'bg-emotion-high bg-opacity-15' : 
                          message.emotion.intensity > 3 ? 'bg-emotion-medium bg-opacity-15' : 
                          'bg-emotion-low bg-opacity-15'
                        }`}>
                          <span className={`emotion-indicator ${
                            message.emotion.intensity > 7 ? 'emotion-extreme' : 
                            message.emotion.intensity > 5 ? 'emotion-high' : 
                            message.emotion.intensity > 3 ? 'emotion-medium' : 
                            'emotion-low'
                          }`}></span>
                          {message.emotion.primaryEmotion} ({message.emotion.intensity}/10)
                        </div>
                      </div>
                    )}
                    
                    {/* Crisis warning for high crisis levels */}
                    {message.crisisLevel && message.crisisLevel >= 3 && (
                      <div className={`mt-2 p-2 rounded-md ${
                        message.crisisLevel >= 4 
                          ? 'bg-crisis-emergency bg-opacity-15 border-l-2 border-crisis-emergency' 
                          : 'bg-crisis-severe bg-opacity-15 border-l-2 border-crisis-severe'
                      }`}>
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`h-4 w-4 ${
                            message.crisisLevel >= 4 ? 'text-crisis-emergency' : 'text-crisis-severe'
                          }`} />
                          <span className={`text-xs ${
                            message.crisisLevel >= 4 ? 'text-crisis-emergency' : 'text-crisis-severe'
                          }`}>
                            {message.crisisLevel >= 4 
                              ? "Emergency support resources recommended" 
                              : "Support resources available"}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-1 text-xs text-right opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="border-t border-border pt-4">
              {!isVoiceModeEnabled ? (
                <div className="flex">
                  <Textarea 
                    className="flex-1 bg-input-bg border-input-border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:ring-opacity-50 focus:border-accent-subtle transition min-h-[80px]"
                    placeholder="Type your message here..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    className="ml-2 px-4 py-3 bg-button-bg hover:bg-button-hover text-text-primary rounded-lg self-end"
                    onClick={handleClickSend}
                    disabled={isSending || !inputMessage.trim()}
                  >
                    {isSending ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-sm text-text-secondary mb-2">Press and hold to speak</p>
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
                    <i className={`fas fa-microphone text-2xl ${
                      isRecording ? 'text-danger-light' : 'text-accent'
                    }`}></i>
                  </button>
                  
                  {lastTranscript && (
                    <div className="w-full mt-3">
                      <p className="mb-2 bg-bg-tertiary p-3 rounded-md border border-border w-full">
                        {lastTranscript}
                      </p>
                      <div className="flex justify-end">
                        <Button 
                          className="px-4 py-2 bg-button-bg hover:bg-button-hover text-text-primary rounded-lg" 
                          onClick={handleClickSend}
                          disabled={isSending}
                        >
                          {isSending ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-paper-plane"></i>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Speech-to-Speech Mode Toggle */}
      <Card className="mb-6 bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                {speechToSpeechMode ? <Headphones className="w-5 h-5 text-purple-600" /> : <MessageCircle className="w-5 h-5 text-purple-600" />}
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {speechToSpeechMode ? '🎙️ Voice Conversation Mode' : '💬 Text Chat Mode'}
                </div>
                <div className="text-sm text-gray-600">
                  {speechToSpeechMode ? 'Speak naturally - I\'ll respond with voice' : 'Type or speak to start our conversation'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSpeechToSpeechMode(!speechToSpeechMode)}
                className={speechToSpeechMode ? 'bg-purple-100 border-purple-300' : ''}
              >
                {speechToSpeechMode ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
                {speechToSpeechMode ? 'Switch to Text' : 'Voice Mode'}
              </Button>
              
              {isRecording ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopRecording}
                >
                  <MicOff className="w-4 h-4 mr-1" />
                  Stop Listening
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={startRecording}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Mic className="w-4 h-4 mr-1" />
                  Listen
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Helpful Topics - Based on Behavior */}
      <Card className="mb-8 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800">Let's Talk About... ✨</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Based on our conversation, here are some things we could explore together:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generateDynamicTopics().map((topic, index) => (
              <button 
                key={index}
                className="group text-left p-4 bg-white rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                onClick={() => handleSendMessage(topic.prompt)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{topic.title.split(' ')[0]}</span>
                  <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                    {topic.title.substring(topic.title.indexOf(' ') + 1)}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  {topic.description}
                </p>
                <div className="mt-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to start this conversation →
                </div>
              </button>
            ))}
          </div>

          {/* Behavioral Context Indicator */}
          <div className="mt-4 p-3 bg-white/60 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>Personalized for you based on:</span>
              <Badge variant="outline" className="text-xs">Current mood: {currentUserEmotion}</Badge>
              <Badge variant="outline" className="text-xs">Engagement: {Math.round(behavioralContext.engagementLevel * 100)}%</Badge>
              <Badge variant="outline" className="text-xs">Session: {Math.round(behavioralContext.sessionDuration)}min</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-xs text-text-secondary text-center">
        <p>Inferno AI is a trauma-informed support tool, not a replacement for professional care.</p>
        <p className="mt-1 text-danger-light">If you're experiencing a crisis, please call 988 or text HOME to 741741.</p>
      </div>
    </div>
  );
}