import fetchData from "@/app/api/api";

export async function fetchHeroSuggestions(query) {
  // Construct the URL to your internal API route
  const internalApiUrl = `/api/hero?query=${encodeURIComponent(query)}`;
  // fetchData should be able to call your internal API endpoint
  const data = await fetchData(internalApiUrl);
  return data;
}
