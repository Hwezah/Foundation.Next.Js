import { useState } from "react";
import { useSearch } from "./SearchContext";

import React, { memo } from "react";
import Podcasts from "./Podcasts";
import Sermons from "./Sermons";

function Trending() {
  const { query } = useSearch(); // Use context for shared state
  const [selectedsearchQuery, setSelectedsearchQuery] = useState("Sermons");

  return (
    <div>
      <div className="lg:pt-6 px-2 pt-6 xl:pb-1 xl:px-10 md:px-4 sm:px-2 lg:px-6 xl:pt-10">
        <span className="text-xl md:text-3xl font-black tracking-wide pb-1">
          {selectedsearchQuery}.
        </span>
      </div>
      <ContentBar
        selectedsearchQuery={selectedsearchQuery}
        setSelectedsearchQuery={setSelectedsearchQuery}
      />
      {selectedsearchQuery === "Podcasts" && <Podcasts query={query} />}
      {selectedsearchQuery === "Sermons" && <Sermons query={query} />}
      <div className="flex justify-center mt-4"></div>
    </div>
  );
}

export default memo(Trending);

function ContentBar({ selectedsearchQuery, setSelectedsearchQuery }) {
  const categories = [
    "Sermons",
    "Podcasts",
    "Music",
    "Bible Studies",
    "Prayer",
    "Live-feed",
    "Testimonies",
  ];
  return (
    <div className="flex pb-2 xl:pb-3 xl:px-10 md:px-4 sm:px-2 lg:px-6 overflow-x-auto  justify-between gap-4 text-sm lg:text-md font-bold scrollbar-hidden">
      {categories.map((searchQuery) => (
        <button
          key={searchQuery}
          onClick={() => setSelectedsearchQuery(searchQuery)}
          className={`${
            selectedsearchQuery === searchQuery
              ? "bg-[#78898b] text-[#01222e]"
              : "bg-[#01222e] text-[#78898b]"
          } px-2 py-1 lg:px-3 lg:py-1.5 rounded-sm whitespace-nowrap font-semibold`}
        >
          {searchQuery}
        </button>
      ))}
    </div>
  );
}
