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
 * PubMed API Integration Service
 * Fetches peer-reviewed trauma and PTSD research from medical journals
 */

interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  doi?: string;
  keywords: string[];
}

interface PubMedSearchResult {
  articles: PubMedArticle[];
  totalCount: number;
}

const PUBMED_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

/**
 * Search PubMed for trauma-related research
 */
export async function searchPubMed(
  query: string,
  maxResults: number = 20
): Promise<PubMedSearchResult> {
  try {
    // Step 1: Search for article IDs
    const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    const idList = searchData.esearchresult?.idlist || [];
    const totalCount = parseInt(searchData.esearchresult?.count || "0");
    
    if (idList.length === 0) {
      return { articles: [], totalCount: 0 };
    }
    
    // Step 2: Fetch article details
    const fetchUrl = `${PUBMED_BASE_URL}/efetch.fcgi?db=pubmed&id=${idList.join(',')}&retmode=xml`;
    const fetchResponse = await fetch(fetchUrl);
    const xmlText = await fetchResponse.text();
    
    // Parse XML (simplified - in production use proper XML parser)
    const articles = parseArticlesFromXML(xmlText);
    
    return {
      articles,
      totalCount
    };
  } catch (error) {
    console.error("Error searching PubMed:", error);
    return { articles: [], totalCount: 0 };
  }
}

/**
 * Get latest PTSD and trauma research
 */
export async function getLatestTraumaResearch(): Promise<PubMedArticle[]> {
  const queries = [
    'PTSD treatment[Title/Abstract] AND (2023[PDAT] OR 2024[PDAT] OR 2025[PDAT])',
    'trauma therapy[Title/Abstract] AND randomized controlled trial[Publication Type] AND (2023[PDAT] OR 2024[PDAT] OR 2025[PDAT])',
    'cognitive processing therapy[Title/Abstract] AND (2023[PDAT] OR 2024[PDAT] OR 2025[PDAT])',
    'prolonged exposure therapy[Title/Abstract] AND (2023[PDAT] OR 2024[PDAT] OR 2025[PDAT])',
    'EMDR[Title/Abstract] AND PTSD[Title/Abstract] AND (2023[PDAT] OR 2024[PDAT] OR 2025[PDAT])'
  ];
  
  const allArticles: PubMedArticle[] = [];
  
  for (const query of queries) {
    const result = await searchPubMed(query, 5);
    allArticles.push(...result.articles);
  }
  
  // Remove duplicates by PMID
  const uniqueArticles = Array.from(
    new Map(allArticles.map(article => [article.pmid, article])).values()
  );
  
  return uniqueArticles;
}

/**
 * Search for specific trauma therapy research
 */
export async function searchTherapyResearch(therapyType: string): Promise<PubMedArticle[]> {
  const therapyQueries: { [key: string]: string } = {
    CPT: 'cognitive processing therapy[Title/Abstract] AND PTSD[Title/Abstract]',
    PE: 'prolonged exposure[Title/Abstract] AND PTSD[Title/Abstract]',
    EMDR: 'EMDR[Title/Abstract] AND trauma[Title/Abstract]',
    DBT: 'dialectical behavior therapy[Title/Abstract] AND (PTSD[Title/Abstract] OR trauma[Title/Abstract])',
    mindfulness: 'mindfulness[Title/Abstract] AND PTSD[Title/Abstract]',
    grounding: 'grounding techniques[Title/Abstract] AND (PTSD[Title/Abstract] OR trauma[Title/Abstract])'
  };
  
  const query = therapyQueries[therapyType] || `${therapyType}[Title/Abstract] AND PTSD[Title/Abstract]`;
  const result = await searchPubMed(query, 10);
  
  return result.articles;
}

/**
 * Simplified XML parser for PubMed articles
 * In production, use a proper XML parser like fast-xml-parser
 */
function parseArticlesFromXML(xml: string): PubMedArticle[] {
  const articles: PubMedArticle[] = [];
  
  // Extract articles using regex (simplified approach)
  const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];
  
  for (const articleXml of articleMatches) {
    try {
      const pmidMatch = articleXml.match(/<PMID[^>]*>(\d+)<\/PMID>/);
      const titleMatch = articleXml.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
      const abstractMatch = articleXml.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/);
      const journalMatch = articleXml.match(/<Title>([\s\S]*?)<\/Title>/);
      const yearMatch = articleXml.match(/<Year>(\d{4})<\/Year>/);
      const monthMatch = articleXml.match(/<Month>(\w+)<\/Month>/);
      
      if (pmidMatch && titleMatch) {
        articles.push({
          pmid: pmidMatch[1],
          title: cleanXmlText(titleMatch[1]),
          abstract: abstractMatch ? cleanXmlText(abstractMatch[1]) : "No abstract available",
          authors: extractAuthors(articleXml),
          journal: journalMatch ? cleanXmlText(journalMatch[1]) : "Unknown Journal",
          publicationDate: `${monthMatch ? monthMatch[1] : ''} ${yearMatch ? yearMatch[1] : ''}`.trim() || "Unknown",
          keywords: extractKeywords(articleXml)
        });
      }
    } catch (error) {
      console.error("Error parsing article:", error);
    }
  }
  
  return articles;
}

function extractAuthors(xml: string): string[] {
  const authors: string[] = [];
  const authorMatches = xml.match(/<Author[^>]*>[\s\S]*?<\/Author>/g) || [];
  
  for (const authorXml of authorMatches) {
    const lastNameMatch = authorXml.match(/<LastName>([\s\S]*?)<\/LastName>/);
    const foreNameMatch = authorXml.match(/<ForeName>([\s\S]*?)<\/ForeName>/);
    
    if (lastNameMatch) {
      const author = foreNameMatch 
        ? `${foreNameMatch[1]} ${lastNameMatch[1]}`
        : lastNameMatch[1];
      authors.push(cleanXmlText(author));
    }
  }
  
  return authors;
}

function extractKeywords(xml: string): string[] {
  const keywords: string[] = [];
  const keywordMatches = xml.match(/<Keyword[^>]*>([\s\S]*?)<\/Keyword>/g) || [];
  
  for (const keywordXml of keywordMatches) {
    const keywordMatch = keywordXml.match(/>([\s\S]*?)</);
    if (keywordMatch) {
      keywords.push(cleanXmlText(keywordMatch[1]));
    }
  }
  
  return keywords;
}

function cleanXmlText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '') // Remove XML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Get evidence-based recommendations for a specific symptom or concern
 */
export async function getEvidenceBasedGuidance(concern: string): Promise<string> {
  try {
    const result = await searchPubMed(`${concern} AND evidence-based AND treatment AND (2020[PDAT]:2025[PDAT])`, 5);
    
    if (result.articles.length === 0) {
      return "Current evidence-based approaches recommend trauma-focused therapy such as CPT, PE, or EMDR.";
    }
    
    const summary = result.articles
      .slice(0, 3)
      .map(article => `${article.title} (${article.publicationDate})`)
      .join('\n');
    
    return `Recent research on ${concern}:\n\n${summary}`;
  } catch (error) {
    console.error("Error getting evidence-based guidance:", error);
    return "Evidence-based trauma treatments include Cognitive Processing Therapy (CPT), Prolonged Exposure (PE), and EMDR.";
  }
}
