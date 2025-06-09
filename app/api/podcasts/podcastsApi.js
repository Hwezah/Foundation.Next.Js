import PodcastsList from "@/app/_components/PodcastsList";

async function fetchListenNotesPodcasts(query, offset = null) {
  const API_KEY = process.env.LISTEN_NOTES_API_KEY;
  if (!API_KEY) {
    console.error("LISTEN_NOTES_API_KEY is not set in environment variables.");
    throw new Error(
      "Server configuration error: LISTEN_NOTES_API_KEY is missing."
    );
  }

  // ListenNotes API default maxResults is 10.
  // Adjust parameters like `type`, `sort_by_date` as needed.
  let listenNotesApiUrl = `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(
    query
  )}&type=episode&sort_by_date=0&language=English`; // Added language for specificity

  if (offset) {
    // The API route /api/podcasts will handle subsequent offsets for pagination by the client.
    listenNotesApiUrl += `&offset=${offset}`;
  }

  try {
    const response = await fetch(listenNotesApiUrl, {
      headers: { "X-ListenAPI-Key": API_KEY },
      cache: "no-store", // Or your preferred caching strategy for server-side initial fetch
    });

    if (!response.ok) {
      let apiErrorContent = "";
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          apiErrorContent = errorData.message;
        } else if (errorData && Object.keys(errorData).length > 0) {
          // If there's an error body but no 'message' field, stringify it.
          // Avoids stringifying an empty object to "{}"
          apiErrorContent = JSON.stringify(errorData);
        }
      } catch (e) {
        // This catch is for when response.json() itself fails (e.g., not valid JSON, or empty response)
        apiErrorContent = "Could not parse error response body.";
      }

      const statusText = response.statusText || "No status text";
      let errorDetails = `Status ${response.status} (${statusText})`;
      if (apiErrorContent && apiErrorContent !== "{}") {
        // Don't append if it's just an empty stringified object
        errorDetails += `: ${apiErrorContent}`;
      }

      console.error("Listen Notes API Error (direct fetch):", errorDetails);
      throw new Error(
        `Failed to fetch podcasts from Listen Notes API: ${errorDetails}`
      );
    }
    return await response.json();
  } catch (error) {
    if (
      !(
        error.message.startsWith(
          "Failed to fetch podcasts from Listen Notes API"
        ) || error.message.startsWith("Server configuration error")
      )
    ) {
      console.error(
        "Error fetching podcasts directly from Listen Notes:",
        error
      );
    }
    throw error;
  }
}

export default async function Podcasts({ query }) {
  if (!query || query.trim() === "") {
    query = "Christian teachings"; // Default query if none provided
  }

  try {
    // Directly call the fetching logic for the initial load
    const data = await fetchListenNotesPodcasts(query); // Initial fetch, no offset
    const podcasts = data.results || [];
    return (
      <PodcastsList
        podcasts={podcasts}
        initialNextOffset={data.next_offset} // ListenNotes API uses 'next_offset'
        key={query} // Ensures the component re-renders if the query changes
        // listQuery={query} // PodcastsList.js uses context query for "load more"
      />
    );
  } catch (error) {
    console.error("Error preparing podcasts component:", error);
    return (
      <div className="text-red-500 text-center">
        Failed to load podcasts due to an error ({error.message})
      </div>
    );
  }
}
