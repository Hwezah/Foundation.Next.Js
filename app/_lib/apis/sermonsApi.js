import React from "react";
import fetchData from "@/app/_lib/apis/api";
import SermonsList from "@/app/_components/SermonsList";
export default async function Sermons({ query }) {
  if (!query || query.trim() === "") {
    // Return an empty list or a message if the query is empty
    // return <div>Please enter a search term to find sermons.</div>;
    return <SermonsList videos={[]} />;
  }
  const API_KEY = "AIzaSyCNyHlY3nfI0eJYR7_xHTobtrRTX3puk94";
  //   const query = "your search"; // Replace or get from props/params
  const pageToken = ""; // Replace or get from props/params
  //   const API_KEY = "AIzaSyA_9QSamWQ-yBKdZCYbzI-ywkRy3fpGrWY";
  //   const API_KEY = "AIzaSyB-t8E-UrOC8CMTfpjLdMd7dZUejXvwx1c";
  //   const API_KEY = "AIzaSyCNyHlY3nfI0eJYR7_xHTobtrRTX3puk94";
  //    const API_KEY = "AIzaSyCyDM6zL56RjPY62zE30wi6TweFQXjCIYo";
  const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&maxResults=4&pageToken=${pageToken}&type=video&key=${API_KEY}`;
  try {
    const data = await fetchData(URL);
    const sermons = data.items || [];
    console.log("[Sermons API] Received query:", query); // Add this line
    return <SermonsList videos={sermons} />;
  } catch (error) {
    console.error("Error fetching sermons", error);
    return <div>Failed to load sermons.</div>;
  }
}
