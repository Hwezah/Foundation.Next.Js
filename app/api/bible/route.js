import { NextResponse } from "next/server";

const EXTERNAL_BIBLE_API_URL = "https://api.scripture.api.bible/v1/bibles";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpointPath = searchParams.get("endpointPath");

  if (!endpointPath) {
    return NextResponse.json(
      { error: "endpointPath parameter is required" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.BIBLE_API_KEY;

  if (!API_KEY) {
    console.error("BIBLE_API_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error. API key missing." },
      { status: 500 }
    );
  }

  const fullExternalUrl = `${EXTERNAL_BIBLE_API_URL}${endpointPath}`;

  try {
    const externalResponse = await fetch(fullExternalUrl, {
      method: "GET",
      headers: { "api-key": API_KEY },
      cache: "no-store", // Or configure caching as needed
    });

    if (!externalResponse.ok) {
      const errorData = await externalResponse.json();
      console.error("External Bible API Error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to fetch data from external Bible API",
          details: errorData,
        },
        { status: externalResponse.status }
      );
    }

    const data = await externalResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/bible route:", error);
    return NextResponse.json(
      {
        error: "Internal server error while fetching Bible data.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
