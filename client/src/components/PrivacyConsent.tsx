import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Shield, Lock, Eye, Heart } from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";

export default function PrivacyConsent() {
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [, navigate] = useLocation();
  const { user } = useUserContext();
  
  useEffect(() => {
    // CRITICAL FIX: Always show privacy modal BEFORE sign-in
    // Use sessionStorage (NOT localStorage) so it clears when tab closes
    // This ensures the modal ALWAYS shows on fresh visits, even for returning users
    if (!user) {
      const privacyAcceptedThisSession = sessionStorage.getItem("privacyAcceptedThisSession");
      if (!privacyAcceptedThisSession) {
        setShowPrivacyDialog(true);
      }
    } else {
      // User is logged in, they've already seen the privacy modal
      setShowPrivacyDialog(false);
    }
  }, [user]);
  
  const handleAcceptPrivacy = () => {
    // Use sessionStorage (NOT localStorage) so flag only lasts for current tab/session
    // This flag is ONLY valid until the tab is closed
    sessionStorage.setItem("privacyAcceptedThisSession", "true");
    setShowPrivacyDialog(false);
    
    // If user is not logged in, redirect to sign-in page
    if (!user) {
      navigate('/signin');
    }
  };
  
  if (!showPrivacyDialog) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: 'rgba(6, 6, 8, 0.98)',
        backdropFilter: 'blur(10px)',
      }}
      data-testid="privacy-modal-overlay"
    >
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 167, 255, 0.1) 0%, transparent 70%)'
          }}
        />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`privacy-particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#00A7FF' : '#FF6A2E',
              boxShadow: `0 0 ${Math.random() * 15 + 5}px currentColor`,
              animation: `privacyFloat ${Math.random() * 8 + 10}s ease-in-out ${Math.random() * 3}s infinite alternate`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Privacy Modal Content */}
      <div 
        className="relative max-w-2xl w-full rounded-2xl border-2 p-8 md:p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 6, 8, 0.95) 0%, rgba(10, 10, 15, 0.9) 100%)',
          borderColor: 'rgba(0, 167, 255, 0.4)',
          boxShadow: '0 0 80px rgba(0, 167, 255, 0.2), inset 0 0 60px rgba(0, 167, 255, 0.05)',
        }}
        data-testid="privacy-modal-content"
      >
        {/* Top glow effect */}
        <div 
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(0, 167, 255, 0.2) 0%, transparent 70%)',
          }}
        />

        {/* Shield icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="relative w-20 h-20 flex items-center justify-center rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 167, 255, 0.2) 0%, transparent 70%)',
              boxShadow: '0 0 40px rgba(0, 167, 255, 0.3)',
            }}
          >
            <Shield 
              className="w-12 h-12" 
              style={{ 
                color: '#00A7FF',
                filter: 'drop-shadow(0 0 10px rgba(0, 167, 255, 0.6))',
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-wide"
          style={{
            color: '#00A7FF',
            textShadow: '0 0 20px rgba(0, 167, 255, 0.6)',
            fontFamily: 'Orbitron, Rajdhani, sans-serif',
          }}
          data-testid="privacy-modal-title"
        >
          Your Privacy Matters
        </h2>
        
        {/* Subtitle */}
        <p 
          className="text-center mb-8 text-base md:text-lg"
          style={{ color: '#B8C5D6' }}
        >
          Inferno AI is built with your privacy and safety as our highest priorities.
        </p>

        {/* Privacy points */}
        <ul className="space-y-5 mb-8">
          <li className="flex items-start group">
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5"
              style={{
                background: 'rgba(0, 167, 255, 0.15)',
                boxShadow: '0 0 15px rgba(0, 167, 255, 0.2)',
              }}
            >
              <Lock className="w-4 h-4" style={{ color: '#00A7FF' }} />
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#E0E6ED' }}>
                Your Data Stays Private
              </strong>
              <p className="text-sm" style={{ color: '#7E8C9E' }}>
                Most personal information is stored locally on your device. We never sell your data.
              </p>
            </div>
          </li>
          
          <li className="flex items-start group">
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5"
              style={{
                background: 'rgba(0, 167, 255, 0.15)',
                boxShadow: '0 0 15px rgba(0, 167, 255, 0.2)',
              }}
            >
              <Eye className="w-4 h-4" style={{ color: '#00A7FF' }} />
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#E0E6ED' }}>
                Full Transparency
              </strong>
              <p className="text-sm" style={{ color: '#7E8C9E' }}>
                Anonymous usage analytics help us improve, but never include your personal content or conversations.
              </p>
            </div>
          </li>
          
          <li className="flex items-start group">
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5"
              style={{
                background: 'rgba(0, 167, 255, 0.15)',
                boxShadow: '0 0 15px rgba(0, 167, 255, 0.2)',
              }}
            >
              <Heart className="w-4 h-4" style={{ color: '#00A7FF' }} />
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#E0E6ED' }}>
                Trauma-Informed Design
              </strong>
              <p className="text-sm" style={{ color: '#7E8C9E' }}>
                Every feature is designed with trauma survivors in mind. Your safety and autonomy are paramount.
              </p>
            </div>
          </li>
          
          <li className="flex items-start group">
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5"
              style={{
                background: 'rgba(0, 167, 255, 0.15)',
                boxShadow: '0 0 15px rgba(0, 167, 255, 0.2)',
              }}
            >
              <Check className="w-4 h-4" style={{ color: '#00A7FF' }} />
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#E0E6ED' }}>
                No Medical Data Stored
              </strong>
              <p className="text-sm" style={{ color: '#7E8C9E' }}>
                Inferno AI is a support tool, not a medical device. We don't store sensitive medical information.
              </p>
            </div>
          </li>
        </ul>

        {/* Important notice */}
        <div 
          className="mb-8 p-4 rounded-xl border"
          style={{
            background: 'rgba(255, 106, 46, 0.1)',
            borderColor: 'rgba(255, 106, 46, 0.3)',
          }}
        >
          <p className="text-sm" style={{ color: '#E0E6ED' }}>
            <strong style={{ color: '#FF6A2E' }}>Important:</strong> Inferno AI is not a replacement for professional mental health care. 
            In a crisis, please contact emergency services or call <strong>988</strong> (Suicide & Crisis Lifeline).
          </p>
        </div>

        {/* Action button */}
        <Button
          onClick={handleAcceptPrivacy}
          className="w-full font-bold py-5 text-lg tracking-widest uppercase transition-all duration-300 transform hover:scale-105 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #0A3D62 0%, #1E5A8E 50%, #2A6FA8 100%)',
            color: '#00A7FF',
            boxShadow: '0 0 40px rgba(0, 167, 255, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
          }}
          data-testid="button-accept-privacy"
        >
          {/* Button glow on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 167, 255, 0.3) 0%, rgba(30, 90, 142, 0.1) 100%)',
            }}
          />
          
          <Check 
            className="w-6 h-6 relative z-10" 
            style={{
              filter: 'drop-shadow(0 0 5px rgba(0, 167, 255, 0.6))',
            }}
          />
          <span className="relative z-10">I Understand & Accept</span>
        </Button>

        {/* Learn More link */}
        <div className="text-center mt-6">
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors hover:underline"
            style={{ color: '#7E8C9E' }}
            data-testid="link-privacy-policy"
          >
            Read Full Privacy Policy →
          </a>
        </div>
      </div>

      {/* Inline animations */}
      <style>{`
        @keyframes privacyFloat {
          to {
            transform: translateY(-15px) translateX(8px);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
