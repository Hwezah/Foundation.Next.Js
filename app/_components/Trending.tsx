// This component is now a Server Component.
// React is still fine, but client-specific hooks/features like 'memo' are removed.
import React from "react";
import ContentBar from "./ContentBar.client"; // Import the extracted Client Component
import Podcasts from "@/app/_lib/podcastsApi";
import Sermons from "@/app/_lib/sermonsApi";

export default async function Trending({ searchParams: rawSearchParams }) {
  // Await rawSearchParams if it's a promise, then default to an empty object if it's null/undefined.
  const searchParams =
    rawSearchParams && typeof rawSearchParams.then === "function"
      ? await rawSearchParams
      : rawSearchParams || {};
  const selected = searchParams.selected || "Sermons";
  const query = searchParams.query || "";

  return (
    <div>
      <div className="lg:pt-6 px-2 pt-6 xl:pb-1 xl:px-10 md:px-4 sm:px-2 lg:px-6 xl:pt-10">
        <span className="text-xl md:text-3xl font-black tracking-wide pb-1">
          {selected}.
        </span>
      </div>
      <ContentBar selected={selected} />
      {selected === "Podcasts" && <Podcasts query={query} />}
      {selected === "Sermons" && <Sermons query={query} />}
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import SermonsList from "@/app/_components/SermonsList";
// import Spinner from "@/app/_components/Spinner";

// const LAST_SEARCHED_QUERY_KEY = "sermons_last_searched_query";
// const DEFAULT_QUERY = "Jesus";

// export default function Sermons({ query: queryFromProp }) {
//   // Initialize effectiveQuery to undefined. It will be set by a client-side effect.
//   const [effectiveQuery, setEffectiveQuery] = useState(undefined);
//   const [sermonsData, setSermonsData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isClientMounted, setIsClientMounted] = useState(false);

//   // Set client mounted flag
//   useEffect(() => {
//     setIsClientMounted(true);
//   }, []);

//   // Determine effectiveQuery based on prop or localStorage (client-side only)
//   useEffect(() => {
//     if (!isClientMounted) {
//       // console.log("SermonsApi: Client not mounted yet, skipping query determination.");
//       return;
//     }
//     // console.log("SermonsApi: Client mounted, determining query source.");

//     const determineQuery = () => {
//       const trimmedProp = queryFromProp?.trim();
//       // If queryFromProp is provided (even if empty string), it takes precedence.
//       if (trimmedProp !== undefined) {
//         return trimmedProp;
//       }
//       try {
//         const storedQuery = localStorage
//           .getItem(LAST_SEARCHED_QUERY_KEY)
//           ?.trim();
//         if (storedQuery) {
//           // console.log(`SermonsApi: Using localStorage query: "${storedQuery}"`);
//           return storedQuery;
//         }
//       } catch (e) {
//         console.error("SermonsApi: Error accessing localStorage", e);
//       }
//       // console.log(`SermonsApi: Using DEFAULT_QUERY: "${DEFAULT_QUERY}"`);
//       return DEFAULT_QUERY;
//     };

//     const newQuery = determineQuery();
//     setEffectiveQuery(newQuery); // React handles not re-rendering if value is the same
//   }, [queryFromProp, isClientMounted]); // effectiveQuery removed from dependencies

//   useEffect(() => {
//     // Guard against running on server or if query is not yet determined/empty.
//     if (!isClientMounted || !effectiveQuery || !effectiveQuery.trim()) {
//       // If effectiveQuery is explicitly an empty string (but not undefined),
//       // ensure loading is false and data is cleared.
//       if (effectiveQuery === "" && isClientMounted) {
//         setIsLoading(false);
//         setSermonsData(null);
//         setError(null);
//       }
//       return;
//     }

//     const trimmedQuery = effectiveQuery.trim();
//     let isCancelled = false;

//     const fetchSermons = async () => {
//       setIsLoading(true);
//       setError(null);
//       // setSermonsData(null); // Optionally clear previous results immediately

//       try {
//         const res = await fetch(
//           `/api/sermons?query=${encodeURIComponent(trimmedQuery)}`,
//           {
//             cache: "no-store",
//           }
//         );

//         if (!res.ok) {
//           let msg = `API error: ${res.status}`;
//           try {
//             const data = await res.json();
//             msg = data.error || data.details || msg;
//           } catch {}
//           throw new Error(msg);
//         }

//         const data = await res.json();
//         if (isCancelled) return;
//         setSermonsData(data);

//         const firstItem = data?.items?.[0];
//         const thumbnailUrl =
//           firstItem?.snippet?.thumbnails?.maxres?.url ||
//           firstItem?.snippet?.thumbnails?.standard?.url ||
//           firstItem?.snippet?.thumbnails?.high?.url;

//         if (thumbnailUrl) {
//           localStorage.setItem(`hero_image_${trimmedQuery}`, thumbnailUrl);
//           localStorage.setItem(LAST_SEARCHED_QUERY_KEY, trimmedQuery);
//         }
//       } catch (err) {
//         if (!isCancelled) {
//           console.error("Error fetching sermons:", err);
//           setError(err.message || "Something went wrong");
//           setSermonsData(null);
//         }
//       } finally {
//         if (!isCancelled) setIsLoading(false);
//       }
//     };

//     fetchSermons();
//     return () => {
//       isCancelled = true;
//     };
//   }, [effectiveQuery, isClientMounted]); // Add isClientMounted to dependencies

//   // Show initializing state if client isn't mounted or query hasn't been determined
//   if (!isClientMounted || effectiveQuery === undefined) {
//     return (
//       <div className="text-center p-4">
//         <Spinner />
//         <p>Initializing search...</p>
//       </div>
//     );
//   }

//   // isLoading is true during active fetch for a valid query
//   if (isLoading) {
//     return (
//       <div className="text-center p-4">
//         <Spinner />
//         <p>Loading sermons for &quot;{effectiveQuery}&quot;...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-red-500 text-center p-4">
//         Failed to load sermons: {error}
//         {effectiveQuery && <p>(Searched for: &quot;{effectiveQuery}&quot;)</p>}
//       </div>
//     );
//   }

//   // Handle cases where effectiveQuery is an empty string (after trimming)
//   if (!effectiveQuery?.trim()) {
//     return (
//       <div className="text-center p-4 text-gray-500">
//         Enter a search term to find sermons.
//       </div>
//     );
//   }

//   if (sermonsData?.items?.length > 0) {
//     return (
//       <SermonsList
//         videos={sermonsData.items}
//         initialNextPageToken={sermonsData.nextPageToken}
//         key={effectiveQuery}
//         listQuery={effectiveQuery}
//       />
//     );
//   }

//   if (sermonsData && sermonsData.items?.length === 0) {
//     return (
//       <div className="text-center p-4 text-gray-500">
//         No sermons found for &quot;{effectiveQuery}&quot;.
//       </div>
//     );
//   }

//   return (
//     <div className="text-center p-4 text-gray-400">
//       No sermons to display...Try a different search.
//     </div>
//   );
// }
