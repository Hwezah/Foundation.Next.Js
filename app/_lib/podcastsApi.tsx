console.log("*** PODCASTS API FILE LOADED ***");
import PodcastsList from "@/app/_components/PodcastsList";


type PodcastEpisode = {
  id: string;
  title: string;
  audio: string;
  thumbnail: string;
  description: string;
};

type ListenNotesErrorType = {
  message?: string;
};
async function fetchListenNotesPodcasts(query: string, offset: number | null = null): Promise<{
  results: PodcastEpisode[];
  next_offset: number;
}> {

  const rawKey = process.env.LISTEN_NOTES_API_KEY;

  if (!rawKey) {
    throw new Error("LISTEN_NOTES_API_KEY is missing");
  }
  
  const API_KEY = rawKey;

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
  )}&type=episode&sort_by_date=0&language=English&page_size=4`; 

  if (offset) {
    listenNotesApiUrl += `&offset=${offset}`;
  }

  try {
    const response = await fetch(listenNotesApiUrl, {
      headers: { "X-ListenAPI-Key": API_KEY },
      cache: "no-store", 
    });

    if (!response.ok) {
      let apiErrorContent = "";
      try {
        const errorData = (await response.json()) as ListenNotesErrorType;
        if (errorData && errorData.message) {
          apiErrorContent = errorData.message;
        } else if (errorData && Object.keys(errorData).length > 0) {
        
          apiErrorContent = JSON.stringify(errorData);
        }
      } catch (e) {
      
        apiErrorContent = "Could not parse error response body.";
      }

      const statusText = response.statusText || "No status text";
      let errorDetails = `Status ${response.status} (${statusText})`;
      if (apiErrorContent && apiErrorContent !== "{}") {
     
        errorDetails += `: ${apiErrorContent}`;
      }

      console.error("Listen Notes API Error (direct fetch):", errorDetails);
      throw new Error(
        `Failed to fetch podcasts from Listen Notes API: ${errorDetails}`
      );
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
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
  
    console.error("Unknown error:", error);
    throw error;
  }
}

export default async function Podcasts({ query }: {
  query?: string;
}) {
  if (!query || query.trim() === "") {
    query = "Christian teachings"; 
  }

  try {
   
    const data = await fetchListenNotesPodcasts(query); 
    const podcasts = data.results || [];
    return (
      <PodcastsList
        podcasts={podcasts}
        initialNextOffset={data.next_offset} 
        key={query} 
      
      />
    );
  } catch (error) {
    console.error("Error preparing podcasts component:", error);
    const message =
    error instanceof Error ? error.message : "Unknown error";
    return (
      <div className="text-red-500 text-center">
        Failed to load podcasts due to an error ({message})
      </div>
    );
  }
}
