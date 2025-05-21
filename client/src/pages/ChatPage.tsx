import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
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
      content: 'Hello, I\'m Inferno AI, your trauma-informed support companion. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKeyMissing = false; // We have the API key set up in the environment
  
  const { isRecording, lastTranscript, startRecording, stopRecording } = useVoiceMode({
    onTranscript: (text) => setInputMessage(text)
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);
    
    try {
      // First, analyze the emotion and crisis potential
      const emotionResponse = await apiRequest('POST', '/api/ai/analyze-emotion', {
        message: inputMessage
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
        message: inputMessage,
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

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-24">
      <div className="flex items-center mb-6">
        <Link href="/">
          <div className="mr-3 p-2 rounded-full hover:bg-bg-tertiary transition cursor-pointer" aria-label="Go back">
            <i className="fas fa-arrow-left text-text-secondary"></i>
          </div>
        </Link>
        <h1 className="text-2xl font-bold">Chat with Inferno AI</h1>
      </div>
      
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
                    onClick={handleSendMessage}
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
                          onClick={handleSendMessage}
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
      
      <div className="bg-bg-secondary rounded-lg p-4 mb-8 border border-border">
        <h2 className="font-medium mb-2">Helpful Topics to Chat About</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Grounding Techniques card */}
          <button 
            className="text-left p-4 bg-bg-tertiary rounded-lg border border-border hover:border-accent-subtle transition card"
            onClick={() => setInputMessage("Can you help me with a grounding exercise?")}
          >
            <h3 className="font-medium mb-1">Grounding Techniques</h3>
            <p className="text-xs text-text-secondary">Learn methods to stay present during anxiety</p>
          </button>
          
          {/* Coping Strategies card */}
          <button 
            className="text-left p-4 bg-bg-tertiary rounded-lg border border-border hover:border-accent-subtle transition card"
            onClick={() => setInputMessage("What are some coping strategies for PTSD triggers?")}
          >
            <h3 className="font-medium mb-1">Coping with Triggers</h3>
            <p className="text-xs text-text-secondary">Strategies to manage triggering situations</p>
          </button>
          
          {/* Communication Tips card */}
          <button 
            className="text-left p-4 bg-bg-tertiary rounded-lg border border-border hover:border-accent-subtle transition card"
            onClick={() => setInputMessage("How can I explain my PTSD to family members?")}
          >
            <h3 className="font-medium mb-1">Communication Tips</h3>
            <p className="text-xs text-text-secondary">Help explaining your experience to others</p>
          </button>
        </div>
      </div>
      
      <div className="text-xs text-text-secondary text-center">
        <p>Inferno AI is a trauma-informed support tool, not a replacement for professional care.</p>
        <p className="mt-1 text-danger-light">If you're experiencing a crisis, please call 988 or text HOME to 741741.</p>
      </div>
    </div>
  );
}