/**
 * Knowledge Synchronization Service
 * Continuously updates Inferno's knowledge base with latest trauma research
 */

import { db } from "../db";
import { knowledgeBase, type InsertKnowledgeBase } from "@shared/schema";
import { getLatestTraumaResearch, searchTherapyResearch } from "./pubmed";
import { TRAUMA_THERAPY_PROTOCOLS, CLINICAL_INTERVENTIONS } from "./clinical-protocols";

/**
 * Initialize knowledge base with core clinical protocols
 */
export async function initializeClinicalProtocols(): Promise<void> {
  console.log("Initializing clinical knowledge base...");
  
  const protocols: InsertKnowledgeBase[] = [
    {
      title: "Cognitive Processing Therapy (CPT) for PTSD",
      content: JSON.stringify(TRAUMA_THERAPY_PROTOCOLS.CPT),
      source: "clinical-protocol",
      sourceId: "CPT-v1",
      category: "CPT",
      evidenceLevel: "clinical-guideline",
      publicationDate: "2024",
      authors: ["Resick, P.A.", "Monson, C.M.", "Chard, K.M."],
      keywords: ["CPT", "PTSD", "cognitive therapy", "trauma processing"],
      summary: TRAUMA_THERAPY_PROTOCOLS.CPT.description
    },
    {
      title: "Prolonged Exposure Therapy (PE) for PTSD",
      content: JSON.stringify(TRAUMA_THERAPY_PROTOCOLS.PE),
      source: "clinical-protocol",
      sourceId: "PE-v1",
      category: "PE",
      evidenceLevel: "clinical-guideline",
      publicationDate: "2024",
      authors: ["Foa, E.B.", "Hembree, E.A.", "Rothbaum, B.O."],
      keywords: ["PE", "PTSD", "exposure therapy", "habituation"],
      summary: TRAUMA_THERAPY_PROTOCOLS.PE.description
    },
    {
      title: "Eye Movement Desensitization and Reprocessing (EMDR)",
      content: JSON.stringify(TRAUMA_THERAPY_PROTOCOLS.EMDR),
      source: "clinical-protocol",
      sourceId: "EMDR-v1",
      category: "EMDR",
      evidenceLevel: "clinical-guideline",
      publicationDate: "2024",
      authors: ["Shapiro, F."],
      keywords: ["EMDR", "PTSD", "bilateral stimulation", "trauma processing"],
      summary: TRAUMA_THERAPY_PROTOCOLS.EMDR.description
    },
    {
      title: "Dialectical Behavior Therapy (DBT) Skills",
      content: JSON.stringify(TRAUMA_THERAPY_PROTOCOLS.DBT),
      source: "clinical-protocol",
      sourceId: "DBT-v1",
      category: "DBT",
      evidenceLevel: "clinical-guideline",
      publicationDate: "2024",
      authors: ["Linehan, M.M."],
      keywords: ["DBT", "emotion regulation", "mindfulness", "distress tolerance"],
      summary: TRAUMA_THERAPY_PROTOCOLS.DBT.description
    },
    {
      title: "Evidence-Based Grounding Techniques for Trauma",
      content: JSON.stringify(TRAUMA_THERAPY_PROTOCOLS.GROUNDING_CLINICAL),
      source: "clinical-protocol",
      sourceId: "GROUNDING-v1",
      category: "grounding",
      evidenceLevel: "expert-consensus",
      publicationDate: "2024",
      authors: ["Najavits, L.M.", "Van der Kolk, B."],
      keywords: ["grounding", "5-4-3-2-1", "dissociation", "flashbacks"],
      summary: TRAUMA_THERAPY_PROTOCOLS.GROUNDING_CLINICAL.description
    },
    {
      title: "Clinical Interventions for Flashbacks",
      content: JSON.stringify(CLINICAL_INTERVENTIONS.flashback),
      source: "clinical-protocol",
      sourceId: "FLASHBACK-INT-v1",
      category: "crisis-intervention",
      evidenceLevel: "expert-consensus",
      publicationDate: "2024",
      authors: ["Van der Kolk, B."],
      keywords: ["flashbacks", "grounding", "present-orientation"],
      summary: "Evidence-based immediate interventions for flashback episodes"
    },
    {
      title: "Panic Attack Clinical Management",
      content: JSON.stringify(CLINICAL_INTERVENTIONS.panicAttack),
      source: "clinical-protocol",
      sourceId: "PANIC-INT-v1",
      category: "crisis-intervention",
      evidenceLevel: "RCT",
      publicationDate: "2024",
      authors: ["Barlow, D.H."],
      keywords: ["panic", "anxiety", "breathing", "grounding"],
      summary: "Evidence-based panic control treatment techniques"
    }
  ];
  
  try {
    // Check if protocols already exist
    const existing = await db.query.knowledgeBase.findFirst({
      where: (kb, { eq }) => eq(kb.sourceId, "CPT-v1")
    });
    
    if (!existing) {
      await db.insert(knowledgeBase).values(protocols);
      console.log(`✅ Initialized ${protocols.length} clinical protocols`);
    } else {
      console.log("✅ Clinical protocols already initialized");
    }
  } catch (error) {
    console.error("Error initializing clinical protocols:", error);
  }
}

