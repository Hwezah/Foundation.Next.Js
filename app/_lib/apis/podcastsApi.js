import PodcastsList from "@/app/_components/PodcastsList";
import fetchData from "@/app/_lib/apis/api";
export default async function Podcasts({ query }) {
  if (!query) return []; // Return an empty array if no query is provided
  // const API_KEY = "5499e7a41f314beaab46610580e99eaf";
  // const API_KEY = "8bdff6c6a5a94d2d9f43c1ad32b5d19e";
  // const API_KEY = "f6402a826907452d912101ce2e4addf0";

  const API_KEY = "f6402a826907452d912101ce2e4addf0";
  const URL = `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(
    query
  )}&type=episode&sort_by_date=1&len_min=0&len_max=0&only_in=title,query,fulltext&&safe_mode=0&offset=${offset}&page_size=2`;

  try {
    const endpoint = {
      headers: {
        "X-ListenAPI-Key": API_KEY,
      },
    };

    const data = await fetchData(URL, endpoint);
    podcasts = data.results || [];
  } catch (error) {
    console.error("not fetching Podcasts", error);
    throw new Error(error.message);
  }
  return <PodcastsList podcasts={podcasts} />;
}

// Fetch and set podcasts
// async function fetchAndSetPodcasts(query, offset = 0, append = false) {
//   try {
//     dispatch({ type: "LOADING" });
//     dispatch({ type: "REJECTED", payload: "" });

//     const results = await PodcastsApi(query, offset);
//     const nextOffset = offset + 2; // 4 = page_size
//     localStorage.setItem("nextPage", nextOffset); // Update next page offset in localStorage

//     setPodcasts((prev) => {
//       if (append) {
//         const existingIds = new Set(prev.map((p) => p.id));
//         const newUnique = results.filter((p) => !existingIds.has(p.id));
//         return [...prev, ...newUnique];
//       } else {
//         return results;
//       }
//     });
//   } catch (error) {
//     dispatch({ type: "REJECTED", payload: error.message });
//   } finally {
//     dispatch({ type: "LOADED" });
//   }
// }

// // Initial fetch when query changes
// useEffect(() => {
//   if (!query || typeof query !== "string" || query.trim() === "") {
//     return;
//   }

//   localStorage.setItem("nextPage", 4); // Set initial next page offset
//   fetchAndSetPodcasts(query, 0, false); // Fetch and set the first set of podcasts
// }, [query, dispatch]);

// Load more podcasts
// async function handleLoadMorePodcasts() {
//   const nextPage = parseInt(localStorage.getItem("nextPage"), 10); // Parse offset from localStorage

//   if (!query || query.trim() === "") {
//     dispatch({
//       type: "REJECTED",
//       payload: "Please enter a valid search term.",
//     });
//     return;
//   }

//   if (!isNaN(nextPage)) {
//     await fetchAndSetPodcasts(query, nextPage, true); // true = append results
//   } else {
//     dispatch({ type: "REJECTED", payload: "No more results" });
//   }
// }
