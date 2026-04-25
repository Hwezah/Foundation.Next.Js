import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const offset = searchParams.get("offset"); // Get pageToken from client

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.LISTEN_NOTES_API_KEY;

 
  if (!API_KEY) {
    console.error("PODCAST_API_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error. API key missing." },
      { status: 500 }
    );
  }

  // Construct the base URL
  let podcastApiUrl = `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(
    query
  )}&type=episode&sort_by_date=1&len_min=0&len_max=0&only_in=title,query,fulltext&safe_mode=0&page_size=4`; // Set your desired maxResults. It was 4 in sermonsApi.js, now 2.

  // Conditionally add pageToken if it exists
  if (offset) {
    podcastApiUrl += `&offset=${offset}`;
  }

  try {
    const podcastResponse = await fetch(podcastApiUrl, {
      headers: { "X-ListenAPI-Key": API_KEY },
    });
    if (!podcastResponse.ok) {
      const errorData = await podcastResponse.json();
      console.error("Podcast API Error (podcasts):", errorData);
      // Send a more structured error response to the client
      return NextResponse.json(
        {
          error: "Failed to fetch podcasts from Podcast API",
          details:
            errorData.message ||
            errorData.error?.message ||
            podcastResponse.statusText ||
            "Unknown Podcasts API error",
        },
        { status: podcastResponse.status }
      );
    }

    const data = await podcastResponse.json();
    return NextResponse.json(data); // Send the successfully fetched data to the client
  } catch (error) {
    console.error("Error in /api/podcasts route:", error);
    // Send a generic server error response
    return NextResponse.json(
      {
        error: "Internal server error while fetching podcasts.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
