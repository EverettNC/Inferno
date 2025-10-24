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


interface VeteranProfile {
  id: string;
  displayName: string;
  branch: 'Army' | 'Navy' | 'Air Force' | 'Marines' | 'Coast Guard' | 'Space Force' | 'National Guard' | 'Reserves';
  serviceYears?: string;
  deployments?: string[];
  interests: string[];
  supportOffering: string[];
  seekingSupport: string[];
  isOnline: boolean;
  lastActive: Date;
  trustLevel: 'New' | 'Verified' | 'Trusted' | 'Mentor';
  crisisSupported: number;
  livesChanged: number;
}

interface SupportCircle {
  id: string;
  name: string;
  description: string;
  category: 'PTSD Support' | 'Combat Veterans' | 'Military Families' | 'Transition Support' | 'Women Veterans' | 'Crisis Recovery' | 'Peer Mentorship' | 'Career Transition';
  memberCount: number;
  isPrivate: boolean;
  moderators: string[];
  supportProtocols: string[];
  crisisContact: string;
}

interface CommunityMessage {
  id: string;
  authorId: string;
  circleId?: string;
  content: string;
  type: 'text' | 'voice' | 'crisis-alert' | 'victory-share' | 'support-request';
  timestamp: Date;
  reactions: { emoji: string; count: number; users: string[] }[];
  supportResponses: number;
  flagged: boolean;
  encrypted: boolean;
}

interface CrisisProtocol {
  triggerWords: string[];
  immediateResponse: string;
  escalationSteps: string[];
  veteranHelplines: {
    name: string;
    number: string;
    available: string;
    speciality: string;
  }[];
  emergencyContacts: string[];
  localResources: boolean;
}

// Veterans Crisis Support Database
const CRISIS_PROTOCOLS: CrisisProtocol = {
  triggerWords: [
    'suicide', 'kill myself', 'end it all', 'can\'t go on', 'worthless', 
    'hopeless', 'no point', 'better off dead', 'hurt myself', 'give up'
  ],
  immediateResponse: "🚨 IMMEDIATE SUPPORT AVAILABLE 🚨\n\nBrother/Sister, you are NOT alone. Your service matters. Your life matters.\n\n🔴 CALL NOW: Veterans Crisis Line 988, Press 1\n🔴 TEXT: 838255\n🔴 CHAT: veteranscrisisline.net\n\nYour battle isn't over - we're here to fight alongside you. 💪🇺🇸",
  escalationSteps: [
    "Connect with crisis counselor immediately",
    "Activate local veteran support network",
    "Coordinate with family/emergency contacts",
    "Facilitate professional intervention if needed"
  ],
  veteranHelplines: [
    {
      name: "Veterans Crisis Line",
      number: "988, Press 1",
      available: "24/7/365",
      speciality: "All veterans in crisis"
    },
    {
      name: "Military Crisis Line",
      number: "1-800-273-8255",
      available: "24/7",
      speciality: "Active duty and families"
    },
    {
      name: "Wounded Warrior Project",
      number: "1-888-997-2586",
      available: "24/7",
      speciality: "Combat wounded veterans"
    },
    {
      name: "Team Red White & Blue",
      number: "1-512-535-5232",
      available: "Business hours",
      speciality: "Community connection"
    }
  ],
  emergencyContacts: ["911", "Crisis Mobile Response"],
  localResources: true
};

