/**
 * Professional Training Hub - The Christman AI Project 🎓✨
 * 
 * Comprehensive database of FREE, globally accessible trauma care,
 * PTSD counseling, and veteran mental health support certifications.
 * 
 * This system provides legitimate clinical pathways for users to become
 * qualified trauma responders, peer anchors, and mental health facilitators.
 */

export interface TrainingProgram {
  id: string;
  name: string;
  provider: string;
  category: 'trauma-informed-care' | 'ptsd-veteran' | 'emdr-advanced' | 'clinical-counseling' | 'somatic-foundational';
  level: 'foundational' | 'intermediate' | 'advanced' | 'specialist';
  duration: string;
  format: 'self-paced' | 'scheduled' | 'hybrid' | 'retreat';
  certification: boolean;
  ceuCredits: number;
  globalAccess: boolean;
  cost: 'free' | 'funded' | 'scholarship';
  url: string;
  description: string;
  prerequisites?: string[];
  outcomes: string[];
  nextSteps?: string[];
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  stages: {
    step: number;
    program: string;
    provider: string;
    certificate: boolean;
    estimatedDuration: string;
  }[];
  totalDuration: string;
  careerOutcomes: string[];
}

export const PROFESSIONAL_TRAINING_PROGRAMS: TrainingProgram[] = [
  // TRAUMA-INFORMED CARE CERTIFICATIONS
  {
    id: 'trauma-free-world',
    name: 'Faith-Based Trauma-Informed Care Training',
    provider: 'Trauma Free World',
    category: 'trauma-informed-care',
    level: 'foundational',
    duration: '8-12 hours',
    format: 'self-paced',
    certification: true,
    ceuCredits: 0,
    globalAccess: true,
    cost: 'free',
    url: 'https://traumafreeworld.org',
    description: 'Free, faith-based trauma-informed care training used by organizations worldwide to equip trauma responders. Training includes understanding trauma reactions, de-escalation, and resilience building.',
    outcomes: [
      'Understanding trauma reactions and triggers',
      'De-escalation techniques for crisis situations',
      'Building resilience in trauma survivors',
      'Faith-based approaches to healing',
      'Community trauma response protocols'
    ],
    nextSteps: ['indiana-university-tic', 'samhsa-trauma-ceus']
  },
  
  {
    id: 'indiana-university-tic',
    name: 'Trauma-Informed Care Professional Development Certificate',
    provider: 'Indiana University',
    category: 'trauma-informed-care',
    level: 'intermediate',
    duration: '6 modules, self-paced',
    format: 'self-paced',
    certification: true,
    ceuCredits: 12,
    globalAccess: true,
    cost: 'free',
    url: 'https://rural.indiana.edu/focus/health/trauma-informed-care-certificate.html',
    description: 'Completely free, self-paced, six-module program with continuing education units (CEUs) for health and mental health professionals. Includes veteran and justice-involved modules.',
    outcomes: [
      'Advanced trauma-informed care principles',
      'Veteran-specific trauma interventions',
      'Justice-involved population strategies',
      'Professional CEU credits for licensing',
      'Evidence-based practice foundations'
    ],
    nextSteps: ['va-ptsd-training', 'emdr-intro']
  },

  {
    id: 'trauma-informed-oregon',
    name: 'TIC Modules - Trauma-Informed Care',
    provider: 'Trauma Informed Oregon',
    category: 'trauma-informed-care',
    level: 'foundational',
    duration: '4 modules, 6-8 hours total',
    format: 'self-paced',
    certification: true,
    ceuCredits: 0,
    globalAccess: true,
    cost: 'free',
    url: 'https://traumainformedoregon.org/resources/training/tic-intro-training-modules/',
    description: 'Four free self-guided modules covering trauma-informed principles, neurobiology (NEAR sciences), and practical implementation. Completion provides downloadable certificate.',
    outcomes: [
      'Neurobiology of trauma (NEAR sciences)',
      'Trauma-informed organizational principles',
      'Practical implementation strategies',
      'Downloadable professional certificate',
      'Foundation for advanced training'
    ],
    nextSteps: ['indiana-university-tic', 'samhsa-trauma-ceus']
  },

  {
    id: 'samhsa-trauma-ceus',
    name: 'SAMHSA Trauma CEU Training',
    provider: 'SAMHSA (US Substance Abuse and Mental Health Services Administration)',
    category: 'trauma-informed-care',
    level: 'intermediate',
    duration: 'Multiple courses, 1-8 hours each',
    format: 'self-paced',
    certification: true,
    ceuCredits: 24,
    globalAccess: true,
    cost: 'free',
    url: 'https://www.samhsa.gov/about/organization/offices-centers',
    description: 'Courses include trauma screening, trauma-focused CBT, and community-based trauma systems through the U.S. Substance Abuse and Mental Health Services Administration.',
    outcomes: [
      'Trauma screening and assessment',
      'Trauma-focused cognitive behavioral therapy',
      'Community-based trauma systems',
      'Professional CEU credits',
      'Federal agency certification'
    ],
    nextSteps: ['va-ptsd-training', 'emdr-intro']
  },

  // PTSD & VETERAN-FOCUSED TRAINING
  {
    id: 'va-ptsd-training',
    name: 'VA National Center for PTSD Continuing Education',
    provider: 'VA National Center for PTSD',
    category: 'ptsd-veteran',
    level: 'advanced',
    duration: 'Multiple courses, 20+ hours total',
    format: 'self-paced',
    certification: true,
    ceuCredits: 20,
    globalAccess: true,
    cost: 'free',
    url: 'https://www.ptsd.va.gov/professional/continuing_ed/index.asp',
    description: 'All online training covers prolonged exposure therapy, trauma assessment, and cultural issues in PTSD care. Completely free for all professionals worldwide.',
    outcomes: [
      'Prolonged exposure therapy techniques',
      'Advanced trauma assessment protocols',
      'Cultural competency in PTSD care',
      'Evidence-based PTSD interventions',
      'VA-certified professional training'
    ],
    nextSteps: ['wounded-warrior-project', 'emdr-advanced']
  },

  {
    id: 'wounded-warrior-project',
    name: 'Project Odyssey - PTSD Resilience Program',
    provider: 'Wounded Warrior Project',
    category: 'ptsd-veteran',
    level: 'specialist',
    duration: '12 weeks + 5-day retreats',
    format: 'hybrid',
    certification: true,
    ceuCredits: 0,
    globalAccess: true,
    cost: 'free',
    url: 'https://www.woundedwarriorproject.org/programs/project-odyssey',
    description: '12-week free trauma resilience and retreat program for PTSD-affected veterans. Includes 5-day mental health retreats, follow-ups, and online resiliency sessions.',
    outcomes: [
      'Advanced PTSD resilience techniques',
      'Peer-to-peer support facilitation',
      'Retreat-based intensive healing',
      'Long-term recovery planning',
      'Veteran community leadership'
    ],
    prerequisites: ['Veteran status or family member', 'Basic trauma awareness'],
    nextSteps: ['adler-military-psychology']
  },

  {
    id: 'adler-military-psychology',
    name: 'Military Psychology Training',
    provider: 'Adler University',
    category: 'ptsd-veteran',
    level: 'advanced',
    duration: 'Multiple modules, 15+ hours',
    format: 'self-paced',
    certification: true,
    ceuCredits: 15,
    globalAccess: true,
    cost: 'free',
    url: 'https://www.adler.edu/',
    description: 'Open access modules for clinicians supporting soldiers and veterans, focusing on combat trauma and reintegration strategies.',
    outcomes: [
      'Combat trauma specialization',
      'Military reintegration strategies',
      'Family system interventions',
      'Cultural military competency',
      'Advanced clinical techniques'
    ],
    nextSteps: ['emdr-advanced', 'somatic-experiencing']
  },

  // EMDR & ADVANCED TRAUMA THERAPY
  {
    id: 'emdr-intro',
    name: 'The EMDR Approach to Trauma',
    provider: 'Trauma Therapist Institute',
    category: 'emdr-advanced',
    level: 'intermediate',
    duration: '1 hour workshop',
    format: 'scheduled',
    certification: true,
    ceuCredits: 1,
    globalAccess: true,
    cost: 'free',
    url: 'https://www.traumatherapistinstitute.com/',
    description: 'Free 1-hour global online workshop covering Adaptive Information Processing (AIP), EMDR fundamentals, and neurobiological trauma integration.',
    outcomes: [
      'EMDR theoretical foundations',
      'Adaptive Information Processing model',
      'Neurobiological trauma integration',
      'Basic bilateral stimulation',
      'EMDR protocol overview'
    ],
    nextSteps: ['emdr-advanced', 'creative-mindfulness-emdr']
  },

  {
    id: 'creative-mindfulness-emdr',
    name: 'Free EMDR Webinar Series',
    provider: 'Institute for Creative Mindfulness',
    category: 'emdr-advanced',
    level: 'advanced',
    duration: 'Ongoing webinars, 1-2 hours each',
    format: 'scheduled',
    certification: true,
    ceuCredits: 12,
    globalAccess: true,
    cost: 'free',
    url: 'https://www.instituteforcreativemindfulness.com/free-webinars/',
    description: 'Continuous free webinars on EMDR applications, trauma-informed yoga, and dissociation, accessible worldwide.',
    outcomes: [
      'Advanced EMDR applications',
      'Trauma-informed yoga integration',
      'Dissociation treatment protocols',
      'Creative mindfulness techniques',
      'Somatic EMDR approaches'
    ],
    nextSteps: ['university-pittsburgh-emdr']
  },

  {
    id: 'university-pittsburgh-emdr',
    name: 'EMDR Certification Track',
    provider: 'University of Pittsburgh School of Social Work',
    category: 'emdr-advanced',
    level: 'specialist',
    duration: '52 hours virtual track',
    format: 'scheduled',
    certification: true,
    ceuCredits: 52,
    globalAccess: true,
    cost: 'funded',
    url: 'https://www.socialwork.pitt.edu/professional-continuing-education/free-emdr-certification',
    description: '52-hour virtual EMDR track for qualified clinicians, occasionally funded for free under research and state training partnerships.',
    prerequisites: ['Licensed mental health professional', 'Previous EMDR training'],
    outcomes: [
      'Full EMDR certification',
      'Advanced protocol mastery',
      'Complex trauma specialization',
      'Research-based validation',
      'University accreditation'
    ]
  }
];

