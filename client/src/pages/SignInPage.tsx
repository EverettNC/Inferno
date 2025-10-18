import { useState } from 'react';
import { useLocation } from 'wouter';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Flame, Hand, User as UserHead, User, RotateCw } from 'lucide-react';

export default function SignInPage() {
  const [, navigate] = useLocation();
  const { login } = useUserContext();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter your name to initialize.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes: use name as both username and password
      // In production, this would be a different flow
      await login(name.toLowerCase().replace(/\s+/g, ''), 'demo123');
      toast({
        title: "System Initialized",
        description: `Welcome, ${name}.`,
      });
      navigate('/');
    } catch (error) {
      console.error('Initialization error:', error);
      toast({
        title: "Initialization Failed",
        description: "Unable to initialize system. Please try again.",
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
          <div className="inline-block">
            <h1 
              className="text-6xl md:text-7xl font-black tracking-wider glow-text" 
              style={{ fontFamily: 'Orbitron, Rajdhani, sans-serif' }}
              data-testid="text-app-title"
            >
              INFERNO
            </h1>
            {/* Orange underline */}
            <div 
              className="h-1 w-full mt-2 rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, transparent, var(--flame-orange), transparent)',
                boxShadow: '0 0 10px var(--flame-orange)'
              }}
            />
          </div>
          
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
              className="w-24 h-24 opacity-70" 
              style={{ color: '#D85A2E' }}
              strokeWidth={1.5}
              data-testid="icon-flame"
            />
            <div className="absolute inset-0 animate-pulse">
              <Flame 
                className="w-24 h-24 opacity-30" 
                style={{ color: 'var(--flame-orange)' }}
                strokeWidth={1}
              />
            </div>
          </div>
        </div>

        {/* Ground and Reflect Icons */}
        <div className="flex justify-center gap-24 mb-12">
          <div className="text-center" data-testid="feature-ground">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Hand 
                className="w-14 h-14 opacity-70" 
                style={{ color: '#FF6A2E' }}
                strokeWidth={1.5} 
                data-testid="icon-ground" 
              />
            </div>
            <p className="text-text-secondary text-sm uppercase tracking-wider">Ground</p>
          </div>
          <div className="text-center" data-testid="feature-reflect">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <UserHead 
                className="w-14 h-14 opacity-70" 
                style={{ color: '#FF6A2E' }}
                strokeWidth={1.5} 
                data-testid="icon-reflect" 
              />
            </div>
            <p className="text-text-secondary text-sm uppercase tracking-wider">Reflect</p>
          </div>
        </div>

        {/* Initialize System Form */}
        <div 
          className="max-w-lg mx-auto rounded-xl p-8 border-2"
          style={{
            background: 'rgba(6, 6, 8, 0.8)',
            borderColor: 'rgba(255, 106, 46, 0.2)',
            boxShadow: '0 0 30px rgba(0, 167, 255, 0.1)'
          }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 glow-text tracking-wider" data-testid="text-form-title">
            Initialize System
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-center tracking-wide"
                style={{ color: '#00A7FF' }}
                data-testid="label-name"
              >
                User Identification
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <User className="w-5 h-5" style={{ color: '#00A7FF' }} />
                </div>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 transition-all duration-300"
                  style={{
                    background: 'rgba(10, 10, 15, 0.5)',
                    borderColor: '#FF6A2E',
                    color: '#E0E6ED'
                  }}
                  placeholder="Enter your name"
                  autoComplete="name"
                  disabled={isLoading}
                  data-testid="input-name"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full font-bold py-4 text-lg tracking-wider transition-all duration-300 transform hover:scale-105 rounded-lg flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0A3D62 0%, #1E5A8E 100%)',
                color: '#00A7FF'
              }}
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  <span>Initializing...</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-5 h-5" />
                  <span>Initialize</span>
                </>
              )}
            </Button>
          </form>
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