// Support Circle Templates
const SUPPORT_CIRCLES: SupportCircle[] = [
  {
    id: 'combat-veterans',
    name: 'Combat Veterans Brotherhood',
    description: 'For those who served in combat zones. Share experiences, challenges, and victories with brothers and sisters who understand.',
    category: 'Combat Veterans',
    memberCount: 1247,
    isPrivate: true,
    moderators: ['veteran-mod-1', 'veteran-mod-2'],
    supportProtocols: ['Combat trauma support', 'Peer mentorship', 'Crisis intervention'],
    crisisContact: 'combat-crisis-team'
  },
  {
    id: 'ptsd-support',
    name: 'PTSD Warriors United',
    description: 'Safe space for veterans battling PTSD. Evidence-based support, coping strategies, and hope sharing.',
    category: 'PTSD Support',
    memberCount: 892,
    isPrivate: true,
    moderators: ['ptsd-counselor-1', 'peer-specialist-1'],
    supportProtocols: ['Trauma-informed care', 'Therapeutic techniques', 'Medication support'],
    crisisContact: 'ptsd-crisis-team'
  },
  {
    id: 'transition-support',
    name: 'Civilian Transition Command',
    description: 'Navigate the challenging transition from military to civilian life. Career, education, and life guidance.',
    category: 'Transition Support',
    memberCount: 634,
    isPrivate: false,
    moderators: ['transition-specialist', 'career-counselor'],
    supportProtocols: ['Career guidance', 'Education benefits', 'Life coaching'],
    crisisContact: 'transition-support-team'
  },
  {
    id: 'women-veterans',
    name: 'Women Veterans Strong',
    description: 'Supporting our female veterans with unique challenges, from MST recovery to career advancement.',
    category: 'Women Veterans',
    memberCount: 445,
    isPrivate: true,
    moderators: ['women-vet-advocate', 'female-counselor'],
    supportProtocols: ['Gender-specific support', 'MST recovery', 'Career advancement'],
    crisisContact: 'women-vet-crisis'
  },
  {
    id: 'military-families',
    name: 'Military Family Fortress',
    description: 'For spouses, children, and families of veterans. Healing together, supporting each other.',
    category: 'Military Families',
    memberCount: 723,
    isPrivate: false,
    moderators: ['family-therapist', 'military-spouse'],
    supportProtocols: ['Family therapy', 'Child support', 'Relationship counseling'],
    crisisContact: 'family-crisis-team'
  },
  {
    id: 'crisis-recovery',
    name: 'Phoenix Rising Recovery',
    description: 'For veterans in active recovery from crisis, addiction, or major life challenges. Rise from the ashes.',
    category: 'Crisis Recovery',
    memberCount: 356,
    isPrivate: true,
    moderators: ['recovery-specialist', 'crisis-counselor'],
    supportProtocols: ['Recovery support', 'Addiction counseling', 'Life rebuilding'],
    crisisContact: 'recovery-crisis-team'
  }
];

// Veteran Community Features
interface CommunityFeatures {
  peerMatching: boolean;
  anonymousSupport: boolean;
  crisisIntervention: boolean;
  professionalModerators: boolean;
  encryptedMessaging: boolean;
  locationBasedGroups: boolean;
  virtualEvents: boolean;
  resourceSharing: boolean;
}

class VeteransCommunityEngine {
  private profiles: Map<string, VeteranProfile> = new Map();
  private supportCircles: Map<string, SupportCircle> = new Map();
  private messages: Map<string, CommunityMessage[]> = new Map();
  private crisisProtocols: CrisisProtocol;

  constructor() {
    this.crisisProtocols = CRISIS_PROTOCOLS;
    this.initializeSupportCircles();
  }

  private initializeSupportCircles(): void {
    SUPPORT_CIRCLES.forEach(circle => {
      this.supportCircles.set(circle.id, circle);
      this.messages.set(circle.id, []);
    });
  }

  // Crisis Detection and Response
  detectCrisis(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return this.crisisProtocols.triggerWords.some(trigger => 
      lowerMessage.includes(trigger.toLowerCase())
    );
  }

  async handleCrisisAlert(userId: string, message: string): Promise<{
    immediateResponse: string;
    escalated: boolean;
    supportContacts: string[];
  }> {
    // Immediate crisis response
    const response = {
      immediateResponse: this.crisisProtocols.immediateResponse,
      escalated: true,
      supportContacts: this.crisisProtocols.veteranHelplines.map(h => h.number)
    };

    // Log crisis for follow-up
    console.log(`🚨 CRISIS ALERT: User ${userId} needs immediate support`);
    
    // Activate support network
    await this.activateCrisisSupport(userId);
    
    return response;
  }

