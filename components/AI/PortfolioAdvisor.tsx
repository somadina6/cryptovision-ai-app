"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useTokens from "@/lib/useTokens";
import axios from "axios";
import { useState, useEffect } from "react";

export default function PortfolioAdvisor() {
  const { tokens } = useTokens();
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const analyzePortfolio = async () => {
    try {
      const response = await axios.post("/api/ai/portfolio-analysis", {
        tokens,
      });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    }
  };

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      analyzePortfolio();
    }
  }, [tokens]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Portfolio Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span>🤖</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
