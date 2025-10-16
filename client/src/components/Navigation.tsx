import { Link, useLocation } from "wouter";
import { Home, Hand, MessageCircle, BookOpen } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home", testId: "nav-home" },
    { href: "/grounding", icon: Hand, label: "Ground", testId: "nav-grounding" },
    { href: "/chat", icon: MessageCircle, label: "Chat", testId: "nav-chat" },
    { href: "/resources", icon: BookOpen, label: "Learn", testId: "nav-resources" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border backdrop-blur-md z-40" style={{ background: 'rgba(6, 6, 8, 0.95)' }}>
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ href, icon: Icon, label, testId }) => {
            const isActive = location === href;
            return (
              <Link key={href} href={href}>
                <a 
                  className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
                    isActive 
                      ? "text-electric-cyan" 
                      : "text-text-secondary hover:text-core-blue"
                  }`}
                  data-testid={testId}
                >
                  <Icon 
                    className={`w-6 h-6 transition-all ${isActive ? 'electric-pulse' : ''}`} 
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span className={`text-xs mt-1 font-medium tracking-wide ${isActive ? 'glow-text' : ''}`}>
                    {label}
                  </span>
                  {isActive && (
                    <div 
                      className="h-0.5 w-8 mt-1 rounded-full"
                      style={{ 
                        background: 'var(--electric-cyan)',
                        boxShadow: '0 0 10px var(--electric-cyan)'
                      }}
                    />
                  )}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
