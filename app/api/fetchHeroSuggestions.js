import fetchData from "@/app/api/api";

export async function fetchHeroSuggestions(query) {
  const API_KEY = "AIzaSyA_9QSamWQ-yBKdZCYbzI-ywkRy3fpGrWY";
  const pageToken = "";
  const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&maxResults=4&pageToken=${pageToken}&type=video&key=${API_KEY}`;
  const data = await fetchData(URL);
  console.log(data);
  return data;
}
