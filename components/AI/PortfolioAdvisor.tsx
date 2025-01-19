"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AnalysisResponse {
  recommendations: string[];
  timestamp: string;
}

export default function PortfolioAdvisor() {
  const { userTokens } = useAppSelector((state) => state.token);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const analyzePortfolio = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<AnalysisResponse>(
        "/api/ai/portfolio-analysis",
        { tokens: userTokens }
      );
      setRecommendations(response.data.recommendations);
      setLastUpdated(response.data.timestamp);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userTokens && userTokens.length > 0) {
      analyzePortfolio();
    }
  }, [userTokens]);

  return (
    <Card className="bg-gradient-to-br from-background to-muted/50 ">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>AI Portfolio Insights</CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(lastUpdated))} ago
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={analyzePortfolio}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 flex-grow" />
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {recommendations.map((rec, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 ">
                  <div className="p-4 rounded-lg bg-secondary h-full">
                    <p className="text-sm leading-relaxed">
                      {rec.replace(/^\d\s*\./, "")}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">
            No recommendations available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
