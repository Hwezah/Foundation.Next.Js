"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { strokeColor } from "./Constants";

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

  // Optional: strokeColor and dispatch placeholders (since they're in the value)
  const [strokeColor, setStrokeColor] = useState("#000"); // default color
  // const dispatch = () => {}; // replace with actual logic if needed

  // Function to set the currently playing video
  // This will update both the ID for list highlighting and the object for the Hero
  const setCurrentlyPlayingVideo = (video) => {
    if (video && video.id && video.id.videoId) {
      setCurrentPlayingId(video.id.videoId);
      setSelectedVideoObject(video);
    } else {
      // If null or invalid video is passed, clear both
      setCurrentPlayingId(null);
      setSelectedVideoObject(null);
    }
  };

  const value = useMemo(
    () => ({
      query,
      setQuery,
      playingVideoId: currentPlayingId, // Expose the ID
      setCurrentlyPlayingVideo, // Expose the new setter
      isFeedVisible,
      setIsFeedVisible,
      error,
      setError,
      isLoading,
      setIsLoading,
      strokeColor,
      setStrokeColor,
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
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
