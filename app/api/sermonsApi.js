import React from "react";
import fetchData from "@/app/api/api";
import SermonsList from "@/app/_components/SermonsList";
export default async function Sermons({ query }) {
  if (!query || query.trim() === "") {
    // Return an empty list or a message if the query is empty
    // return <div>Please enter a search term to find sermons.</div>;
    return <SermonsList videos={[]} />;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const URL = `${baseUrl}/api/sermons?query=${encodeURIComponent(query)}`;
  try {
    const data = await fetchData(URL);
    console.log(data);
    const sermons = data.items || [];
    return (
      <SermonsList videos={sermons} initialNextPageToken={data.nextPageToken} />
    );
  } catch (error) {
    console.error("Error fetching sermons", error);
    return <div>Failed to load sermons.</div>;
  }
}
