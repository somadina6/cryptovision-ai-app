import { NextRequest, NextResponse } from "next/server";
import { openai, redis, CACHE_DURATIONS } from "@/utils/clients";
import { getUserIdFromToken } from "@/utils/auth/auth.utils";

export async function POST(request: NextRequest) {
  try {
    // Get userId from token
    const { error, userId } = await getUserIdFromToken(request);
    if (error || !userId) {
      throw new Error("Unauthorized");
    }

    const { tokens } = await request.json();

    // Create cache key using userId 
    const cacheKey = `portfolio_analysis:${userId}`;

    // Try to get cached analysis
    const cachedAnalysis = await redis.get(cacheKey);
    if (cachedAnalysis) {
      return NextResponse.json(cachedAnalysis);
    }

    // Format portfolio data for analysis
    const portfolioSummary = tokens.map((token: any) => ({
      name: token.token.name,
      symbol: token.token.symbol,
      amount: token.amount,
      currentPrice: token.token.current_price,
      value: token.amount * token.token.current_price,
      priceChange24h: token.token.price_change_percentage_24h,
      athPrice: token.token.ath,
    }));

    // Calculate portfolio metrics
    const totalValue = portfolioSummary.reduce(
      (sum: number, token: any) => sum + token.value,
      0
    );
    const topHoldings = portfolioSummary
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);

    // Create prompt for AI analysis
    const prompt = `As a crypto portfolio advisor, analyze this portfolio and provide 3-4 specific recommendations:

Portfolio Overview:
Total Value: $${totalValue.toLocaleString()}
Number of Assets: ${portfolioSummary.length}

Top Holdings:
${topHoldings
  .map(
    (token: any) =>
      `${token.name} (${token.symbol}): $${token.value.toLocaleString()} (${(
        (token.value / totalValue) *
        100
      ).toFixed(2)}% of portfolio)`
  )
  .join("\n")}

Full Portfolio:
${portfolioSummary
  .map(
    (token: any) =>
      `${token.name}: ${token.amount} tokens, Current Price: $${
        token.currentPrice
      }, 24h Change: ${token.priceChange24h.toFixed(2)}%, ATH: $${
        token.athPrice
      }`
  )
  .join("\n")}

Provide recommendations focusing on:
1. Portfolio diversification
2. Risk management
3. Potential rebalancing needs
4. Market opportunities

Format recommendations as a JSON array of strings.`;

    // Get AI analysis
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional crypto portfolio advisor. Provide clear, actionable recommendations based on portfolio analysis. Return only a JSON array of recommendation strings.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    // Parse recommendations from AI response
    if (!completion.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }
    const response = JSON.parse(completion.choices[0].message.content);
    const analysisResult = {
      recommendations: response.recommendations || [],
      timestamp: new Date().toISOString(),
    };

    // Cache the analysis with user-specific key
    await redis.set(cacheKey, analysisResult, {
      ex: CACHE_DURATIONS.PORTFOLIO_ANALYSIS,
    });

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Portfolio analysis error:", error);
    return NextResponse.json(
      {
        recommendations: [
          "Unable to analyze portfolio at this time. Please try again later.",
        ],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

