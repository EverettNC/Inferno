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


/**
 * Clinical-Grade Trauma Therapy Protocols
 * Evidence-based trauma treatment knowledge from peer-reviewed research
 */

export const TRAUMA_THERAPY_PROTOCOLS = {
  CPT: {
    name: "Cognitive Processing Therapy",
    description: "Evidence-based treatment for PTSD focusing on challenging and modifying unhelpful beliefs related to trauma",
    keyPrinciples: [
      "Identify and challenge stuck points (maladaptive beliefs)",
      "Process trauma through written or verbal accounts",
      "Examine how trauma affects beliefs about safety, trust, control, esteem, and intimacy",
      "Develop more balanced and adaptive thoughts"
    ],
    techniques: [
      "Socratic questioning to challenge beliefs",
      "Written impact statements",
      "Challenging Questions worksheets",
      "ABC worksheets (Activating event, Belief, Consequence)"
    ]
  },
  
  PE: {
    name: "Prolonged Exposure Therapy",
    description: "Gold-standard treatment for PTSD using gradual exposure to trauma memories and avoided situations",
    keyPrinciples: [
      "Approach (rather than avoid) trauma reminders",
      "Process trauma memories through repeated retelling",
      "Gradual real-life exposure to safe but avoided situations",
      "Emotional processing through habituation"
    ],
    techniques: [
      "In vivo exposure (gradual real-world exposure)",
      "Imaginal exposure (revisiting trauma memory)",
      "Breathing retraining",
      "Processing emotional responses after exposure"
    ]
  },
  
  EMDR: {
    name: "Eye Movement Desensitization and Reprocessing",
    description: "Trauma processing through bilateral stimulation while recalling traumatic memories",
    keyPrinciples: [
      "Adaptive Information Processing model",
      "Bilateral stimulation facilitates trauma processing",
      "Target disturbing memories with dual attention",
      "Install positive cognitions"
    ],
    phases: [
      "History taking and treatment planning",
      "Preparation and resourcing",
      "Assessment of target memory",
      "Desensitization through bilateral stimulation",
      "Installation of positive cognition",
      "Body scan for residual tension",
      "Closure and reevaluation"
    ]
  },
  
  DBT: {
    name: "Dialectical Behavior Therapy",
    description: "Comprehensive treatment combining acceptance and change strategies for emotion regulation",
    keySkills: {
      mindfulness: [
        "Observe without judgment",
        "Describe experiences objectively",
        "Participate fully in the present moment",
        "One-mindfully focus on current activity",
        "Effectiveness over being right"
      ],
      distressTolerance: [
        "TIPP skills (Temperature, Intense exercise, Paced breathing, Progressive relaxation)",
        "ACCEPTS (Activities, Contributing, Comparisons, Emotions, Push away, Thoughts, Sensations)",
        "Self-soothing through five senses",
        "IMPROVE the moment",
        "Radical acceptance"
      ],
      emotionRegulation: [
        "Identify and label emotions",
        "Check the facts",
        "Opposite action",
        "Problem solving",
        "ABC PLEASE (Accumulate positive experiences, Build mastery, Cope ahead, Treat Physical iLlness, Balanced Eating, Avoid mood-altering substances, Balanced Sleep, Exercise)"
      ],
      interpersonalEffectiveness: [
        "DEAR MAN (Describe, Express, Assert, Reinforce, stay Mindful, Appear confident, Negotiate)",
        "GIVE (Gentle, Interested, Validate, Easy manner)",
        "FAST (Fair, no Apologies, Stick to values, Truthful)"
      ]
    }
  },
  
  SAFETY_PLANNING: {
    name: "Safety Planning for Crisis",
    description: "Collaborative, evidence-based intervention to reduce suicide risk",
    steps: [
      "Recognize warning signs of crisis",
      "Employ internal coping strategies",
      "Utilize social contacts as distractions",
      "Contact family members or friends for help",
      "Contact mental health professionals",
      "Reduce access to lethal means"
    ],
    evidenceBase: "Stanley & Brown (2012) - Brief intervention shown to reduce suicidal behavior"
  },
  
  GROUNDING_CLINICAL: {
    name: "Evidence-Based Grounding Techniques",
    description: "Sensory-focused interventions for dissociation and flashbacks",
    techniques: {
      "5-4-3-2-1": "Najavits (2002) - Seeking Safety protocol for PTSD and substance abuse",
      "Sensory Grounding": "Van der Kolk (2014) - Body-based interventions for trauma",
      "Mental Grounding": "Focus on present moment awareness, mathematical tasks, categories",
      "Soothing Grounding": "Kind self-talk, safe place imagery, self-compassion"
    },
    evidenceBase: "Empirically supported for managing dissociation, flashbacks, and anxiety"
  }
};

export const CRISIS_ASSESSMENT_CLINICAL = {
  suicideRiskFactors: [
    "Previous suicide attempt",
    "Mental health diagnosis (depression, PTSD, substance use)",
    "Access to lethal means",
    "Recent significant loss",
    "Social isolation",
    "Chronic pain or illness",
    "Family history of suicide",
    "Recent discharge from psychiatric care",
    "Hopelessness and perceived burdensomeness"
  ],
  
  protectiveFactors: [
    "Strong social support",
    "Engagement in treatment",
    "Reasons for living",
    "Problem-solving skills",
    "Cultural or religious beliefs against suicide",
    "Responsibility to children or pets",
    "Future orientation and hope"
  ],
  
  warningSignsImmediate: [
    "Talking about wanting to die",
    "Looking for ways to kill oneself",
    "Talking about feeling hopeless or having no reason to live",
    "Talking about being a burden to others",
    "Increasing use of alcohol or drugs",
    "Acting anxious or agitated",
    "Withdrawing from activities",
    "Changing eating and sleeping habits",
    "Showing rage or talking about seeking revenge",
    "Displaying extreme mood swings",
    "Giving away possessions",
    "Saying goodbye to people"
  ]
};