export const INTEGRATED_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'trauma-responder-pathway',
    name: 'Trauma Responder Certification Path',
    description: 'Complete pathway from foundational trauma awareness to advanced trauma response capabilities',
    stages: [
      {
        step: 1,
        program: 'Intro to Trauma-Informed Care',
        provider: 'Trauma Informed Oregon',
        certificate: true,
        estimatedDuration: '1-2 weeks'
      },
      {
        step: 2,
        program: 'Trauma CEU Training',
        provider: 'SAMHSA',
        certificate: true,
        estimatedDuration: '2-3 weeks'
      },
      {
        step: 3,
        program: 'PTSD Evidence-Based Practice',
        provider: 'VA National Center for PTSD',
        certificate: true,
        estimatedDuration: '4-6 weeks'
      },
      {
        step: 4,
        program: 'EMDR Introduction',
        provider: 'Trauma Therapist Institute',
        certificate: true,
        estimatedDuration: '1 week'
      },
      {
        step: 5,
        program: 'Advanced Trauma Certificate',
        provider: 'Indiana University',
        certificate: true,
        estimatedDuration: '6-8 weeks'
      }
    ],
    totalDuration: '3-4 months',
    careerOutcomes: [
      'Certified Trauma-Informed Care Specialist',
      'Peer Support Specialist',
      'Crisis Intervention Counselor',
      'Community Trauma Responder',
      'Mental Health First Aid Instructor'
    ]
  },

  {
    id: 'veteran-specialist-pathway',
    name: 'Veteran Mental Health Specialist Path',
    description: 'Specialized pathway for working with military populations and combat trauma',
    stages: [
      {
        step: 1,
        program: 'Trauma-Informed Care Foundation',
        provider: 'Trauma Free World',
        certificate: true,
        estimatedDuration: '1-2 weeks'
      },
      {
        step: 2,
        program: 'VA PTSD Training',
        provider: 'VA National Center for PTSD',
        certificate: true,
        estimatedDuration: '4-6 weeks'
      },
      {
        step: 3,
        program: 'Project Odyssey Participation',
        provider: 'Wounded Warrior Project',
        certificate: true,
        estimatedDuration: '12 weeks'
      },
      {
        step: 4,
        program: 'Military Psychology Training',
        provider: 'Adler University',
        certificate: true,
        estimatedDuration: '3-4 weeks'
      },
      {
        step: 5,
        program: 'Advanced EMDR for Combat Trauma',
        provider: 'Institute for Creative Mindfulness',
        certificate: true,
        estimatedDuration: '6-8 weeks'
      }
    ],
    totalDuration: '6-7 months',
    careerOutcomes: [
      'Veteran Peer Support Specialist',
      'Military Family Counselor',
      'Combat Trauma Specialist',
      'Veteran Reintegration Coordinator',
      'Military Mental Health Advocate'
    ]
  },

  {
    id: 'clinical-professional-pathway',
    name: 'Clinical Professional Advanced Path',
    description: 'Advanced pathway for licensed professionals seeking trauma specialization',
    stages: [
      {
        step: 1,
        program: 'SAMHSA Trauma CEUs',
        provider: 'SAMHSA',
        certificate: true,
        estimatedDuration: '2-3 weeks'
      },
      {
        step: 2,
        program: 'Indiana University TIC Certificate',
        provider: 'Indiana University',
        certificate: true,
        estimatedDuration: '6-8 weeks'
      },
      {
        step: 3,
        program: 'VA Advanced PTSD Training',
        provider: 'VA National Center for PTSD',
        certificate: true,
        estimatedDuration: '4-6 weeks'
      },
      {
        step: 4,
        program: 'EMDR Certification Track',
        provider: 'University of Pittsburgh',
        certificate: true,
        estimatedDuration: '12-16 weeks'
      }
    ],
    totalDuration: '6-8 months',
    careerOutcomes: [
      'Licensed Clinical Trauma Specialist',
      'EMDR Certified Therapist',
      'PTSD Treatment Specialist',
      'Trauma Program Director',
      'Clinical Supervisor for Trauma Services'
    ]
  }
];

