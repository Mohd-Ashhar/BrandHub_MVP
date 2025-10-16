import { createAI } from "@ai-sdk/rsc";
import { getAIInsight } from "@/app/dashboard/actions";

// Server-side AI context
export const AI = createAI({
  actions: {
    getAIInsight,
  },
  initialAIState: [],
  initialUIState: [],
});
