"use client";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type SearchContextType = {
  playingVideoId: string | null
  setCurrentlyPlayingVideo: (video: any) => void
  isFeedVisible: boolean
  setIsFeedVisible: (visible: boolean) => void
  recentQueries: string[]
  addRecentQuery: (query: string) => void
  error: string | null
  setError: (error: string | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  strokeColor: string
  setStrokeColor: (color: string) => void
  addActiveHoverControllerId: (id: string) => void
  removeActiveHoverControllerId: (id: string) => void
  isHeroControlledByHover: boolean
  selectedVideo: any | null
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}

export function SearchProvider({ children }: {
  children: ReactNode
}) {
  const [selectedVideoObject, setSelectedVideoObject] = useState<Video | null>(null); 
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null); 
  const [isFeedVisible, setIsFeedVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [recentQueries, setRecentQueries] = useState<string[]>([]); 
  const [activeHoverControllerIds, setActiveHoverControllerIds] = useState(
    new Set(),
  );
  
  const [strokeColor, setStrokeColor] = useState("#000"); 

  useEffect(() => {
    try {
      const storedQueries = localStorage.getItem("recentSearches");
      if (storedQueries) {
        setRecentQueries(JSON.parse(storedQueries));
      }
    } catch (e) {} 
  }, []);

  function addRecentQuery(newQuery: string) {
    if (!newQuery || newQuery.trim() === "") return;
    const trimmedQuery = newQuery.trim();

    setRecentQueries((prevQueries: string[]) => {
     
      const filteredQueries = prevQueries.filter((q) => q !== trimmedQuery);
      const updatedQueries = [trimmedQuery, ...filteredQueries].slice(0, 5); 
      localStorage.setItem("recentSearches", JSON.stringify(updatedQueries));
      return updatedQueries;
    });
  }
  type Video = {
    id?: { videoId?: string }
    
  }
  
 
  function setCurrentlyPlayingVideo(video: Video | null) {
    if (video && video.id && video.id.videoId) {
      setCurrentPlayingId(video.id.videoId);
      setSelectedVideoObject(video);
    } else {
      
      setCurrentPlayingId(null);
      setSelectedVideoObject(null);
    }
  }

  function addActiveHoverControllerId(videoId: string) {
    setActiveHoverControllerIds((prev) => {
      if (prev.has(videoId)) {
        return prev; 
      }
      return new Set(prev).add(videoId); 
    });
  }

  function removeActiveHoverControllerId(videoId: string) {
    setActiveHoverControllerIds((prev) => {
      if (!prev.has(videoId)) {
        return prev; 
      }
      const next = new Set(prev);
      next.delete(videoId);
      return next;
    });
  }

  const isHeroControlledByHover = activeHoverControllerIds.size > 0;

  const value = useMemo(
    () => ({
      playingVideoId: currentPlayingId, 
      setCurrentlyPlayingVideo, 
      isFeedVisible,
      setIsFeedVisible,
      recentQueries, 
      addRecentQuery, 
      error,
      setError,
      isLoading,
      setIsLoading,
      strokeColor,
      setStrokeColor,
      addActiveHoverControllerId, 
      removeActiveHoverControllerId,
      isHeroControlledByHover, 
      selectedVideo: selectedVideoObject, 
    
    }),
    [
      selectedVideoObject,
      currentPlayingId,
      isFeedVisible,
      error,
      isLoading,
      strokeColor,
      recentQueries,
      activeHoverControllerIds, 
    ],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
