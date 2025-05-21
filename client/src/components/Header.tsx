import { Link } from "wouter";
import { useVoiceContext } from "@/contexts/VoiceContext";
import { useUserContext } from "@/contexts/UserContext";
import { useState } from "react";
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
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <span className="text-primary-600 text-2xl">🔥</span>
              <span className="font-display font-bold text-xl tracking-tight text-primary-800">Inferno AI</span>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Voice Mode Toggle */}
            <button 
              aria-label="Toggle voice mode" 
              className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 transition"
              onClick={toggleVoiceMode}
            >
              <i className={`fas ${isVoiceModeEnabled ? 'fa-microphone text-primary-600' : 'fa-microphone text-lg'}`}></i>
            </button>
            
            {/* User Menu */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button 
                  aria-label="Open user menu" 
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <i className="fas fa-user-circle"></i>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <a className="w-full cursor-pointer">Profile</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <a className="w-full cursor-pointer">Settings</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">
                    <a className="w-full cursor-pointer">Help</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
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
