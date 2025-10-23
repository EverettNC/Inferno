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
