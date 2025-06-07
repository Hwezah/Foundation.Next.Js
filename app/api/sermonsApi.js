import React from "react";
import fetchData from "@/app/api/api";
import SermonsList from "@/app/_components/SermonsList";
export default async function Sermons({ query }) {
  if (!query || query.trim() === "") {
    query = "Bible study essentials";
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const URL = `${baseUrl}/api/sermons?query=${encodeURIComponent(query)}`;
  try {
    const data = await fetchData(URL); // Ensure this fetch is not cached
    console.log(data);
    const sermons = data.items || [];
    return (
      <SermonsList
        videos={sermons}
        initialNextPageToken={data.nextPageToken}
        key={query} // Add the query as a key
        listQuery={query} // Pass the effective query used for this list
      />
    );
  } catch (error) {
    console.error("Error fetching sermons", error);
    return <div>Failed to load sermons.</div>;
  }
}
