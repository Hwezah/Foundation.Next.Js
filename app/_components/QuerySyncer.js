"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "./SearchContext";

export default function QuerySyncer() {
  const { query: contextQuery, setQuery: setContextQuery } = useSearch();
  const searchParams = useSearchParams();
  const prevSearchParamsString = useRef(searchParams.toString());
  const isInitialMount = useRef(true);

  useEffect(() => {
    const currentSearchParamsString = searchParams.toString();
    const urlQuery = searchParams.get("query");
    if (
      currentSearchParamsString !== prevSearchParamsString.current ||
      isInitialMount.current
    ) {
      if (urlQuery !== null) {
        // URL has a 'query' parameter
        if (urlQuery !== contextQuery) {
          setContextQuery(urlQuery);
        }
      } else {
        // URL does not have a 'query' parameter
        if (contextQuery !== "" && contextQuery !== null) {
          setContextQuery(""); // Clear context query
        }
      }
      prevSearchParamsString.current = currentSearchParamsString;
      if (isInitialMount.current) {
        isInitialMount.current = false;
      }
    }
  }, [searchParams, contextQuery, setContextQuery]);

  return null; // This component does not render anything visible
}
