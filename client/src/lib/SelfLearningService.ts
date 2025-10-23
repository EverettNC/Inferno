// src/lib/SelfLearningService.ts

export type UsageStats = {
  pageVisits: Record<string, number>;
  moodHistory: { timestamp: number; mood: string }[];
  lastSuggestion: string | null;
};

export class SelfLearningService {
  private static key = "inferno_self_learning";

  static load(): UsageStats {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : {
      pageVisits: {},
      moodHistory: [],
      lastSuggestion: null,
    };
  }

  static save(data: UsageStats) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  static logVisit(page: string) {
    const data = this.load();
    data.pageVisits[page] = (data.pageVisits[page] || 0) + 1;
    this.save(data);
  }

  static logMood(mood: string) {
    const data = this.load();
    data.moodHistory.push({ timestamp: Date.now(), mood });
    this.save(data);
  }

  static getSuggestion(): string | null {
    const data = this.load();
    const recentSad = data.moodHistory.filter(m => m.mood === "sad");
    if (recentSad.length >= 3) return "Try a breathing session tonight.";
    return null;
  }
}
