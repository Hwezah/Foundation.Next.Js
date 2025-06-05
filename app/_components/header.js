"use client";
import UserDashboard from "./UserDashboard";

import { useSearch } from "./SearchContext";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between lg:p-4 p-2.5  w-full xl:px-10 md:px-4 sm:px-2 lg:px-6">
        <div className="flex items-center">
          {/* <Image
            src="Assets\FoundationLogoWhite.svg"
            alt="Foundation Logo"
            fill
            className="w-[74px] hidden lg:block  object-cover"
          /> */}
          <h1
            className={`xl:text-4xl md:text-3xl text-2xl font-black ${
              showSearch ? "hidden sm:block" : "block"
            }`}
          >
            Foundation.
          </h1>
        </div>
        <div className="flex items-center justify-between lg:gap-4 gap-1.5 ">
          <SearchBar showSearch={showSearch} setShowSearch={setShowSearch} />
          <UserDashboard
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        </div>
      </div>
    </>
  );
}
function SearchBar({ showSearch, setShowSearch }) {
  const { query, setQuery, addRecentQuery } = useSearch(); // Use query and setQuery from context
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleSearchSubmit = useCallback(() => {
    const selectedCategory = currentSearchParams.get("selected") || "Sermons";
    const trimmedQuery = query ? query.trim() : "";

    // Preserve existing search params and update query and selected
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set("selected", selectedCategory);

    if (trimmedQuery) {
      params.set("query", trimmedQuery);
    } else {
      params.delete("query"); // Remove query param if it's empty
    }

    addRecentQuery(trimmedQuery);
    router.push(`/?${params.toString()}`);
    router.refresh(); // Add this line to refresh server components

    // Only hide search bar if it was specifically shown for small screens
    if (isSmallScreen) {
      setShowSearch(false);
    }
  }, [
    query,
    router,
    currentSearchParams,
    setShowSearch,
    addRecentQuery,
    isSmallScreen,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Set breakpoint at 768px for small screens
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Run once on mount

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        handleSearchSubmit(); // Perform search
      }}
      className="relative flex items-center md:block rounded-lg"
    >
      {/* Button for small screens */}

      <button
        type="submit" // Changed to submit
        onClick={(e) => {
          if (isSmallScreen && !showSearch) {
            e.preventDefault(); // Prevent submission
            setShowSearch(true); // Just show the input
            // On next click, or if !isSmallScreen, or if showSearch is true,
            // the default submit action will trigger the form's onSubmit
          }
        }}
        className={`absolute top-1/2 -translate-y-1/2 rounded-full text-white transition ${
          showSearch ? "right-2" : "right-1"
        } md:right-6`}
      >
        <HiMiniMagnifyingGlass className="w-6 h-6" />
      </button>

      {/* Full search bar */}
      <input
        value={query || ""}
        onChange={(e) => setQuery(e.target.value)}
        className={`flex xl:w-[350px] rounded-full bg-[#01222e] px-6 py-1.5 sm:py-2.5 xl:py-3 transition-all duration-300 md:focus:w-[400px] font-bold text-gray-500 focus:outline-none ${
          showSearch ? "block" : "hidden"
        } md:block`}
        placeholder="Search Foundation..."
      />
    </form>
  );
}