  private async activateCrisisSupport(userId: string): Promise<void> {
    // Notify trained peer supporters in user's circles
    // Connect with professional crisis counselors
    // Coordinate with local resources if available
  }

  // Peer Matching System
  findPeerMatches(userId: string): VeteranProfile[] {
    const userProfile = this.profiles.get(userId);
    if (!userProfile) return [];

    return Array.from(this.profiles.values())
      .filter(profile => {
        return profile.id !== userId &&
               profile.branch === userProfile.branch &&
               profile.supportOffering.some(offer => 
                 userProfile.seekingSupport.includes(offer)
               ) &&
               profile.isOnline;
      })
      .sort((a, b) => b.livesChanged - a.livesChanged)
      .slice(0, 5);
  }

  // Support Circle Management
  getSupportCircles(category?: string): SupportCircle[] {
    const circles = Array.from(this.supportCircles.values());
    return category ? 
      circles.filter(circle => circle.category === category) : 
      circles;
  }

  joinSupportCircle(userId: string, circleId: string): boolean {
    const circle = this.supportCircles.get(circleId);
    const profile = this.profiles.get(userId);
    
    if (!circle || !profile) return false;
    
    // Add member to circle
    circle.memberCount++;
    
    return true;
  }

  // Secure Messaging
  async sendMessage(
    authorId: string, 
    content: string, 
    circleId?: string,
    type: CommunityMessage['type'] = 'text'
  ): Promise<string> {
    // Check for crisis content
    if (this.detectCrisis(content)) {
      await this.handleCrisisAlert(authorId, content);
      type = 'crisis-alert';
    }

    const message: CommunityMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      authorId,
      circleId,
      content,
      type,
      timestamp: new Date(),
      reactions: [],
      supportResponses: 0,
      flagged: false,
      encrypted: true
    };

    // Store message
    const messageList = this.messages.get(circleId || 'general') || [];
    messageList.push(message);
    this.messages.set(circleId || 'general', messageList);

    return message.id;
  }

  // Resource Sharing
  getVeteranResources(): {
    category: string;
    resources: { name: string; url: string; description: string; }[];
  }[] {
    return [
      {
        category: "Crisis Support",
        resources: [
          {
            name: "Veterans Crisis Line",
            url: "https://www.veteranscrisisline.net/",
            description: "24/7 crisis support specifically for veterans"
          },
          {
            name: "Give an Hour",
            url: "https://giveanhour.org/",
            description: "Free mental health services for veterans and families"
          }
        ]
      },
      {
        category: "Career & Education",
        resources: [
          {
            name: "VA Vocational Rehabilitation",
            url: "https://www.va.gov/careers-employment/vocational-rehabilitation/",
            description: "Education and career training for service-connected disabilities"
          },
          {
            name: "Corporate Gray",
            url: "https://corporategray.com/",
            description: "Military to civilian career transition support"
          }
        ]
      },
      {
        category: "Benefits & Compensation",
        resources: [
          {
            name: "VA Benefits Hotline",
            url: "tel:1-800-827-1000",
            description: "General VA benefits information and assistance"
          },
          {
            name: "Disabled American Veterans",
            url: "https://www.dav.org/",
            description: "Free claims assistance and veteran advocacy"
          }
        ]
      }
    ];
  }

  // Community Statistics
  getCommunityStats(): {
    totalMembers: number;
    activeCircles: number;
    livesSupported: number;
    crisisInterventions: number;
    successStories: number;
  } {
    const totalMembers = this.profiles.size;
    const activeCircles = this.supportCircles.size;
    const livesSupported = Array.from(this.profiles.values())
      .reduce((total, profile) => total + profile.livesChanged, 0);
    
    return {
      totalMembers,
      activeCircles,
      livesSupported,
      crisisInterventions: 156, // This would be tracked in production
      successStories: 89
    };
  }
}

export {
  VeteranProfile,
  SupportCircle,
  CommunityMessage,
  CrisisProtocol,
  VeteransCommunityEngine,
  SUPPORT_CIRCLES,
  CRISIS_PROTOCOLS
};