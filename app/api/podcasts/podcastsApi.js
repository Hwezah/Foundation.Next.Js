import PodcastsList from "@/app/_components/PodcastsList";
import fetchData from "@/app/api/api";

export default async function Podcasts({ query }) {
  if (!query) return <div>No query provided</div>;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const URL = `${baseUrl}/api/podcasts?query=${encodeURIComponent(query)}`; // Changed to uppercase 'P'

  try {
    const data = await fetchData(URL, { cache: "no-store" });
    console.log("Data:", data);
    const podcasts = data.results || [];
    return (
      <PodcastsList podcasts={podcasts} initialNextOffset={data.next_offset} />
    );
  } catch (error) {
    console.error("Error fetching podcasts", error);
    return (
      <div className="text-red-500 text-center">
        Failed to load podcasts due to an error ({error.message})
      </div>
    );
  }
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
