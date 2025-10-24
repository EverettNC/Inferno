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


import { Link, useLocation } from "wouter";
import { Home, Hand, UserCircle, Mic2, Heart, GraduationCap, Shield } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home", testId: "nav-home" },
    { href: "/grounding", icon: Hand, label: "Ground", testId: "nav-grounding" },
    { href: "/voice", icon: Mic2, label: "Voice", testId: "nav-voice" },
    { href: "/emotion", icon: Heart, label: "Emotion", testId: "nav-emotion" },
    { href: "/community", icon: Shield, label: "Community", testId: "nav-community" },
    { href: "/training", icon: GraduationCap, label: "Training", testId: "nav-training" },
    { href: "/profile", icon: UserCircle, label: "Profile", testId: "nav-profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-primary/20 backdrop-blur-md z-40 shadow-christman" style={{ background: 'rgba(8, 12, 24, 0.95)' }}>
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ href, icon: Icon, label, testId }) => {
            const isActive = location === href;
            return (
              <Link key={href} href={href}>
                <div 
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? "text-primary animate-christman-pulse" 
                      : "text-iceblue/70 hover:text-highlight"
                  }`}
                  data-testid={testId}
                >
                  <Icon 
                    className={`w-5 h-5 transition-all ${isActive ? 'animate-christman-pulse' : ''}`} 
                    strokeWidth={isActive ? 2 : 1.5}
                    style={isActive ? { filter: 'drop-shadow(0 0 8px #37C8FF)' } : {}}
                  />
                  <span className={`text-xs mt-1 font-medium tracking-wide ${isActive ? 'text-primary' : ''}`}
                        style={isActive ? { textShadow: '0 0 4px #37C8FF' } : {}}>
                    {label}
                  </span>
                  {isActive && (
                    <div 
                      className="h-0.5 w-6 mt-1 rounded-full bg-primary animate-pulse"
                      style={{ 
                        boxShadow: '0 0 10px #37C8FF'
                      }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
