import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import useVoiceMode from '@/hooks/useVoiceMode';
import { apiRequest } from '@/lib/queryClient';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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
      // Make API call to get AI response
      const response = await apiRequest('POST', '/api/ai/chat', {
        message: inputMessage,
        context: user ? `The user's name is ${user.firstName || 'Friend'}.` : ''
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
          <div className="mr-3 p-2 rounded-full hover:bg-neutral-100 transition cursor-pointer" aria-label="Go back">
            <i className="fas fa-arrow-left text-neutral-600"></i>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-neutral-800">Chat with Inferno AI</h1>
      </div>
      
      {apiKeyMissing ? (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">OpenAI API Key Required</h3>
              <p className="text-neutral-600 mb-4">
                To enable AI features, please provide an OpenAI API key. This allows Inferno AI to provide personalized support for PTSD and anxiety.
              </p>
              <p className="text-sm text-neutral-500 mb-4">
                Your API key is stored securely and only used for processing your interactions with Inferno AI.
              </p>
              <Button 
                className="bg-primary-600 text-white hover:bg-primary-700"
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
        <div className="bg-white rounded-xl shadow-soft mb-8 overflow-hidden border border-neutral-200">
          <div className="p-5">
            <div className="flex items-center border-b border-neutral-200 pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                <span className="text-primary-600 text-xl">🔥</span>
              </div>
              <div>
                <h2 className="font-medium text-neutral-800">Inferno AI</h2>
                <p className="text-xs text-neutral-500">Trauma-informed Support Companion</p>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="h-96 overflow-y-auto mb-4 px-2">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary-100 text-primary-900' 
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="mt-1 text-xs text-right opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="border-t border-neutral-200 pt-4">
              {!isVoiceModeEnabled ? (
                <div className="flex">
                  <Textarea 
                    className="flex-1 border border-neutral-300 rounded-lg p-3 text-neutral-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition min-h-[80px]"
                    placeholder="Type your message here..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    className="ml-2 px-4 py-3 bg-primary-600 text-white rounded-lg self-end"
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
                  <p className="text-sm text-neutral-600 mb-2">Press and hold to speak</p>
                  <button 
                    className={`w-16 h-16 rounded-full ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-primary-100'} flex items-center justify-center mb-2 hover:bg-primary-200 transition`}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                  >
                    <i className={`fas fa-microphone text-2xl ${isRecording ? 'text-red-600' : 'text-primary-600'}`}></i>
                  </button>
                  
                  {lastTranscript && (
                    <div className="w-full">
                      <p className="mb-2 text-neutral-700 bg-neutral-50 p-2 rounded border border-neutral-200 w-full">
                        {lastTranscript}
                      </p>
                      <div className="flex justify-end">
                        <Button 
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg" 
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
      
      <div className="bg-neutral-50 rounded-lg p-4 mb-8 border border-neutral-100">
        <h2 className="font-medium text-neutral-800 mb-2">Helpful Topics to Chat About</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button 
            className="text-left p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary-200 transition"
            onClick={() => setInputMessage("Can you help me with a grounding exercise?")}
          >
            <h3 className="font-medium text-neutral-800 mb-1">Grounding Techniques</h3>
            <p className="text-xs text-neutral-600">Learn methods to stay present during anxiety</p>
          </button>
          
          <button 
            className="text-left p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary-200 transition"
            onClick={() => setInputMessage("What are some coping strategies for PTSD triggers?")}
          >
            <h3 className="font-medium text-neutral-800 mb-1">Coping with Triggers</h3>
            <p className="text-xs text-neutral-600">Strategies to manage triggering situations</p>
          </button>
          
          <button 
            className="text-left p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary-200 transition"
            onClick={() => setInputMessage("How can I explain my PTSD to family members?")}
          >
            <h3 className="font-medium text-neutral-800 mb-1">Communication Tips</h3>
            <p className="text-xs text-neutral-600">Help explaining your experience to others</p>
          </button>
        </div>
      </div>
      
      <div className="text-xs text-neutral-500 text-center">
        <p>Inferno AI is a trauma-informed support tool, not a replacement for professional care.</p>
        <p>If you're experiencing a crisis, please call 988 or text HOME to 741741.</p>
      </div>
    </div>
  );
}