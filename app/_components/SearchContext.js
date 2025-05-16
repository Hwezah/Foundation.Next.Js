"use client";
import { createContext, useContext, useMemo, useReducer } from "react";
import { strokeColor } from "./Constants";

const SearchContext = createContext();

const initialState = {
  query: "",
  selectedVideo: null,
  isFeedVisible: false,
  error: "",
  isLoading: false, // Added this line
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true }; // Added this line
    case "LOADED":
      return { ...state, isLoading: false }; // Added this line
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "SET_SELECTED_VIDEO":
      return { ...state, selectedVideo: action.payload };
    case "SET_IS_FEED_VISIBLE":
      return { ...state, isFeedVisible: !state.isFeedVisible };
    case "REJECTED":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

export function SearchProvider({ children }) {
  const [{ query, selectedVideo, isFeedVisible, error, isLoading }, dispatch] =
    useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      isFeedVisible,
      selectedVideo,
      query,
      isLoading,
      strokeColor,
      error,
      dispatch,
    }),
    [isFeedVisible, selectedVideo, query, isLoading, error]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
