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


import React, { useState, useEffect } from 'react';
import { VeteransCommunityEngine, SupportCircle, VeteranProfile, SUPPORT_CIRCLES } from '../lib/veteransCommunity';

const VeteransCommunityHub: React.FC = () => {
  const [communityEngine] = useState(() => new VeteransCommunityEngine());
  const [selectedCircle, setSelectedCircle] = useState<SupportCircle | null>(null);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [communityStats, setCommunityStats] = useState(communityEngine.getCommunityStats());
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Update stats periodically
    const interval = setInterval(() => {
      setCommunityStats(communityEngine.getCommunityStats());
    }, 30000);
    return () => clearInterval(interval);
  }, [communityEngine]);

  const handleJoinCircle = (circleId: string) => {
    const success = communityEngine.joinSupportCircle('current-user', circleId);
    if (success) {
      const circle = SUPPORT_CIRCLES.find(c => c.id === circleId);
      setSelectedCircle(circle || null);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCircle) return;
    
    await communityEngine.sendMessage(
      'current-user',
      newMessage,
      selectedCircle.id
    );
    setNewMessage('');
  };

  const CrisisAlert = () => (
    <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-xl border-2 border-red-400 shadow-2xl mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-2xl">🚨</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">CRISIS SUPPORT - YOU ARE NOT ALONE</h3>
          <p className="text-red-100">Immediate help available 24/7/365</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-red-700 p-4 rounded-lg">
          <h4 className="font-bold text-white mb-2">🔴 CALL NOW</h4>
          <p className="text-red-100">Veterans Crisis Line: <strong>988, Press 1</strong></p>
          <p className="text-red-100">Text: <strong>838255</strong></p>
        </div>
        <div className="bg-red-700 p-4 rounded-lg">
          <h4 className="font-bold text-white mb-2">💬 CHAT NOW</h4>
          <p className="text-red-100">Online: veteranscrisisline.net</p>
          <p className="text-red-100">Available in English & Spanish</p>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-white font-semibold">Your service matters. Your life matters. Your battle isn't over. 💪🇺🇸</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-christman-deep-night via-christman-indigo-black to-christman-deep-night">
      {/* Crisis Support Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 p-2">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowCrisisSupport(!showCrisisSupport)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg"
          >
            🚨 NEED CRISIS SUPPORT? CLICK HERE - YOU ARE NOT ALONE 🚨
          </button>
        </div>
      </div>

      <div className="pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          {showCrisisSupport && <CrisisAlert />}
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-christman-electric-cyan to-christman-sky-glow-teal rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-3xl">🎖️</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-christman-electric-cyan via-christman-sky-glow-teal to-christman-neon-ice-blue bg-clip-text text-transparent">
                Veterans Community Hub
              </h1>
            </div>
            <p className="text-2xl text-christman-neon-ice-blue font-medium mb-8">
              A secure, brotherhood-based community where veterans support veterans
            </p>
            
            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-christman-indigo-black/50 backdrop-blur-lg border border-christman-electric-cyan/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-christman-electric-cyan">{communityStats.totalMembers.toLocaleString()}</div>
                <div className="text-christman-neon-ice-blue">Brothers & Sisters</div>
              </div>
              <div className="bg-christman-indigo-black/50 backdrop-blur-lg border border-christman-sky-glow-teal/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-christman-sky-glow-teal">{communityStats.activeCircles}</div>
                <div className="text-christman-neon-ice-blue">Support Circles</div>
              </div>
              <div className="bg-christman-indigo-black/50 backdrop-blur-lg border border-christman-electric-cyan/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-christman-electric-cyan">{communityStats.livesSupported.toLocaleString()}</div>
                <div className="text-christman-neon-ice-blue">Lives Supported</div>
              </div>
              <div className="bg-christman-indigo-black/50 backdrop-blur-lg border border-red-400/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-red-400">{communityStats.crisisInterventions}</div>
                <div className="text-christman-neon-ice-blue">Crisis Saves</div>
              </div>
              <div className="bg-christman-indigo-black/50 backdrop-blur-lg border border-green-400/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400">{communityStats.successStories}</div>
                <div className="text-christman-neon-ice-blue">Victory Stories</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Support Circles List */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-christman-electric-cyan mb-6 flex items-center gap-3">
                <span>🛡️</span> Support Circles
              </h2>
              
              <div className="grid gap-4">
                {SUPPORT_CIRCLES.map((circle) => (
                  <div
                    key={circle.id}
                    className={`bg-christman-indigo-black/50 backdrop-blur-lg border-2 rounded-xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer ${
                      selectedCircle?.id === circle.id
                        ? 'border-christman-electric-cyan shadow-2xl shadow-christman-electric-cyan/20'
                        : 'border-christman-electric-cyan/20 hover:border-christman-sky-glow-teal/50'
                    }`}
                    onClick={() => handleJoinCircle(circle.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-christman-electric-cyan">{circle.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-christman-sky-glow-teal/20 text-christman-sky-glow-teal px-3 py-1 rounded-full text-sm font-semibold">
                          {circle.memberCount} Members
                        </span>
                        {circle.isPrivate && (
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">🔒 Private</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-christman-neon-ice-blue mb-4">{circle.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-christman-sky-glow-teal font-semibold">Category:</span>
                      <span className="bg-christman-sky-glow-teal/10 text-christman-sky-glow-teal px-2 py-1 rounded-lg text-sm">
                        {circle.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {circle.supportProtocols.map((protocol, idx) => (
                        <span 
                          key={idx}
                          className="bg-christman-electric-cyan/10 text-christman-electric-cyan px-2 py-1 rounded-lg text-xs"
                        >
                          {protocol}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-1">
              <div className="bg-christman-indigo-black/50 backdrop-blur-lg border border-christman-electric-cyan/20 rounded-xl p-6 sticky top-24">
                {selectedCircle ? (
                  <>
                    <h3 className="text-xl font-bold text-christman-electric-cyan mb-4 flex items-center gap-2">
                      <span>💬</span> {selectedCircle.name}
                    </h3>
                    
                    {/* Message Area */}
                    <div className="h-64 bg-christman-deep-night/50 rounded-lg p-4 mb-4 overflow-y-auto">
                      <div className="text-center text-christman-neon-ice-blue/70 py-8">
                        <p>🛡️ Secure, encrypted messaging</p>
                        <p className="text-sm mt-2">Messages are protected and monitored for crisis intervention</p>
                      </div>
                    </div>
                    
                    {/* Message Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Share with your brothers and sisters..."
                        className="flex-1 bg-christman-deep-night border border-christman-electric-cyan/30 rounded-lg px-4 py-2 text-christman-neon-ice-blue focus:outline-none focus:border-christman-electric-cyan"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-christman-electric-cyan to-christman-sky-glow-teal text-christman-deep-night px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">🎖️</span>
                    <h3 className="text-xl font-bold text-christman-electric-cyan mb-2">Choose Your Circle</h3>
                    <p className="text-christman-neon-ice-blue">Select a support circle to join the conversation</p>
                  </div>
                )}
              </div>

              {/* Quick Resources */}
              <div className="bg-christman-indigo-black/50 backdrop-blur-lg border border-christman-sky-glow-teal/20 rounded-xl p-6 mt-6">
                <h3 className="text-xl font-bold text-christman-sky-glow-teal mb-4 flex items-center gap-2">
                  <span>📚</span> Quick Resources
                </h3>
                
                <div className="space-y-3">
                  <a 
                    href="tel:988"
                    className="block bg-red-600/20 border border-red-400/30 rounded-lg p-3 hover:bg-red-600/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-red-400">🚨</span>
                      <div>
                        <div className="font-semibold text-red-400">Crisis Line: 988, Press 1</div>
                        <div className="text-sm text-red-200">24/7 Veterans Crisis Support</div>
                      </div>
                    </div>
                  </a>
                  
                  <a 
                    href="https://www.va.gov/find-locations/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-christman-electric-cyan/10 border border-christman-electric-cyan/30 rounded-lg p-3 hover:bg-christman-electric-cyan/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-christman-electric-cyan">🏥</span>
                      <div>
                        <div className="font-semibold text-christman-electric-cyan">Find VA Services</div>
                        <div className="text-sm text-christman-neon-ice-blue">Locate nearby VA facilities</div>
                      </div>
                    </div>
                  </a>
                  
                  <a 
                    href="https://www.ebenefits.va.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-christman-sky-glow-teal/10 border border-christman-sky-glow-teal/30 rounded-lg p-3 hover:bg-christman-sky-glow-teal/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-christman-sky-glow-teal">💼</span>
                      <div>
                        <div className="font-semibold text-christman-sky-glow-teal">VA Benefits</div>
                        <div className="text-sm text-christman-neon-ice-blue">Access your benefits online</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeteransCommunityHub;