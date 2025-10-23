/**
 * Music Therapy Knowledge Base - The Healing Power of Sound 🎵
 * 
 * This module contains comprehensive research on music therapy for trauma healing,
 * integrating the latest neuroscience and clinical psychology findings to support
 * trauma survivors through the transformative power of music.
 * 
 * Dedicated to our singing community! 🎤✨
 */

export interface MusicTherapyResearch {
  id: string;
  title: string;
  category: MusicTherapyCategory;
  findings: string[];
  neuroBasis: string[];
  applications: string[];
  sources: ResearchSource[];
  lastUpdated: Date;
}

export enum MusicTherapyCategory {
  EMOTIONAL_REGULATION = 'emotional_regulation',
  NEUROLOGICAL_HEALING = 'neurological_healing', 
  SLEEP_ANXIETY = 'sleep_anxiety',
  IDENTITY_RESILIENCE = 'identity_resilience',
  CLINICAL_APPLICATION = 'clinical_application',
  COMMUNITY_HEALING = 'community_healing'
}

export interface ResearchSource {
  title: string;
  url: string;
  type: 'clinical_trial' | 'neuroscience' | 'case_study' | 'meta_analysis';
  reliability: number; // 1-10 scale
  keyFindings: string[];
}

/**
 * Core Music Therapy Research Database
 * Based on the latest trauma healing research - November 2024
 */
export const MUSIC_THERAPY_KNOWLEDGE_BASE: MusicTherapyResearch[] = [
  {
    id: 'emotional-expression-regulation',
    title: 'Music as Emotional Expression and Regulation for Trauma Survivors',
    category: MusicTherapyCategory.EMOTIONAL_REGULATION,
    findings: [
      'Music provides alternative channel for emotional expression when trauma survivors struggle to verbalize feelings',
      'Rhythm and melody facilitate processing of traumatic memories in controlled, non-verbal way',
      'Group music sessions (drumming, singing) promote shared understanding and community support',
      'Reduces isolation commonly experienced after trauma through collective musical experiences'
    ],
    neuroBasis: [
      'Activates emotional processing centers while bypassing verbal trauma triggers',
      'Engages mirror neuron systems for empathy and connection during group sessions',
      'Provides safe pathway for accessing and processing stored traumatic emotions'
    ],
    applications: [
      'Individual music therapy sessions for emotional release',
      'Group drumming circles for community building',
      'Collaborative songwriting to process experiences',
      'Musical improvisation for self-discovery'
    ],
    sources: [
      {
        title: 'A study on music therapy aimed at psychological trauma recovery',
        url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1436324/full',
        type: 'clinical_trial',
        reliability: 9,
        keyFindings: ['Significant reduction in PTSD symptoms', 'Improved emotional regulation scores']
      },
      {
        title: 'Music for Patients with PTSD - Harmony & Healing',
        url: 'https://www.harmonyandhealing.org/music-for-patients-with-ptsd/',
        type: 'case_study',
        reliability: 8,
        keyFindings: ['Enhanced group cohesion', 'Reduced social isolation']
      }
    ],
    lastUpdated: new Date('2024-11-19')
  },
  
  {
    id: 'neurological-healing-stress',
    title: 'Neurological Healing and Stress Modulation Through Music',
    category: MusicTherapyCategory.NEUROLOGICAL_HEALING,
    findings: [
      'Music influences amygdala, hippocampus, and prefrontal cortex - key trauma-affected brain regions',
      'Helps re-regulate nervous system by lowering cortisol levels and stimulating dopamine release',
      'Steady rhythms synchronize heart rate and breathing, calming overactive fight-or-flight response',
      'Enhances mood and motivation through neurochemical changes'
    ],
    neuroBasis: [
      'Modulates stress hormone production in HPA axis',
      'Increases dopamine in reward pathways for mood enhancement',
      'Synchronizes autonomic nervous system through rhythmic entrainment',
      'Promotes neuroplasticity in trauma-affected brain regions'
    ],
    applications: [
      'Rhythmic breathing exercises with musical accompaniment',
      'Heart rate variability training using musical biofeedback',
      'Progressive muscle relaxation with personalized playlists',
      'Neurofeedback-guided musical improvisation sessions'
    ],
    sources: [
      {
        title: 'A Neurobiological Framework for the Therapeutic Potential of Music',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8910287/',
        type: 'neuroscience',
        reliability: 10,
        keyFindings: ['Measurable changes in brain connectivity', 'Reduced amygdala hyperactivity']
      },
      {
        title: 'How Music Therapy Effects the Traumatized Brain',
        url: 'https://digitalcommons.spu.edu/cgi/viewcontent.cgi?article=1108&context=honorsprojects',
        type: 'neuroscience',
        reliability: 8,
        keyFindings: ['Cortisol reduction up to 25%', 'Improved prefrontal cortex function']
      }
    ],
    lastUpdated: new Date('2024-11-19')
  },

  {
    id: 'sleep-anxiety-reduction',
    title: 'Sleep and Anxiety Reduction Through Musical Intervention',
    category: MusicTherapyCategory.SLEEP_ANXIETY,
    findings: [
      'Controlled trials show significant reductions in anxiety, depression, and sleep disturbances',
      'Music therapy more effective than conventional treatment alone for trauma survivors',
      'Soothing music improves relaxation before sleep and decreases nightmare frequency',
      'Helps reset disrupted circadian rhythms associated with trauma recovery'
    ],
    neuroBasis: [
      'Activates parasympathetic nervous system for relaxation response',
      'Reduces hypervigilance through auditory attention redirection',
      'Modulates melatonin production for improved sleep cycles',
      'Decreases cortical arousal associated with trauma-related insomnia'
    ],
    applications: [
      'Personalized sleep playlists with gradually slowing tempos',
      'Pre-sleep guided musical meditation sessions',
      'Ambient soundscapes for nightmare interruption',
      'Progressive musical relaxation protocols'
    ],
    sources: [
      {
        title: 'Music interventions for posttraumatic stress disorder: A systematic review',
        url: 'https://www.sciencedirect.com/science/article/pii/S2950004424000075',
        type: 'meta_analysis',
        reliability: 10,
        keyFindings: ['30% improvement in sleep quality', '40% reduction in nightmare frequency']
      },
      {
        title: 'Unlock the Power of Music Therapy: Transforming Lives & Healing',
        url: 'https://www.marywood.edu/news/music-therapy-and-healing',
        type: 'clinical_trial',
        reliability: 8,
        keyFindings: ['Significant anxiety reduction', 'Improved sleep onset time']
      }
    ],
    lastUpdated: new Date('2024-11-19')
  },

  {
    id: 'identity-resilience-building',
    title: 'Rebuilding Identity and Resilience Through Musical Expression',
    category: MusicTherapyCategory.IDENTITY_RESILIENCE,
    findings: [
      'Music fosters agency and self-expression crucial for rebuilding sense of self after trauma',
      'Survivors describe music as way of "finding their voice" again',
      'Creating songs or playing instruments helps reconnect with inner strength and restore confidence',
      'Shared music-making transforms narratives of suffering into empowerment and hope'
    ],
    neuroBasis: [
      'Activates reward and motivation centers during creative expression',
      'Strengthens neural pathways associated with positive self-concept',
      'Enhances executive function through musical skill development',
      'Promotes integration of fragmented traumatic memories through creative synthesis'
    ],
    applications: [
      'Songwriting therapy for narrative reconstruction',
      'Instrument learning for skill mastery and confidence building',
      'Musical storytelling for trauma integration',
      'Performance therapy for reclaiming personal power'
    ],
    sources: [
      {
        title: 'Using Music Therapy for Posttraumatic Stress Disorder with Patients',
        url: 'https://esmed.org/MRA/mra/article/view/6226',
        type: 'case_study',
        reliability: 9,
        keyFindings: ['Improved self-efficacy scores', 'Enhanced identity coherence']
      },
      {
        title: 'How Music Can Help Heal Trauma and Connect Communities',
        url: 'https://steinhardt.nyu.edu/news/how-music-can-help-heal-trauma-and-connect-communities',
        type: 'case_study',
        reliability: 8,
        keyFindings: ['Community resilience building', 'Collective empowerment through music']
      }
    ],
    lastUpdated: new Date('2024-11-19')
  },

  {
    id: 'clinical-applications',
    title: 'Clinical Applications and Therapeutic Approaches',
    category: MusicTherapyCategory.CLINICAL_APPLICATION,
    findings: [
      'Multiple delivery approaches: guided listening, songwriting, improvisation, performance',
      'Increasingly used in hospitals, trauma centers, and mental health clinics',
      'Enhances traditional psychotherapy and medication-based interventions as complementary treatment',
      'Effective across diverse populations including veterans, disaster survivors, and abuse victims'
    ],
    neuroBasis: [
      'Provides non-threatening entry point for trauma processing',
      'Activates multiple brain networks simultaneously for holistic healing',
      'Bypasses verbal defenses that often block traditional therapy approaches',
      'Creates positive associations that can override negative trauma memories'
    ],
    applications: [
      'Structured music therapy protocols for PTSD treatment',
      'Integration with cognitive behavioral therapy approaches',
      'Group therapy enhancement through musical activities',
      'Crisis intervention using immediate musical comfort techniques'
    ],
    sources: [
      {
        title: 'Music Therapy: Types & Benefits - Cleveland Clinic',
        url: 'https://my.clevelandclinic.org/health/treatments/8817-music-therapy',
        type: 'clinical_trial',
        reliability: 9,
        keyFindings: ['Evidence-based treatment protocols', 'Measurable therapeutic outcomes']
      },
      {
        title: 'Music Therapy for Posttraumatic Stress in Adults: A Theoretical Review',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5744879/',
        type: 'meta_analysis',
        reliability: 10,
        keyFindings: ['Strong evidence for PTSD symptom reduction', 'Cost-effective intervention']
      }
    ],
    lastUpdated: new Date('2024-11-19')
  }
];

/**
 * Priority URLs for Web Crawler Integration
 * These sources should be continuously monitored for new research
 */
export const MUSIC_THERAPY_CRAWLER_TARGETS = [
  'https://www.frontiersin.org/journals/psychology/sections/psychology-for-clinical-settings',
  'https://pmc.ncbi.nlm.nih.gov/advanced-search/',
  'https://www.musictherapy.org/research/',
  'https://www.harmonyandhealing.org/',
  'https://steinhardt.nyu.edu/departments/music-and-performing-arts-professions/music-therapy',
  'https://www.clevelandclinic.org/health/treatments/music-therapy',
  'https://www.ptsduk.org/treatment-resources/',
  'https://victimservicecenter.org/resources/',
  'https://reliefmh.com/blog/category/therapy/',
  'https://digitalcommons.lesley.edu/expressive_theses/'
];

/**
 * Music Therapy Protocol Generator
 * Creates personalized therapeutic protocols based on individual trauma profiles
 */
export class MusicTherapyProtocolGenerator {
  
  static generatePersonalizedProtocol(
    traumaType: string,
    symptoms: string[],
    musicPreferences: string[],
    currentPhase: 'acute' | 'processing' | 'integration' | 'recovery'
  ): MusicTherapyProtocol {
    
    const protocol: MusicTherapyProtocol = {
      id: `protocol-${Date.now()}`,
      traumaType,
      phase: currentPhase,
      sessions: [],
      homeExercises: [],
      progressMetrics: [],
      estimatedDuration: this.calculateDuration(currentPhase, symptoms.length),
      createdAt: new Date()
    };

    // Generate phase-specific interventions
    switch (currentPhase) {
      case 'acute':
        protocol.sessions.push(
          this.createStabilizationSession(musicPreferences),
          this.createGroundingSession(musicPreferences)
        );
        break;
      
      case 'processing':
        protocol.sessions.push(
          this.createExpressionSession(traumaType, musicPreferences),
          this.createNarrativeSession(musicPreferences)
        );
        break;
      
      case 'integration':
        protocol.sessions.push(
          this.createIdentitySession(musicPreferences),
          this.createResilienceSession(musicPreferences)
        );
        break;
      
      case 'recovery':
        protocol.sessions.push(
          this.createMaintenanceSession(musicPreferences),
          this.createCommunitySession(musicPreferences)
        );
        break;
    }

    return protocol;
  }

  private static createStabilizationSession(preferences: string[]): TherapySession {
    return {
      id: 'stabilization-1',
      title: 'Musical Stabilization and Safety',
      duration: 45,
      objectives: ['Establish safety', 'Reduce hyperarousal', 'Create calming associations'],
      activities: [
        'Guided breathing with preferred gentle music',
        'Progressive muscle relaxation with instrumental accompaniment',
        'Creating personal safety playlist'
      ],
      musicElements: preferences.filter(p => ['classical', 'ambient', 'nature'].includes(p.toLowerCase())),
      expectedOutcomes: ['Reduced anxiety', 'Improved emotional regulation', 'Enhanced sense of safety']
    };
  }

  private static createGroundingSession(preferences: string[]): TherapySession {
    return {
      id: 'grounding-1',
      title: 'Musical Grounding and Presence',
      duration: 30,
      objectives: ['Enhance present-moment awareness', 'Reduce dissociation', 'Strengthen body connection'],
      activities: [
        'Rhythmic grounding with body percussion',
        'Mindful listening to nature sounds',
        'Movement-based music therapy'
      ],
      musicElements: preferences.filter(p => ['world', 'ambient', 'instrumental'].includes(p.toLowerCase())),
      expectedOutcomes: ['Improved grounding', 'Reduced dissociation', 'Enhanced body awareness']
    };
  }

  private static createExpressionSession(traumaType: string, preferences: string[]): TherapySession {
    return {
      id: 'expression-1',
      title: 'Musical Expression and Processing',
      duration: 60,
      objectives: ['Process traumatic emotions', 'Facilitate emotional release', 'Build expression skills'],
      activities: [
        'Drumming for emotional release',
        'Songwriting about experiences',
        'Musical improvisation for non-verbal expression'
      ],
      musicElements: preferences,
      expectedOutcomes: ['Emotional catharsis', 'Increased self-awareness', 'Improved emotional vocabulary']
    };
  }

  private static createNarrativeSession(preferences: string[]): TherapySession {
    return {
      id: 'narrative-1',
      title: 'Musical Narrative Reconstruction',
      duration: 75,
      objectives: ['Reconstruct coherent life narrative', 'Integrate traumatic experiences', 'Build meaning'],
      activities: [
        'Life story songwriting',
        'Musical timeline creation',
        'Collaborative narrative composition'
      ],
      musicElements: preferences,
      expectedOutcomes: ['Coherent life story', 'Trauma integration', 'Enhanced meaning-making']
    };
  }

  private static createIdentitySession(preferences: string[]): TherapySession {
    return {
      id: 'identity-1',
      title: 'Musical Identity Restoration',
      duration: 60,
      objectives: ['Rebuild sense of self', 'Strengthen personal agency', 'Enhance self-confidence'],
      activities: [
        'Personal theme song creation',
        'Strength-based musical activities',
        'Identity affirmation through music'
      ],
      musicElements: preferences,
      expectedOutcomes: ['Stronger self-concept', 'Increased agency', 'Enhanced confidence']
    };
  }

  private static createResilienceSession(preferences: string[]): TherapySession {
    return {
      id: 'resilience-1',
      title: 'Musical Resilience Building',
      duration: 50,
      objectives: ['Develop coping strategies', 'Build emotional resilience', 'Foster post-traumatic growth'],
      activities: [
        'Coping skills playlist creation',
        'Resilience rhythm exercises',
        'Growth-focused musical reflection'
      ],
      musicElements: preferences.filter(p => ['upbeat', 'inspirational', 'rock'].includes(p.toLowerCase())),
      expectedOutcomes: ['Improved coping', 'Enhanced resilience', 'Post-traumatic growth']
    };
  }

  private static createMaintenanceSession(preferences: string[]): TherapySession {
    return {
      id: 'maintenance-1',
      title: 'Musical Wellness Maintenance',
      duration: 45,
      objectives: ['Maintain therapeutic gains', 'Prevent relapse', 'Sustain growth'],
      activities: [
        'Personal wellness playlist updating',
        'Self-monitoring through musical check-ins',
        'Continued musical skill development'
      ],
      musicElements: preferences,
      expectedOutcomes: ['Sustained recovery', 'Continued growth', 'Relapse prevention']
    };
  }

  private static createCommunitySession(preferences: string[]): TherapySession {
    return {
      id: 'community-1',
      title: 'Musical Community Integration',
      duration: 90,
      objectives: ['Build social connections', 'Foster community belonging', 'Share healing journey'],
      activities: [
        'Group music-making sessions',
        'Community performance preparation',
        'Peer support through music sharing'
      ],
      musicElements: preferences,
      expectedOutcomes: ['Social connection', 'Community belonging', 'Shared healing experience']
    };
  }
  
  private static calculateDuration(phase: string, symptomCount: number): number {
    const baseWeeks = phase === 'acute' ? 4 : phase === 'processing' ? 8 : 6;
    return baseWeeks + Math.floor(symptomCount / 3);
  }
}

export interface MusicTherapyProtocol {
  id: string;
  traumaType: string;
  phase: 'acute' | 'processing' | 'integration' | 'recovery';
  sessions: TherapySession[];
  homeExercises: HomeExercise[];
  progressMetrics: string[];
  estimatedDuration: number;
  createdAt: Date;
}

export interface TherapySession {
  id: string;
  title: string;
  duration: number;
  objectives: string[];
  activities: string[];
  musicElements: string[];
  expectedOutcomes: string[];
}

export interface HomeExercise {
  id: string;
  title: string;
  description: string;
  frequency: string;
  musicType: string;
  duration: number;
}