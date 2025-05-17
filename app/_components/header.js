"use client";
import UserDashboard from "./UserDashboard";

import { useSearch } from "./SearchContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between lg:p-4 p-2.5  w-full xl:px-10 md:px-4 sm:px-2 lg:px-6">
        <div className="flex items-center">
          <Image
            src="public\Assets\FoundationLogoWhite.svg"
            alt="Foundation Logo"
            fill
            className="w-[74px] hidden lg:block  object-cover"
          />
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
  const { query, dispatch } = useSearch();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchQuery, setsearchQuery] = useState(query);

  function handleSearch() {
    if (!searchQuery || searchQuery.trim() === "") {
      dispatch({
        type: "REJECTED",
        payload: "Please enter a valid search term.",
      });
      return;
    }

    dispatch({ type: "SET_QUERY", payload: searchQuery });
    setShowSearch(false);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Set breakpoint at 768px for small screens
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        handleSearch(); // Perform search
      }}
      className="relative flex items-center md:block rounded-lg"
    >
      {/* Button for small screens */}

      <button
        type="button"
        onClick={() => {
          if (isSmallScreen) {
            if (!showSearch) {
              setShowSearch(true); // Open search bar
            } else {
              handleSearch(); // Already open, perform search
            }
          } else {
            handleSearch(); // Already open, perform search
          }
        }}
        className={`absolute top-1/2 -translate-y-1/2 rounded-full text-white transition ${
          showSearch ? "right-2" : "right-1"
        } md:right-6`}
      >
        <Link href="#">
          <HiMiniMagnifyingGlass className="w-6 h-6" />
        </Link>
      </button>

      {/* Full search bar */}
      <input
        value={searchQuery}
        onChange={(e) => setsearchQuery(e.target.value)}
        className={`flex xl:w-[350px] rounded-full bg-[#01222e] px-6 py-1.5 sm:py-2.5 xl:py-3 transition-all duration-300 md:focus:w-[400px] font-bold text-gray-500 focus:outline-none ${
          showSearch ? "block" : "hidden"
        } md:block`}
        placeholder="Search Foundation..."
      />
    </form>
  );
}
