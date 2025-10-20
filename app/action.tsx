import { createAI } from "@ai-sdk/rsc";
import { getAIInsight } from "./dashboard/admin/analytics/actions";

// Server-side AI context
export const AI = createAI({
  actions: {
    getAIInsight,
  },
  initialAIState: [],
  initialUIState: [],
});
