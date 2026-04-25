import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const pageToken = searchParams.get("pageToken"); // Get pageToken from client

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    console.error("YOUTUBE_API_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error. API key missing." },
      { status: 500 }
    );
  }

  // Construct the base URL
  let youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&maxResults=4&type=video&key=${API_KEY}`; // Set your desired maxResults to 4.

  // Conditionally add pageToken if it exists
  if (pageToken) {
    youtubeApiUrl += `&pageToken=${pageToken}`;
  }

  try {
    const youtubeResponse = await fetch(youtubeApiUrl, {
      cache: "no-store",
    });

    if (!youtubeResponse.ok) {
      const errorData = await youtubeResponse.json();
      console.error("YouTube API Error (sermons):", errorData);
      // Send a more structured error response to the client
      return NextResponse.json(
        {
          error: "Failed to fetch sermons from YouTube API",
          details: errorData.error?.message || "Unknown YouTube API error",
        },
        { status: youtubeResponse.status }
      );
    }

    const data = await youtubeResponse.json();
    return NextResponse.json(data); // Send the successfully fetched data to the client
  } catch (error) {
    console.error("Error in /api/sermons route:", error);
    // Send a generic server error response
    return NextResponse.json(
      {
        error: "Internal server error while fetching sermons.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
