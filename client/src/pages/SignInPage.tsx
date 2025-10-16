import { useState } from 'react';
import { useLocation } from 'wouter';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Flame, Hand, Brain } from 'lucide-react';

export default function SignInPage() {
  const [, navigate] = useLocation();
  const { login } = useUserContext();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both username and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username, password);
      toast({
        title: "System Initialized",
        description: "Welcome to Inferno AI.",
      });
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Initialization Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="spark"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10" data-testid="signin-container">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 
            className="text-6xl md:text-7xl font-black tracking-wider glow-text" 
            style={{ fontFamily: 'Orbitron, Rajdhani, sans-serif' }}
            data-testid="text-app-title"
          >
            INFERNO
          </h1>
          
          <p className="text-sm md:text-base tracking-widest text-text-secondary uppercase" data-testid="text-platform-subtitle">
            Trauma-Aware AI Platform
          </p>
          
          <p className="text-lg md:text-xl text-text-primary italic" data-testid="text-tagline">
            Out of the fire, we remember who we are.
          </p>
        </div>

        {/* Central Flame Icon */}
        <div className="flex justify-center my-8">
          <div className="relative">
            <Flame 
              className="w-24 h-24 fire-glow" 
              strokeWidth={1.5}
              data-testid="icon-flame"
            />
            <div className="absolute inset-0 animate-pulse">
              <Flame 
                className="w-24 h-24 opacity-50" 
                style={{ color: 'var(--flame-orange)' }}
                strokeWidth={1}
              />
            </div>
          </div>
        </div>

        {/* Ground and Reflect Icons */}
        <div className="flex justify-center gap-16 mb-8">
          <div className="text-center" data-testid="feature-ground">
            <Hand className="w-12 h-12 mx-auto mb-2 fire-glow" strokeWidth={1.5} data-testid="icon-ground" />
            <p className="text-text-secondary text-sm uppercase tracking-wide">Ground</p>
          </div>
          <div className="text-center" data-testid="feature-reflect">
            <Brain className="w-12 h-12 mx-auto mb-2 fire-glow" strokeWidth={1.5} data-testid="icon-reflect" />
            <p className="text-text-secondary text-sm uppercase tracking-wide">Reflect</p>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="card max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 glow-text tracking-wider" data-testid="text-form-title">
            Initialize System
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-electric-cyan tracking-wide uppercase"
                data-testid="label-username"
              >
                User Identification
              </label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-input-bg border-2 border-input-border focus:border-electric-cyan text-text-glow placeholder:text-text-secondary transition-all duration-300"
                  placeholder="Enter your name"
                  autoComplete="username"
                  disabled={isLoading}
                  data-testid="input-username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-electric-cyan tracking-wide uppercase"
                data-testid="label-password"
              >
                Security Key
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input-bg border-2 border-input-border focus:border-electric-cyan text-text-glow placeholder:text-text-secondary transition-all duration-300"
                  placeholder="Enter security key"
                  autoComplete="current-password"
                  disabled={isLoading}
                  data-testid="input-password"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-button-bg hover:bg-button-hover text-text-glow font-bold py-4 text-lg tracking-wider uppercase transition-all duration-300 transform hover:scale-105"
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⚡</span>
                  Initializing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">⚡</span>
                  Initialize
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              type="button" 
              className="text-accent-teal hover:text-electric-cyan text-sm transition-colors duration-200"
              data-testid="link-new-user"
            >
              New User? Create Access Point
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-text-secondary space-y-2 mt-8">
          <p data-testid="text-disclaimer">
            Inferno AI is a trauma-informed support tool, not a replacement for professional care.
          </p>
          <p className="text-accent-teal" data-testid="text-crisis">
            Crisis? Call 988 (Suicide & Crisis Lifeline) | Text HOME to 741741
          </p>
        </div>
      </div>
    </div>
  );
}
