"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const SearchContext = createContext();

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [selectedVideoObject, setSelectedVideoObject] = useState(null); // Stores the full video object for the Hero
  const [currentPlayingId, setCurrentPlayingId] = useState(null); // Stores only the ID of the playing video
  const [isFeedVisible, setIsFeedVisible] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [recentQueries, setRecentQueries] = useState([]); //helps store recent search queries
  const [activeHoverControllerIds, setActiveHoverControllerIds] = useState(
    new Set()
  );
  // isHeroMuted state is removed as isHeroControlledByHover will manage this.
  const [strokeColor, setStrokeColor] = useState("#000"); // default color

  useEffect(() => {
    try {
      const storedQueries = localStorage.getItem("recentSearches");
      if (storedQueries) {
        setRecentQueries(JSON.parse(storedQueries));
      }
    } catch (e) {} // Handle potential localStorage errors
  }, []);

  function addRecentQuery(newQuery) {
    if (!newQuery || newQuery.trim() === "") return;
    const trimmedQuery = newQuery.trim();

    setRecentQueries((prevQueries) => {
      // Remove the new query if it already exists to avoid duplicates and move it to the front
      const filteredQueries = prevQueries.filter((q) => q !== trimmedQuery);
      const updatedQueries = [trimmedQuery, ...filteredQueries].slice(0, 5); // Keep only the latest 5
      localStorage.setItem("recentSearches", JSON.stringify(updatedQueries));
      return updatedQueries;
    });
  }

  function setCurrentlyPlayingVideo(video) {
    if (video && video.id && video.id.videoId) {
      setCurrentPlayingId(video.id.videoId);
      setSelectedVideoObject(video);
    } else {
      // If null or invalid video is passed, clear both
      setCurrentPlayingId(null);
      setSelectedVideoObject(null);
    }
  }

  function addActiveHoverControllerId(videoId) {
    setActiveHoverControllerIds((prev) => {
      if (prev.has(videoId)) {
        return prev; // Return previous Set instance if ID already exists
      }
      return new Set(prev).add(videoId); // Create new Set only if ID is new
    });
  }

  function removeActiveHoverControllerId(videoId) {
    setActiveHoverControllerIds((prev) => {
      if (!prev.has(videoId)) {
        return prev; // Return previous Set instance if ID doesn't exist
      }
      const next = new Set(prev);
      next.delete(videoId);
      return next;
    });
  }

  const isHeroControlledByHover = activeHoverControllerIds.size > 0;

  const value = useMemo(
    () => ({
      query,
      setQuery,
      playingVideoId: currentPlayingId, // Expose the ID
      setCurrentlyPlayingVideo, // Expose the new setter
      isFeedVisible,
      setIsFeedVisible,
      recentQueries, // Expose recent queries
      addRecentQuery, // Expose function to add queries
      error,
      setError,
      isLoading,
      setIsLoading,
      strokeColor,
      setStrokeColor,
      addActiveHoverControllerId, // Expose functions to manage hover controllers
      removeActiveHoverControllerId,
      isHeroControlledByHover, // Expose derived state for hero control
      selectedVideo: selectedVideoObject, // Keep selectedVideo for Hero
      // setSelectedVideo: setSelectedVideoObject, // Keep if direct setting is needed elsewhere
    }),
    [
      query,
      selectedVideoObject,
      currentPlayingId,
      isFeedVisible,
      error,
      isLoading,
      strokeColor,
      recentQueries,
      activeHoverControllerIds, // Add activeHoverControllerIds to dependency array
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