/**
 * Enhanced training recommendation engine
 */
export class ProfessionalTrainingEngine {
  
  static getRecommendedPath(
    currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional',
    interests: string[],
    timeCommitment: 'part-time' | 'full-time' | 'intensive'
  ): LearningPath {
    
    // Veteran-focused interests
    if (interests.includes('veterans') || interests.includes('military') || interests.includes('combat-trauma')) {
      return INTEGRATED_LEARNING_PATHS.find(p => p.id === 'veteran-specialist-pathway')!;
    }
    
    // Clinical professional interests
    if (interests.includes('clinical') || interests.includes('therapy') || interests.includes('emdr')) {
      return INTEGRATED_LEARNING_PATHS.find(p => p.id === 'clinical-professional-pathway')!;
    }
    
    // Default to trauma responder pathway
    return INTEGRATED_LEARNING_PATHS.find(p => p.id === 'trauma-responder-pathway')!;
  }
  
  static getNextRecommendations(completedPrograms: string[]): TrainingProgram[] {
    const completed = new Set(completedPrograms);
    
    return PROFESSIONAL_TRAINING_PROGRAMS.filter(program => {
      if (completed.has(program.id)) return false;
      
      // Check if prerequisites are met
      if (program.prerequisites) {
        return program.prerequisites.some(prereq => 
          PROFESSIONAL_TRAINING_PROGRAMS
            .filter(p => completed.has(p.id))
            .some(p => p.outcomes.some(outcome => 
              outcome.toLowerCase().includes(prereq.toLowerCase())
            ))
        );
      }
      
      return true;
    }).slice(0, 3); // Return top 3 recommendations
  }
  
