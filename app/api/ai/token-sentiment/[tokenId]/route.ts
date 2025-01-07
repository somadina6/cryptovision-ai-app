import { NextResponse } from "next/server";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  try {
    // 1. Fetch news data
    const newsData = await axios.get(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTOPANIC_API_KEY}&currencies=${params.tokenId}&limit=10`
    );

    // 2. Extract relevant news information
    const news = newsData.data.results
      .map((item: any) => ({
        title: item.title,
        published_at: item.published_at,
        url: item.url,
      }))
      .slice(0, 5); // Take only latest 5 news items

    // 3. Create prompt for OpenAI
    const prompt = `Analyze the market sentiment for ${
      params.tokenId
    } based on these recent news headlines:

${news.map((n: any) => `- ${n.title}`).join("\n")}

Provide:
1. A sentiment score from -100 (extremely bearish) to +100 (extremely bullish)
2. A brief 2-3 sentence analysis explaining the sentiment.

Format your response exactly as follows:
SCORE: [number]
ANALYSIS: [your analysis]`;

    // 4. Get AI analysis
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a cryptocurrency market analyst expert. Provide concise, accurate market sentiment analysis based on news headlines.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_completion_tokens: 200,
    });

    // 5. Parse AI response
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }
    console.log(response);
    const [scoreStr, analysisStr] = response.split("\nANALYSIS:");
    const score = parseInt(scoreStr.replace("SCORE:", "").trim());
    const analysis = analysisStr.trim();

    return NextResponse.json({
      sentiment: {
        score: score,
        summary: analysis,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Sentiment analysis error:", error);

    // Fallback to neutral sentiment if API fails
    return NextResponse.json({
      sentiment: {
        score: 0,
        summary:
          "Unable to analyze sentiment at this time. Please try again later.",
        lastUpdated: new Date().toISOString(),
      },
    });
  }
}
