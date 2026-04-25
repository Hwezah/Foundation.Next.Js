import fetchData from "@/app/api/api";

export async function fetchHeroSuggestions(query: string): Promise<any> {

  const internalApiUrl = `/api/hero?query=${encodeURIComponent(query)}`;

  const data = await fetchData(internalApiUrl, "");
  return data;
}