export const TRAUMA_INFORMED_PRINCIPLES = {
  safety: "Physical and emotional safety is paramount",
  trustworthiness: "Transparency and consistency build trust",
  peerSupport: "Healing happens in relationships",
  collaboration: "Shared decision-making and empowerment",
  empowerment: "Recognize strengths and resilience",
  culturalSensitivity: "Respect cultural, historical, and gender issues"
};

export const PTSD_SYMPTOMS_DSM5 = {
  intrusion: [
    "Recurrent, involuntary distressing memories",
    "Traumatic nightmares",
    "Dissociative reactions (flashbacks)",
    "Intense psychological distress to trauma reminders",
    "Physiological reactions to trauma reminders"
  ],
  avoidance: [
    "Avoidance of trauma-related thoughts or feelings",
    "Avoidance of trauma-related external reminders"
  ],
  negativeAlterations: [
    "Inability to remember important aspects of trauma",
    "Persistent negative beliefs about self, others, or world",
    "Distorted blame of self or others",
    "Persistent negative emotional state",
    "Diminished interest in activities",
    "Feelings of detachment from others",
    "Inability to experience positive emotions"
  ],
  arousal: [
    "Irritable or aggressive behavior",
    "Reckless or self-destructive behavior",
    "Hypervigilance",
    "Exaggerated startle response",
    "Problems with concentration",
    "Sleep disturbance"
  ]
};

export const CLINICAL_INTERVENTIONS = {
  flashback: {
    immediate: [
      "Orient to present: Name 5 things you can see",
      "Grounding statements: 'I am safe now. That was then, this is now.'",
      "Physical grounding: Feel feet on floor, hold ice cube, splash cold water",
      "Breathing: Slow, deep breaths to activate parasympathetic system"
    ],
    evidenceBase: "Van der Kolk (2014) - The Body Keeps the Score"
  },
  
  panicAttack: {
    immediate: [
      "Recognize it will pass (typically 10-20 minutes)",
      "Diaphragmatic breathing: 4-4-6 pattern",
      "Progressive muscle relaxation",
      "Grounding through senses",
      "Self-compassion: 'This is hard, but I can get through this'"
    ],
    evidenceBase: "Barlow et al. (2002) - Panic Control Treatment"
  },
  
  dissociation: {
    immediate: [
      "Strong sensory input: Ice, peppermint, loud music",
      "Movement: Stamping feet, jumping jacks",
      "Mental grounding: Name objects, count backwards",
      "Safe person or place imagery"
    ],
    evidenceBase: "Najavits (2002) - Seeking Safety"
  }
};

export function getClinicalGuidance(symptom: string): string {
  const symptomLower = symptom.toLowerCase();
  
  if (symptomLower.includes('flashback')) {
    return `Clinical Response for Flashbacks:\n${CLINICAL_INTERVENTIONS.flashback.immediate.join('\n')}\n\nEvidence: ${CLINICAL_INTERVENTIONS.flashback.evidenceBase}`;
  }
  
  if (symptomLower.includes('panic') || symptomLower.includes('anxiety attack')) {
    return `Clinical Response for Panic:\n${CLINICAL_INTERVENTIONS.panicAttack.immediate.join('\n')}\n\nEvidence: ${CLINICAL_INTERVENTIONS.panicAttack.evidenceBase}`;
  }
  
  if (symptomLower.includes('dissociat') || symptomLower.includes('numb') || symptomLower.includes('detach')) {
    return `Clinical Response for Dissociation:\n${CLINICAL_INTERVENTIONS.dissociation.immediate.join('\n')}\n\nEvidence: ${CLINICAL_INTERVENTIONS.dissociation.evidenceBase}`;
  }
  
  return "Use evidence-based grounding and present-moment awareness techniques.";
}

export function getTherapyProtocolGuidance(context: string): string {
  const contextLower = context.toLowerCase();
  
  let guidance = "Evidence-Based Trauma Treatment Protocols:\n\n";
  
  if (contextLower.includes('thought') || contextLower.includes('belief') || contextLower.includes('think')) {
    guidance += `Consider CPT approach: ${TRAUMA_THERAPY_PROTOCOLS.CPT.description}\n`;
    guidance += `Key technique: ${TRAUMA_THERAPY_PROTOCOLS.CPT.techniques[0]}\n\n`;
  }
  
  if (contextLower.includes('avoid') || contextLower.includes('fear')) {
    guidance += `Consider PE approach: ${TRAUMA_THERAPY_PROTOCOLS.PE.description}\n`;
    guidance += `Key principle: ${TRAUMA_THERAPY_PROTOCOLS.PE.keyPrinciples[0]}\n\n`;
  }
  
  if (contextLower.includes('emotion') || contextLower.includes('regulate') || contextLower.includes('overwhelm')) {
    guidance += `Consider DBT skills: ${TRAUMA_THERAPY_PROTOCOLS.DBT.description}\n`;
    guidance += `Mindfulness: ${TRAUMA_THERAPY_PROTOCOLS.DBT.keySkills.mindfulness[0]}\n`;
    guidance += `Distress Tolerance: ${TRAUMA_THERAPY_PROTOCOLS.DBT.keySkills.distressTolerance[0]}\n\n`;
  }
  
  return guidance;
}
