"use client";

import { readStreamableValue } from "@ai-sdk/rsc"; // ✅ Changed from ai/rsc
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAIInsight } from "@/app/dashboard/admin/analytics/actions";
import { Sparkles, Loader2 } from "lucide-react";

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
    setInsight("");

    const combinedData = {
      enrollmentsPerCourse: enrollmentsData,
      studentGrowthOverTime: studentGrowthData,
      totalCourses: enrollmentsData.length,
      totalEnrollments: enrollmentsData.reduce(
        (acc, curr) => acc + curr.enrollment_count,
        0
      ),
    };

    try {
      const streamableValue = await getAIInsight(JSON.stringify(combinedData));

      for await (const delta of readStreamableValue(streamableValue)) {
        setInsight((prev) => prev + delta);
      }
    } catch (error) {
      console.error("Error generating insight:", error);
      setInsight(
        "Failed to generate insights. Please check your API key configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI-Powered Insights
          </CardTitle>
          <Button onClick={handleGenerateInsight} disabled={loading} size="sm">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !insight ? (
          <p className="text-sm text-gray-600 animate-pulse">
            Analyzing your data with AI...
          </p>
        ) : insight ? (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{insight}</div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Click the button to generate AI-powered insights based on your
            current dashboard data.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
