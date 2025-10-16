"use client";

import { readStreamableValue } from "@ai-sdk/rsc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAIInsight } from "@/app/dashboard/actions";

interface AIInsightProps {
  enrollmentsData: any[];
  studentGrowthData: any[];
}

export function AIInsight({
  enrollmentsData,
  studentGrowthData,
}: AIInsightProps) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateInsight = async () => {
    setLoading(true);
    setInsight(""); // Reset insight

    const combinedData = {
      enrollmentsPerCourse: enrollmentsData,
      studentGrowthOverTime: studentGrowthData,
    };

    try {
      const streamableValue = await getAIInsight(JSON.stringify(combinedData));

      // Read the streaming value
      for await (const delta of readStreamableValue(streamableValue)) {
        setInsight((prev) => prev + delta);
      }
    } catch (error) {
      console.error("Error generating insight:", error);
      setInsight("Failed to generate insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGenerateInsight} disabled={loading}>
          ✨ {loading ? "Generating..." : "Generate AI Insights"}
        </Button>

        {loading && !insight ? (
          <div className="mt-4">
            <p>Analyzing your data...</p>
          </div>
        ) : insight ? (
          <div className="mt-4 whitespace-pre-wrap">{insight}</div>
        ) : (
          <div className="mt-4 text-muted-foreground">
            Click the button to generate insights based on the current dashboard
            data.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
