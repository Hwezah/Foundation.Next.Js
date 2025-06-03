// This component is now a Server Component.
// React is still fine, but client-specific hooks/features like 'memo' are removed.
import React from "react";
import TrendingServer from "./TrendingServer";
import ContentBar from "./ContentBar.client"; // Import the extracted Client Component

export default function Trending({ searchParams = {} }) {
  const selected = searchParams.selected || "Sermons";
  const query = searchParams.query || "";

  return (
    <div>
      <div className="lg:pt-6 px-2 pt-6 xl:pb-1 xl:px-10 md:px-4 sm:px-2 lg:px-6 xl:pt-10">
        <span className="text-xl md:text-3xl font-black tracking-wide pb-1">
          {selected}.
        </span>
      </div>
      <ContentBar selected={selected} />{" "}
      {/* Use the imported ContentBar client component */}
      <TrendingServer selected={selected} query={query} />
      <div className="flex justify-center mt-4"></div>
    </div>
  );
}
