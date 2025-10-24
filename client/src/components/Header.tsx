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


import { Link } from "wouter";
import { useVoiceContext } from "@/contexts/VoiceContext";
import { useUserContext } from "@/contexts/UserContext";
import { useState } from "react";
import { Flame, Mic, MicOff, User, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { toggleVoiceMode, isVoiceModeEnabled, stopSpeaking, isSpeaking } = useVoiceContext();
  const { user, logout } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-primary/20 backdrop-blur-md sticky top-0 z-50 shadow-christman" style={{ background: 'rgba(8, 12, 24, 0.95)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 group cursor-pointer" data-testid="link-home">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-lg opacity-40 rounded-full animate-christman-pulse"></div>
                <Flame className="w-7 h-7 text-primary relative z-10" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 8px #37C8FF)' }} />
              </div>
              <span
                className="font-black text-xl tracking-wider bg-christman-glow bg-clip-text text-transparent transition-all"
                style={{ 
                  fontFamily: 'Orbitron, Rajdhani, sans-serif',
                  textShadow: '0 0 20px rgba(55, 200, 255, 0.3)'
                }}
              >
                THE CHRISTMAN AI PROJECT
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Emergency Stop Button */}
            {isSpeaking && (
              <button
                aria-label="Emergency stop speech"
                className="p-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition-all animate-pulse backdrop-blur-sm border border-red-400/30"
                onClick={stopSpeaking}
                data-testid="button-emergency-stop"
                style={{ 
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                  filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))'
                }}
              >
                🛑
              </button>
            )}

            {/* Voice Mode Toggle */}
            <button
              aria-label="Toggle voice mode"
              className={`p-3 rounded-lg transition-all backdrop-blur-sm border ${
                isVoiceModeEnabled
                  ? 'bg-power-gradient text-iceblue border-primary/30 shadow-christman animate-christman-pulse'
                  : 'text-iceblue/70 hover:bg-indigo/30 hover:text-primary border-primary/20'
              }`}
              onClick={toggleVoiceMode}
              data-testid="button-voice-toggle"
              style={isVoiceModeEnabled ? { 
                filter: 'drop-shadow(0 0 12px #37C8FF)',
                boxShadow: '0 10px 20px rgba(55, 200, 255, 0.4)'
              } : {}}
            >
              {isVoiceModeEnabled ? (
                <Mic className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 6px #B5E6FF)' }} />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>

            {/* Help Icon */}
            <Link href="/help">
              <button
                aria-label="Get help"
                className="p-3 rounded-lg text-iceblue/70 hover:bg-indigo/30 hover:text-highlight transition-all backdrop-blur-sm border border-primary/20"
                data-testid="button-help"
                style={{ filter: 'drop-shadow(0 0 8px rgba(53, 228, 185, 0.3))' }}
              >
                <img 
                  src="/HelpButton.png" 
                  alt="Help" 
                  className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
                />
              </button>
            </Link>

            {/* User Menu */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open user menu"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo/30 transition-all backdrop-blur-sm"
                  data-testid="button-user-menu"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-primary animate-christman-pulse" 
                       style={{ 
                         background: 'rgba(55, 200, 255, 0.1)',
                         boxShadow: '0 0 15px rgba(55, 200, 255, 0.3)'
                       }}>
                    <User className="w-5 h-5 text-primary" style={{ filter: 'drop-shadow(0 0 4px #37C8FF)' }} />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 border-primary/20 shadow-christman"
                style={{ 
                  background: 'rgba(17, 24, 40, 0.95)', 
                  backdropFilter: 'blur(15px)',
                  borderColor: 'rgba(55, 200, 255, 0.2)'
                }}
              >
                <DropdownMenuItem asChild>
                  <Link 
                    href="/profile"
                    className="w-full cursor-pointer text-iceblue hover:text-primary transition-colors"
                    data-testid="menu-profile"
                  >
                    Profile & Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/help"
                    className="w-full cursor-pointer text-iceblue hover:text-highlight transition-colors"
                    data-testid="menu-help"
                  >
                    Help
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
