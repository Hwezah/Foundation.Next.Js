// import { strokeColor } from "./App";
"use client";
import { useSearch } from "./SearchContext";
import { VideoEmbed } from "@/app/_components/SermonsList";
// import FoundationUtilities from "./FoundationUtilities";
import Bible from "./Bible";
import React, { memo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Image from "next/image";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import { fetchHeroSuggestions } from "../_lib/apis/fetchHeroSuggestions";

function Hero() {
  const { selectedVideo, recentQueries, setQuery } = useSearch(); // Get recentQueries and setQuery
  const [showBiblePanel, setShowBiblePanel] = useState(false);
  const [currentRecentQueryIndex, setCurrentRecentQueryIndex] = useState(0);
  const [heroSuggestion, setHeroSuggestion] = useState(null); // Renamed for clarity, stores suggestion data
  const [isLoadingHeroBg, setIsLoadingHeroBg] = useState(false);
  const autoSlideIntervalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // This effect will fetch suggestions based on the current recent query index
    if (recentQueries && recentQueries.length > 0) {
      const currentQuery = recentQueries[currentRecentQueryIndex];
      if (currentQuery) {
        setIsLoadingHeroBg(true);
        setHeroSuggestion(null); // Clear previous suggestion

        // fetchHeroSuggestions(currentQuery)
        //   .then((data) => {
        //     console.log("Hero suggestion data:", data);
        //     setHeroSuggestion(data);
        //   })
        //   .catch((err) => {
        //     console.error("Error fetching hero suggestion:", err);
        //     setHeroSuggestion(null); // Clear on error
        //   })
        //   .finally(() => setIsLoadingHeroBg(false));
      }
    } else {
      setHeroSuggestion(null); // No recent queries
    }
  }, [recentQueries, currentRecentQueryIndex]); // Re-fetch when recent queries or index changes

  const advanceToNextQuery = () => {
    setCurrentRecentQueryIndex((prevIndex) =>
      prevIndex === recentQueries.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    // Auto-slide functionality
    if (recentQueries && recentQueries.length > 1 && !selectedVideo) {
      autoSlideIntervalRef.current = setInterval(() => {
        advanceToNextQuery();
      }, 5000); // Change image every 5 seconds
    }

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [recentQueries, selectedVideo]); // Re-initialize interval if recentQueries change or video is selected/deselected

  const resetAutoSlideTimer = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    if (recentQueries && recentQueries.length > 1 && !selectedVideo) {
      autoSlideIntervalRef.current = setInterval(advanceToNextQuery, 5000);
    }
  };

  const handleRecentSearchClick = (clickedQuery) => {
    setQuery(clickedQuery); // Update the context query
    router.push(`/?query=${encodeURIComponent(clickedQuery)}&selected=Sermons`);
  };

  const handleNextRecentQuery = () => {
    advanceToNextQuery();
    resetAutoSlideTimer();
  };

  const handlePrevRecentQuery = () => {
    setCurrentRecentQueryIndex((prevIndex) =>
      prevIndex === 0 ? recentQueries.length - 1 : prevIndex - 1
    );
    resetAutoSlideTimer();
  };

  const thumbnails = heroSuggestion?.items?.[0]?.snippet?.thumbnails;
  let imageUrl = "/pexels-jibarofoto-13963623.jpg"; // Fallback

  if (thumbnails) {
    imageUrl =
      thumbnails.maxres?.url ||
      thumbnails.standard?.url ||
      thumbnails.high?.url ||
      imageUrl;
  }

  const backgroundStyle = { backgroundImage: `url(${imageUrl})` };

  return (
    <div
      className=" relative overflow-hidden h-full"
      onClick={(e) => {
        e.stopPropagation();
        handleRecentSearchClick(recentQueries[currentRecentQueryIndex]);
      }}
    >
      <div
        className={`bg-[#01212c] w-full sticky top-0 z-10
          xl:flex xl:justify-between items-start scrollbar-hidden overflow-hidden`}
      >
        {!selectedVideo ? (
          recentQueries && recentQueries.length > 0 ? (
            <div className="w-full relative group">
              {/* Image for the current recent query - covers the hero */}
              <div
                className={`w-full h-[70vh] bg-cover bg-center ${
                  isLoadingHeroBg ? "animate-pulse bg-gray-700" : ""
                }`}
                style={backgroundStyle}
              ></div>
              {/* Overlay for text and search button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4 cursor-pointer">
                <div className="absolute top-6 left-6">
                  {/* <h1 className="text-gray-300 text-2xl mb-2 font-black">
                    Foundation,
                  </h1> */}
                  <h3 className="text-white text-3xl md:text-4xl font-bold text-center mb-4 ml-10">
                    {recentQueries[currentRecentQueryIndex]}
                  </h3>
                </div>
              </div>

              {/* Carousel Arrows */}
              {recentQueries.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevRecentQuery();
                    }}
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-10 opacity-30 hover:bg-opacity-50 rounded-full transition-all  group-hover:opacity-100 hover:scale-110  duration-200"
                    aria-label="Previous recent search"
                  >
                    <HiChevronRight size={62} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextRecentQuery();
                    }}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hover:bg-opacity-50 rounded-full opacity-30 transition-all group-hover:opacity-100 hover:scale-110  duration-200"
                    aria-label="Next recent search"
                  >
                    <HiChevronLeft size={62} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="w-full relative">
              <Image
                className="object-cover object-center "
                fill
                priority
                src="/pexels-jibarofoto-13963623.jpg"
                alt="Foundation"
              />
            </div>
          )
        ) : (
          <div className="w-full aspect-video">
            <VideoEmbed
              className=" shadow-none rounded-none w-full h-full object-cover "
              videoId={selectedVideo.id.videoId}
              title={selectedVideo.snippet.title}
            />
          </div>
        )}
      </div>
      {/* Sliding Panel (FoundationUtilities from left) */}
      <div
        className={`absolute top-0 right-0 h-full z-20 bg-[#01212c]
          transition-transform duration-300 ease-in-out transform
          ${showBiblePanel ? "translate-x-0" : "translate-x-full"}
          w-full sm:w-3/4 md:w-1/2 xl:w-[40%]
          overflow-y-auto scrollbar-hidden shadow-xl`}
      >
        {/* <FoundationUtilities /> */}
        <Bible />
      </div>
      {/* Toggle Button for the Panel */}
      <button
        className="absolute top-24 right-8 -translate-y-1/2 transform cursor-pointer z-30
          rounded-full p-2 opacity-30 hover:bg-opacity-100 hover:scale-110 
          transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          setShowBiblePanel((prev) => !prev);
        }}
        aria-label={
          showBiblePanel ? "Close utilities panel" : "Open utilities panel"
        }
      >
        {showBiblePanel ? (
          <BsArrowRightCircleFill size={62} />
        ) : (
          <BsArrowLeftCircleFill size={62} />
        )}
      </button>
    </div>
  );
}
export default memo(Hero);

{
  /* Original button for right panel - reference
      {showBiblePanel && (
        <div className="absolute top-0 right-0 z-70"> // z-70 was high
          <FoundationUtilities />
        </div>
      )}
<button
    className="absolute top-1/2 right-10 -translate-y-1/2 transform cursor-pointer"
    onClick={() => setShowBiblePanel((prev) => !prev)}
    >
    <BsArrowLeftCircleFill size={64} /> // Original icon and size
</button>
*/
}
