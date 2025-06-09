import SermonsList from "@/app/_components/SermonsList";

async function fetchYouTubeSermons(query, pageToken = null) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    console.error("YOUTUBE_API_KEY is not set in environment variables.");
    throw new Error("Server configuration error: YOUTUBE_API_KEY is missing.");
  }

  let youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&maxResults=4&type=video&key=${API_KEY}`; // DIAGNOSTIC: Temporarily reduce to 1 result

  if (pageToken) {
    youtubeApiUrl += `&pageToken=${pageToken}`;
  }

  try {
    const youtubeResponse = await fetch(youtubeApiUrl, {
      cache: "no-store",
    });

    if (!youtubeResponse.ok) {
      let errorDetails = "Unknown YouTube API error";
      try {
        const errorData = await youtubeResponse.json();
        errorDetails = errorData.error?.message || JSON.stringify(errorData);
      } catch (e) {
        errorDetails = `Status: ${youtubeResponse.status}, StatusText: ${youtubeResponse.statusText}`;
      }
      console.error("YouTube API Error (direct fetch):", errorDetails);
      throw new Error(
        `Failed to fetch sermons from YouTube API: ${errorDetails}`
      );
    }
    return await youtubeResponse.json();
  } catch (error) {
    if (
      !(
        error.message.startsWith("Failed to fetch sermons from YouTube API") ||
        error.message.startsWith("Server configuration error")
      )
    ) {
      console.error("Error fetching sermons directly from YouTube:", error);
    }
    throw error;
  }
}

export default async function Sermons({ query }) {
  if (!query || query.trim() === "") {
    query = "Bible study essentials";
  }

  try {
    // Directly call the fetching logic instead of an internal HTTP request
    const data = await fetchYouTubeSermons(query); // Initial fetch, no pageToken
    const sermons = data.items || [];
    return (
      <SermonsList
        videos={sermons}
        initialNextPageToken={data.nextPageToken}
        key={query} // Add the query as a key
        listQuery={query} // Pass the effective query used for this list
      />
    );
  } catch (error) {
    console.error("Error preparing sermons component", error);
    return (
      <div className="text-red-500 text-center">
        Failed to load sermons due to an error ({error.message})
      </div>
    );
  }
}
