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


// Usage component for UI display
import { SelfLearningService } from "@/lib/SelfLearningService";

export const UsageStatsDisplay = () => {
  const stats = SelfLearningService.load();
  const visits = Object.entries(stats.pageVisits)
    .map(([page, count]) => `${page}: ${count}`)
    .join(", ");
  const suggestion = SelfLearningService.getSuggestion();

  return (
    <div className="p-4 border rounded-xl shadow bg-white text-sm">
      <h2 className="font-bold mb-2">Usage Stats</h2>
      <p className="mb-1"><strong>Pages Visited:</strong> {visits || "None yet"}</p>
      {suggestion && <p className="text-blue-600"><strong>Tip:</strong> {suggestion}</p>}
    </div>
  );
};
