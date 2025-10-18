import { useState } from 'react';
import { useLocation } from 'wouter';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Hand, User as UserHead, User, RotateCw } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-nightstorm-black">
      {/* Atmospheric Background Layers */}
      <div className="absolute inset-0">
        {/* Radial gradient overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 167, 255, 0.08) 0%, rgba(6, 6, 8, 0.9) 50%, #060608 100%)'
          }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full opacity-60"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? '#00A7FF' : i % 3 === 1 ? '#FF6A2E' : '#4A90E2',
                boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
                animation: `float ${Math.random() * 10 + 15}s ease-in-out ${Math.random() * 5}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Flame ember particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`ember-${i}`}
            className="absolute"
            style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: '#FF6A2E',
              boxShadow: '0 0 10px #FF6A2E',
              left: '50%',
              bottom: '-10px',
              animation: `riseUp ${3 + Math.random() * 4}s ease-out ${Math.random() * 3}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10" data-testid="signin-container">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block">
            <h1 
              className="text-6xl md:text-8xl font-black tracking-wider relative"
              style={{ 
                fontFamily: 'Orbitron, Rajdhani, sans-serif',
                color: '#00A7FF',
                textShadow: '0 0 20px rgba(0, 167, 255, 0.8), 0 0 40px rgba(0, 167, 255, 0.4), 0 0 60px rgba(0, 167, 255, 0.2)',
                animation: 'pulseGlow 3s ease-in-out infinite'
              }}
              data-testid="text-app-title"
            >
              INFERNO
            </h1>
            {/* Orange underline with glow */}
            <div 
              className="h-1 w-full mt-3 rounded-full relative"
              style={{ 
                background: 'linear-gradient(90deg, transparent, #FF6A2E, transparent)',
                boxShadow: '0 0 20px #FF6A2E, 0 0 40px rgba(255, 106, 46, 0.5)',
                animation: 'shimmer 2s ease-in-out infinite'
              }}
            />
          </div>
          
          <p 
            className="text-sm md:text-base tracking-widest uppercase"
            style={{
              color: '#7E8C9E',
              textShadow: '0 0 10px rgba(126, 140, 158, 0.3)'
            }}
            data-testid="text-platform-subtitle"
          >
            Trauma-Aware AI Platform
          </p>
          
          <p 
            className="text-lg md:text-xl italic font-light"
            style={{
              color: '#B8C5D6',
              textShadow: '0 0 5px rgba(184, 197, 214, 0.2)'
            }}
            data-testid="text-tagline"
          >
            Out of the fire, we remember who we are.
          </p>
        </div>

        {/* 3D-Style Animated Flame */}
        <div className="flex justify-center my-12 relative">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Flame layers for depth */}
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 w-full h-full"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(255, 106, 46, 0.8)) drop-shadow(0 0 80px rgba(255, 106, 46, 0.4))',
              }}
              data-testid="icon-flame"
            >
              {/* Outer flame - orange */}
              <path
                d="M100,180 Q80,120 100,60 Q120,120 100,180 Z"
                fill="url(#flameGradientOuter)"
                style={{
                  animation: 'flameFlicker 2s ease-in-out infinite',
                  transformOrigin: 'center bottom',
                }}
              />
              {/* Inner flame - yellow/white */}
              <path
                d="M100,160 Q90,120 100,80 Q110,120 100,160 Z"
                fill="url(#flameGradientInner)"
                style={{
                  animation: 'flameFlicker 1.8s ease-in-out 0.2s infinite',
                  transformOrigin: 'center bottom',
                }}
              />
              {/* Core - bright white */}
              <ellipse
                cx="100"
                cy="140"
                rx="12"
                ry="18"
                fill="url(#flameGradientCore)"
                style={{
                  animation: 'flamePulse 1.5s ease-in-out infinite',
                }}
              />
              
              <defs>
                <linearGradient id="flameGradientOuter" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#FF6A2E', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#FF8C42', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#FFB347', stopOpacity: 0.3 }} />
                </linearGradient>
                <linearGradient id="flameGradientInner" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#FFFACD', stopOpacity: 0.5 }} />
                </linearGradient>
                <radialGradient id="flameGradientCore">
                  <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#FFFACD', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 0.3 }} />
                </radialGradient>
              </defs>
            </svg>
            
            {/* Glow ring effect */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 106, 46, 0.3) 0%, transparent 70%)',
                animation: 'ringPulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Ground and Reflect Icons with depth */}
        <div className="flex justify-center gap-32 mb-16">
          <div className="text-center transform transition-all hover:scale-110 hover:-translate-y-2" data-testid="feature-ground">
            <div 
              className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full relative"
              style={{
                background: 'radial-gradient(circle, rgba(255, 106, 46, 0.2) 0%, transparent 70%)',
                boxShadow: '0 0 30px rgba(255, 106, 46, 0.3)',
              }}
            >
              <Hand 
                className="w-16 h-16" 
                style={{ 
                  color: '#FF6A2E',
                  filter: 'drop-shadow(0 0 10px rgba(255, 106, 46, 0.6))',
                }}
                strokeWidth={1.5} 
                data-testid="icon-ground" 
              />
            </div>
            <p 
              className="text-sm uppercase tracking-widest font-medium"
              style={{
                color: '#7E8C9E',
                textShadow: '0 0 10px rgba(255, 106, 46, 0.2)'
              }}
            >
              Ground
            </p>
          </div>
          
          <div className="text-center transform transition-all hover:scale-110 hover:-translate-y-2" data-testid="feature-reflect">
            <div 
              className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full relative"
              style={{
                background: 'radial-gradient(circle, rgba(255, 106, 46, 0.2) 0%, transparent 70%)',
                boxShadow: '0 0 30px rgba(255, 106, 46, 0.3)',
              }}
            >
              <UserHead 
                className="w-16 h-16" 
                style={{ 
                  color: '#FF6A2E',
                  filter: 'drop-shadow(0 0 10px rgba(255, 106, 46, 0.6))',
                }}
                strokeWidth={1.5} 
                data-testid="icon-reflect" 
              />
            </div>
            <p 
              className="text-sm uppercase tracking-widest font-medium"
              style={{
                color: '#7E8C9E',
                textShadow: '0 0 10px rgba(255, 106, 46, 0.2)'
              }}
            >
              Reflect
            </p>
          </div>
        </div>

        {/* Initialize System Form with glassmorphic depth */}
        <div 
          className="max-w-lg mx-auto rounded-2xl p-10 border-2 backdrop-blur-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 6, 8, 0.9) 0%, rgba(10, 10, 15, 0.85) 100%)',
            borderColor: 'rgba(255, 106, 46, 0.3)',
            boxShadow: '0 0 60px rgba(0, 167, 255, 0.15), inset 0 0 60px rgba(0, 167, 255, 0.03)',
          }}
        >
          {/* Inner glow effect */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(0, 167, 255, 0.15) 0%, transparent 60%)',
            }}
          />
          
          <h2 
            className="text-3xl font-bold text-center mb-8 tracking-wider relative z-10"
            style={{
              color: '#00A7FF',
              textShadow: '0 0 20px rgba(0, 167, 255, 0.6)',
            }}
            data-testid="text-form-title"
          >
            Initialize System
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-4">
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-center tracking-widest uppercase"
                style={{ 
                  color: '#00A7FF',
                  textShadow: '0 0 10px rgba(0, 167, 255, 0.4)'
                }}
                data-testid="label-name"
              >
                User Identification
              </label>
              <div className="relative group">
                <div 
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
                  style={{
                    filter: 'drop-shadow(0 0 5px rgba(0, 167, 255, 0.5))',
                  }}
                >
                  <User className="w-6 h-6" style={{ color: '#00A7FF' }} />
                </div>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 text-lg rounded-xl border-2 transition-all duration-300 group-hover:border-electric-cyan focus:border-electric-cyan"
                  style={{
                    background: 'rgba(10, 10, 15, 0.7)',
                    borderColor: '#FF6A2E',
                    color: '#E0E6ED',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 106, 46, 0.2)',
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
              className="w-full font-bold py-5 text-lg tracking-widest uppercase transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-xl flex items-center justify-center gap-3 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #0A3D62 0%, #1E5A8E 50%, #2A6FA8 100%)',
                color: '#00A7FF',
                boxShadow: '0 0 30px rgba(0, 167, 255, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
              }}
              disabled={isLoading}
              data-testid="button-submit"
            >
              {/* Button glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 167, 255, 0.2) 0%, rgba(30, 90, 142, 0.1) 100%)',
                }}
              />
              
              {isLoading ? (
                <>
                  <RotateCw className="w-6 h-6 animate-spin relative z-10" />
                  <span className="relative z-10">Initializing...</span>
                </>
              ) : (
                <>
                  <RotateCw 
                    className="w-6 h-6 relative z-10 group-hover:rotate-180 transition-transform duration-500" 
                    style={{
                      filter: 'drop-shadow(0 0 5px rgba(0, 167, 255, 0.6))',
                    }}
                  />
                  <span className="relative z-10">Initialize</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer with glow */}
        <div className="text-center text-xs space-y-3 mt-12 px-4">
          <p 
            style={{ color: '#7E8C9E' }}
            data-testid="text-disclaimer"
          >
            Inferno AI is a trauma-informed support tool, not a replacement for professional care.
          </p>
          <p 
            className="font-medium"
            style={{ 
              color: '#00A7FF',
              textShadow: '0 0 10px rgba(0, 167, 255, 0.3)'
            }}
            data-testid="text-crisis"
          >
            Crisis? Call 988 (Suicide & Crisis Lifeline) | Text HOME to 741741
          </p>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes float {
          to {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
        }
        
        @keyframes riseUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-600px) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(0, 167, 255, 0.8), 0 0 40px rgba(0, 167, 255, 0.4), 0 0 60px rgba(0, 167, 255, 0.2);
          }
          50% {
            text-shadow: 0 0 30px rgba(0, 167, 255, 1), 0 0 60px rgba(0, 167, 255, 0.6), 0 0 90px rgba(0, 167, 255, 0.3);
          }
        }
        
        @keyframes shimmer {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        @keyframes flameFlicker {
          0%, 100% {
            transform: scaleY(1) scaleX(1);
          }
          25% {
            transform: scaleY(0.95) scaleX(1.05);
          }
          50% {
            transform: scaleY(1.05) scaleX(0.95);
          }
          75% {
            transform: scaleY(0.98) scaleX(1.02);
          }
        }
        
        @keyframes flamePulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        
        @keyframes ringPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
