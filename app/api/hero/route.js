// g:\foundation(Client..Next.js Refactor)\app\api\hero-suggestions\route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.YOUTUBE_API_KEY; // Access from environment variable

  if (!API_KEY) {
    console.error("YOUTUBE_API_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error. API key missing." },
      { status: 500 }
    );
  }

  const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&maxResults=1&type=video&key=${API_KEY}`; // maxResults=1 for a single hero suggestion

  try {
    const youtubeResponse = await fetch(youtubeApiUrl, { cache: "no-store" });
    if (!youtubeResponse.ok) {
      const errorData = await youtubeResponse.json();
      console.error("YouTube API Error (hero suggestions):", errorData);
      return NextResponse.json(
        {
          error: "Failed to fetch hero suggestions from YouTube API",
          details: errorData.error?.message || "Unknown YouTube API error",
        },
        { status: youtubeResponse.status }
      );
    }
    const data = await youtubeResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/hero-suggestions route:", error);
    return NextResponse.json(
      {
        error: "Internal server error while fetching hero suggestions.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
