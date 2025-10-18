import { Link } from "wouter";
import { useVoiceContext } from "@/contexts/VoiceContext";
import { useUserContext } from "@/contexts/UserContext";
import { useState } from "react";
import { Flame, Mic, MicOff, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { toggleVoiceMode, isVoiceModeEnabled } = useVoiceContext();
  const { user } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border backdrop-blur-md sticky top-0 z-50" style={{ background: 'rgba(6, 6, 8, 0.9)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 group cursor-pointer" data-testid="link-home">
              <Flame className="w-7 h-7 fire-glow" strokeWidth={1.5} />
              <span 
                className="font-black text-xl tracking-wider glow-text transition-all" 
                style={{ fontFamily: 'Orbitron, Rajdhani, sans-serif' }}
              >
                INFERNO
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Voice Mode Toggle */}
            <button 
              aria-label="Toggle voice mode" 
              className={`p-3 rounded-lg transition-all ${
                isVoiceModeEnabled 
                  ? 'bg-button-bg text-text-glow' 
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-electric-cyan'
              }`}
              onClick={toggleVoiceMode}
              data-testid="button-voice-toggle"
            >
              {isVoiceModeEnabled ? (
                <Mic className="w-5 h-5 electric-pulse" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>
            
            {/* User Menu */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button 
                  aria-label="Open user menu" 
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-bg-tertiary transition-all"
                  data-testid="button-user-menu"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-electric-cyan" style={{ background: 'rgba(0, 214, 255, 0.1)' }}>
                    <User className="w-5 h-5 text-electric-cyan" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-48 border-border" 
                style={{ background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(10px)' }}
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <a className="w-full cursor-pointer text-text-primary hover:text-electric-cyan">Profile</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <a className="w-full cursor-pointer text-text-primary hover:text-electric-cyan">Settings</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">
                    <a className="w-full cursor-pointer text-text-primary hover:text-electric-cyan">Help</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="cursor-pointer text-flame-orange hover:text-button-accent">
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