/**
 * Sync latest trauma research from PubMed
 */
export async function syncLatestResearch(): Promise<number> {
  console.log("Syncing latest trauma research from PubMed...");
  
  try {
    const articles = await getLatestTraumaResearch();
    let newArticlesCount = 0;
    
    for (const article of articles) {
      // Check if article already exists
      const existing = await db.query.knowledgeBase.findFirst({
        where: (kb, { eq }) => eq(kb.sourceId, article.pmid)
      });
      
      if (!existing) {
        const knowledgeEntry: InsertKnowledgeBase = {
          title: article.title,
          content: article.abstract,
          source: "pubmed",
          sourceId: article.pmid,
          category: categorizePubMedArticle(article.title, article.keywords),
          evidenceLevel: determineEvidenceLevel(article.title, article.abstract),
          publicationDate: article.publicationDate,
          authors: article.authors.length > 0 ? article.authors : undefined,
          keywords: article.keywords.length > 0 ? article.keywords : undefined,
          summary: article.abstract.slice(0, 500) + "..."
        };
        
        await db.insert(knowledgeBase).values(knowledgeEntry);
        newArticlesCount++;
      }
    }
    
    console.log(`✅ Synced ${newArticlesCount} new research articles`);
    return newArticlesCount;
  } catch (error) {
    console.error("Error syncing research:", error);
    return 0;
  }
}

/**
 * Categorize PubMed article based on title and keywords
 */
function categorizePubMedArticle(title: string, keywords: string[]): string {
  const titleLower = title.toLowerCase();
  const keywordsLower = keywords.map(k => k.toLowerCase()).join(" ");
  const combined = `${titleLower} ${keywordsLower}`;
  
  if (combined.includes("cognitive processing") || combined.includes("cpt")) return "CPT";
  if (combined.includes("prolonged exposure") || combined.includes(" pe ")) return "PE";
  if (combined.includes("emdr") || combined.includes("eye movement")) return "EMDR";
  if (combined.includes("dialectical behavior") || combined.includes("dbt")) return "DBT";
  if (combined.includes("mindfulness") || combined.includes("meditation")) return "mindfulness";
  if (combined.includes("grounding")) return "grounding";
  if (combined.includes("breathing")) return "breathing";
  if (combined.includes("crisis") || combined.includes("suicide")) return "crisis-intervention";
  
  return "general-ptsd";
}

/**
 * Determine evidence level of research
 */
function determineEvidenceLevel(title: string, abstract: string): string {
  const combined = `${title} ${abstract}`.toLowerCase();
  
  if (combined.includes("meta-analysis") || combined.includes("systematic review")) {
    return "meta-analysis";
  }
  if (combined.includes("randomized controlled trial") || combined.includes("rct")) {
    return "RCT";
  }
  if (combined.includes("clinical guideline") || combined.includes("practice guideline")) {
    return "clinical-guideline";
  }
  if (combined.includes("expert consensus") || combined.includes("expert opinion")) {
    return "expert-consensus";
  }
  
  return "research-study";
}

/**
 * Search knowledge base for relevant information
 */
export async function searchKnowledgeBase(query: string, limit: number = 5): Promise<any[]> {
  try {
    const queryLower = query.toLowerCase();
    
    // Simple keyword-based search (in production, use vector embeddings)
    const results = await db.query.knowledgeBase.findMany({
      limit,
      orderBy: (kb, { desc }) => desc(kb.createdAt)
    });
    
    // Filter by relevance to query
    const relevantResults = results.filter(entry => {
      const searchText = `${entry.title} ${entry.summary} ${entry.keywords?.join(" ")}`.toLowerCase();
      return searchText.includes(queryLower) || 
             entry.category.toLowerCase().includes(queryLower);
    });
    
    return relevantResults.slice(0, limit);
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    return [];
  }
}

/**
 * Get knowledge base summary by category
 */
export async function getKnowledgeSummaryByCategory(category: string): Promise<string> {
  try {
    const entries = await db.query.knowledgeBase.findMany({
      where: (kb, { eq }) => eq(kb.category, category),
      limit: 10
    });
    
    if (entries.length === 0) {
      return `No specific research found for ${category}. Using general trauma treatment guidelines.`;
    }
    
    const summary = entries.map((entry, index) => 
      `${index + 1}. ${entry.title} (${entry.evidenceLevel}, ${entry.publicationDate})\n   ${entry.summary}`
    ).join('\n\n');
    
    return `Evidence-Based Knowledge for ${category}:\n\n${summary}`;
  } catch (error) {
    console.error("Error getting knowledge summary:", error);
    return "Unable to retrieve knowledge summary at this time.";
  }
}

/**
 * Schedule periodic knowledge updates
 */
export function startKnowledgeSyncSchedule(): void {
  console.log("Starting knowledge synchronization schedule...");
  
  // Initialize clinical protocols on startup
  initializeClinicalProtocols();
  
  // Sync latest research daily at 3 AM
  const SYNC_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  
  setInterval(async () => {
    console.log("Running scheduled knowledge sync...");
    await syncLatestResearch();
  }, SYNC_INTERVAL);
  
  // Initial sync after 1 minute
  setTimeout(async () => {
    await syncLatestResearch();
  }, 60 * 1000);
}