  static calculateCredentialValue(completedPrograms: string[]): {
    totalCEUs: number;
    certificationsEarned: number;
    professionalLevel: 'entry' | 'intermediate' | 'advanced' | 'specialist';
    careerReadiness: string[];
  } {
    const programs = PROFESSIONAL_TRAINING_PROGRAMS.filter(p => 
      completedPrograms.includes(p.id)
    );
    
    const totalCEUs = programs.reduce((sum, p) => sum + p.ceuCredits, 0);
    const certificationsEarned = programs.filter(p => p.certification).length;
    
    let professionalLevel: 'entry' | 'intermediate' | 'advanced' | 'specialist' = 'entry';
    if (totalCEUs >= 50 && certificationsEarned >= 4) professionalLevel = 'specialist';
    else if (totalCEUs >= 30 && certificationsEarned >= 3) professionalLevel = 'advanced';
    else if (totalCEUs >= 15 && certificationsEarned >= 2) professionalLevel = 'intermediate';
    
    const careerReadiness = Array.from(new Set(
      programs.flatMap(p => p.outcomes)
    ));
    
    return {
      totalCEUs,
      certificationsEarned,
      professionalLevel,
      careerReadiness
    };
  }
}

/**
 * Global accessibility checker
 */
export const checkGlobalAccess = (countryCode: string): {
  availablePrograms: TrainingProgram[];
  restrictions: string[];
  alternativeResources: string[];
} => {
  // All programs in this database are globally accessible
  const availablePrograms = PROFESSIONAL_TRAINING_PROGRAMS.filter(p => p.globalAccess);
  
  const restrictions: string[] = [];
  const alternativeResources: string[] = [];
  
  // Add country-specific notes
  if (countryCode === 'US') {
    alternativeResources.push('Additional VA resources available for US veterans');
    alternativeResources.push('State-specific trauma training grants may be available');
  }
  
  if (countryCode === 'CA') {
    alternativeResources.push('CTRI - Crisis and Trauma Resource Institute (Canada) additional resources');
  }
  
  if (countryCode === 'AU') {
    alternativeResources.push('MindBody Training Institute Australia additional courses');
    alternativeResources.push('The Centre for Healing Australia trauma recovery courses');
  }
  
  return {
    availablePrograms,
    restrictions,
    alternativeResources
  };
};