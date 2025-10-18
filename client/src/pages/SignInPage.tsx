import { useState } from 'react';
import { useLocation } from 'wouter';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Hand, User as UserHead, User, RotateCw } from 'lucide-react';
import flameImage from '@assets/generated_images/Sacred_glowing_flame_icon_26de170a.png';
import atmosphericBg from '@assets/generated_images/Atmospheric_dark_background_particles_9ac07821.png';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Atmospheric Background with Professional Generated Image */}
      <div 
        className="absolute inset-0"
        style={{
          background: '#060608',
        }}
      >
        {/* Generated atmospheric background layer */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${atmosphericBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Additional depth gradient overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(6, 6, 8, 0.3) 50%, rgba(6, 6, 8, 0.7) 100%)'
          }}
        />
        
        {/* Subtle animated particles for depth */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? '#00A7FF' : '#FF6A2E',
                boxShadow: `0 0 ${Math.random() * 15 + 8}px currentColor`,
                animation: `floatGentle ${Math.random() * 15 + 20}s ease-in-out ${Math.random() * 5}s infinite alternate`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        {/* Warm ember particles rising from flame */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`ember-${i}`}
            className="absolute"
            style={{
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              background: '#FF6A2E',
              boxShadow: '0 0 8px #FF6A2E',
              left: `calc(50% + ${Math.random() * 60 - 30}px)`,
              bottom: '-10px',
              animation: `riseEmber ${4 + Math.random() * 5}s ease-out ${Math.random() * 4}s infinite`,
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
                textShadow: '0 0 25px rgba(0, 167, 255, 0.9), 0 0 50px rgba(0, 167, 255, 0.5), 0 0 75px rgba(0, 167, 255, 0.2)',
                animation: 'titleGlow 4s ease-in-out infinite'
              }}
              data-testid="text-app-title"
            >
              INFERNO
            </h1>
            {/* Orange underline with sacred glow */}
            <div 
              className="h-1 w-full mt-4 rounded-full relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(90deg, transparent, #FF6A2E 30%, #FF8C42 50%, #FF6A2E 70%, transparent)',
                boxShadow: '0 0 25px rgba(255, 106, 46, 0.8), 0 0 50px rgba(255, 106, 46, 0.3)',
                animation: 'lineShimmer 3s ease-in-out infinite'
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'sweep 3s ease-in-out infinite',
                }}
              />
            </div>
          </div>
          
          <p 
            className="text-sm md:text-base tracking-widest uppercase font-light mt-6"
            style={{
              color: '#7E8C9E',
              letterSpacing: '0.3em',
            }}
            data-testid="text-platform-subtitle"
          >
            Trauma-Aware AI Platform
          </p>
          
          <p 
            className="text-lg md:text-xl italic font-light mt-4"
            style={{
              color: '#B8C5D6',
              fontFamily: 'Georgia, serif',
            }}
            data-testid="text-tagline"
          >
            Out of the fire, we remember who we are.
          </p>
        </div>

        {/* Sacred Flame - Professional Generated Image */}
        <div className="flex justify-center my-16 relative">
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
            {/* Outer glow rings for depth */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 106, 46, 0.15) 0%, transparent 70%)',
                animation: 'flameRing1 3s ease-in-out infinite',
                transformOrigin: 'center',
              }}
            />
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 140, 66, 0.1) 0%, transparent 60%)',
                animation: 'flameRing2 4s ease-in-out 0.5s infinite',
                transformOrigin: 'center',
              }}
            />
            
            {/* Professional Flame Image */}
            <img
              src={flameImage}
              alt="Sacred Flame"
              className="relative z-10 w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(255, 106, 46, 0.6)) drop-shadow(0 0 80px rgba(255, 140, 66, 0.3))',
                animation: 'flameFloat 4s ease-in-out infinite',
              }}
              data-testid="icon-flame"
            />
            
            {/* Warm ambient glow beneath */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 rounded-full opacity-40"
              style={{
                background: 'radial-gradient(ellipse, rgba(255, 106, 46, 0.4) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          </div>
        </div>

        {/* Ground and Reflect Icons with Sacred Depth */}
        <div className="flex justify-center gap-32 mb-16">
          <div 
            className="text-center transform transition-all duration-500 hover:scale-110 hover:-translate-y-3 cursor-pointer group" 
            data-testid="feature-ground"
          >
            <div 
              className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full relative"
              style={{
                background: 'radial-gradient(circle, rgba(255, 106, 46, 0.15) 0%, transparent 70%)',
                boxShadow: '0 0 30px rgba(255, 106, 46, 0.2), inset 0 0 20px rgba(255, 106, 46, 0.1)',
              }}
            >
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 106, 46, 0.3) 0%, transparent 70%)',
                  animation: 'iconPulse 2s ease-in-out infinite',
                }}
              />
              <Hand 
                className="w-16 h-16 relative z-10" 
                style={{ 
                  color: '#FF6A2E',
                  filter: 'drop-shadow(0 0 12px rgba(255, 106, 46, 0.7))',
                }}
                strokeWidth={1.2} 
                data-testid="icon-ground" 
              />
            </div>
            <p 
              className="text-sm uppercase tracking-widest font-medium"
              style={{
                color: '#7E8C9E',
                letterSpacing: '0.2em',
              }}
            >
              Ground
            </p>
          </div>
          
          <div 
            className="text-center transform transition-all duration-500 hover:scale-110 hover:-translate-y-3 cursor-pointer group" 
            data-testid="feature-reflect"
          >
            <div 
              className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full relative"
              style={{
                background: 'radial-gradient(circle, rgba(255, 106, 46, 0.15) 0%, transparent 70%)',
                boxShadow: '0 0 30px rgba(255, 106, 46, 0.2), inset 0 0 20px rgba(255, 106, 46, 0.1)',
              }}
            >
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 106, 46, 0.3) 0%, transparent 70%)',
                  animation: 'iconPulse 2s ease-in-out infinite',
                }}
              />
              <UserHead 
                className="w-16 h-16 relative z-10" 
                style={{ 
                  color: '#FF6A2E',
                  filter: 'drop-shadow(0 0 12px rgba(255, 106, 46, 0.7))',
                }}
                strokeWidth={1.2} 
                data-testid="icon-reflect" 
              />
            </div>
            <p 
              className="text-sm uppercase tracking-widest font-medium"
              style={{
                color: '#7E8C9E',
                letterSpacing: '0.2em',
              }}
            >
              Reflect
            </p>
          </div>
        </div>

        {/* Initialize System Form - Sacred Container */}
        <div 
          className="max-w-lg mx-auto rounded-2xl p-10 md:p-12 border backdrop-blur-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 6, 8, 0.95) 0%, rgba(15, 15, 20, 0.9) 100%)',
            borderWidth: '2px',
            borderImage: 'linear-gradient(135deg, rgba(0, 167, 255, 0.4), rgba(255, 106, 46, 0.2)) 1',
            boxShadow: '0 0 60px rgba(0, 167, 255, 0.15), 0 0 100px rgba(255, 106, 46, 0.08), inset 0 0 40px rgba(0, 167, 255, 0.03)',
          }}
        >
          {/* Top inner glow */}
          <div 
            className="absolute inset-x-0 top-0 h-40 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(0, 167, 255, 0.15) 0%, transparent 70%)',
            }}
          />
          
          {/* Bottom warm glow */}
          <div 
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at bottom, rgba(255, 106, 46, 0.08) 0%, transparent 70%)',
            }}
          />

          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wide relative z-10"
            style={{
              color: '#00A7FF',
              textShadow: '0 0 20px rgba(0, 167, 255, 0.7), 0 0 40px rgba(0, 167, 255, 0.3)',
              fontFamily: 'Orbitron, Rajdhani, sans-serif',
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
                  letterSpacing: '0.2em',
                  textShadow: '0 0 10px rgba(0, 167, 255, 0.4)'
                }}
                data-testid="label-name"
              >
                User Identification
              </label>
              <div className="relative group">
                <div 
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(0, 167, 255, 0.6))',
                  }}
                >
                  <User className="w-6 h-6" style={{ color: '#00A7FF' }} />
                </div>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-5 py-6 text-lg rounded-xl border-2 transition-all duration-300 focus:scale-[1.02]"
                  style={{
                    background: 'rgba(10, 10, 15, 0.8)',
                    borderColor: '#FF6A2E',
                    color: '#E0E6ED',
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 106, 46, 0.15)',
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
              className="w-full font-bold py-6 text-lg tracking-widest uppercase transition-all duration-500 transform hover:scale-105 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #0A3D62 0%, #1E5A8E 40%, #2A6FA8 80%, #3D82BD 100%)',
                color: '#00A7FF',
                boxShadow: '0 0 40px rgba(0, 167, 255, 0.4), 0 5px 20px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.15)',
              }}
              disabled={isLoading}
              data-testid="button-submit"
            >
              {/* Animated shimmer overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, transparent, rgba(0, 167, 255, 0.2), transparent)',
                  animation: 'buttonShimmer 2s ease-in-out infinite',
                }}
              />
              
              {/* Glow pulse on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at center, rgba(0, 167, 255, 0.3) 0%, transparent 70%)',
                  animation: 'buttonPulse 1.5s ease-in-out infinite',
                }}
              />
              
              {isLoading ? (
                <>
                  <RotateCw 
                    className="w-6 h-6 animate-spin relative z-10" 
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(0, 167, 255, 0.8))',
                    }}
                  />
                  <span className="relative z-10">Initializing...</span>
                </>
              ) : (
                <>
                  <RotateCw 
                    className="w-6 h-6 relative z-10 group-hover:rotate-180 transition-transform duration-700" 
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(0, 167, 255, 0.8))',
                    }}
                  />
                  <span className="relative z-10">Initialize</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer with Sacred Care */}
        <div className="text-center text-xs space-y-3 mt-12 px-4">
          <p 
            className="leading-relaxed"
            style={{ color: '#7E8C9E' }}
            data-testid="text-disclaimer"
          >
            Inferno AI is a trauma-informed support tool, not a replacement for professional care.
          </p>
          <p 
            className="font-medium leading-relaxed"
            style={{ 
              color: '#00A7FF',
              textShadow: '0 0 10px rgba(0, 167, 255, 0.3)'
            }}
            data-testid="text-crisis"
          >
            Crisis? Call <strong>988</strong> (Suicide & Crisis Lifeline) | Text <strong>HOME</strong> to <strong>741741</strong>
          </p>
        </div>
      </div>

      {/* Sacred Animations */}
      <style>{`
        @keyframes floatGentle {
          to {
            transform: translateY(-18px) translateX(10px);
            opacity: 0.15;
          }
        }
        
        @keyframes riseEmber {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-700px) translateX(${Math.random() * 80 - 40}px) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes titleGlow {
          0%, 100% {
            text-shadow: 0 0 25px rgba(0, 167, 255, 0.9), 0 0 50px rgba(0, 167, 255, 0.5), 0 0 75px rgba(0, 167, 255, 0.2);
          }
          50% {
            text-shadow: 0 0 35px rgba(0, 167, 255, 1), 0 0 70px rgba(0, 167, 255, 0.7), 0 0 105px rgba(0, 167, 255, 0.3);
          }
        }
        
        @keyframes lineShimmer {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        
        @keyframes flameFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }
        
        @keyframes flameRing1 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.3;
          }
        }
        
        @keyframes flameRing2 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
        }
        
        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes buttonShimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
