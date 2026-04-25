"use client";
import { useEffect, useState } from "react";
import SermonsList from "@/app/_components/SermonsList";
import Spinner from "@/app/_components/Spinner";

const LAST_SEARCHED_QUERY_KEY = "sermons_last_searched_query";
const DEFAULT_QUERY = "Jesus";

type SermonsProps = {
  query?: string;
};

type SermonsData = {
  items?: any[] 
  nextPageToken?: string
}
export default function Sermons({ query: queryFromProp }: SermonsProps) {
  const [effectiveQuery, setEffectiveQuery] = useState<string | undefined>(undefined);
  const [sermonsData, setSermonsData] = useState<SermonsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (!isClientMounted) return;

    const determineQuery = () => {
      const trimmedProp = queryFromProp?.trim();

      if (trimmedProp !== undefined) {
        return trimmedProp;
      }

      try {
        const storedQuery = localStorage
          .getItem(LAST_SEARCHED_QUERY_KEY)
          ?.trim();

        if (storedQuery) {
          return storedQuery;
        }
      } catch (e) {
        console.error("SermonsApi: Error accessing localStorage", e);
      }

      return DEFAULT_QUERY;
    };

    const newQuery = determineQuery();
    setEffectiveQuery(newQuery);
  }, [queryFromProp, isClientMounted]);

  useEffect(() => {
    if (!isClientMounted || !effectiveQuery || !effectiveQuery.trim()) {
      if (effectiveQuery === "" && isClientMounted) {
        setIsLoading(false);
        setSermonsData(null);
        setError(null);
      }
      return;
    }

    const trimmedQuery = effectiveQuery.trim();
    let isCancelled = false;

    const fetchSermons = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/sermons?query=${encodeURIComponent(trimmedQuery)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          let msg = `API error: ${res.status}`;
          try {
            const data = await res.json();
            msg = data.error || data.details || msg;
          } catch {}
          throw new Error(msg);
        }

        const data = await res.json();
        if (isCancelled) return;

        setSermonsData(data);

        const firstItem = data?.items?.[0];
        const thumbnailUrl =
          firstItem?.snippet?.thumbnails?.maxres?.url ||
          firstItem?.snippet?.thumbnails?.standard?.url ||
          firstItem?.snippet?.thumbnails?.high?.url;

        if (thumbnailUrl) {
          localStorage.setItem(`hero_image_${trimmedQuery}`, thumbnailUrl);
          localStorage.setItem(LAST_SEARCHED_QUERY_KEY, trimmedQuery);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Error fetching sermons:", err);
          const message = err instanceof Error ? err.message : "Unknown error";
          setError(message || "Something went wrong");
          setSermonsData(null);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchSermons();

    return () => {
      isCancelled = true;
    };
  }, [effectiveQuery, isClientMounted]);

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner />
        <p>Loading sermons for &quot;{effectiveQuery}&quot;...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load sermons: {error}
        {effectiveQuery && <p>(Searched for: &quot;{effectiveQuery}&quot;)</p>}
      </div>
    );
  }

  if (!effectiveQuery?.trim()) {
    return (
      <div className="text-center p-4 text-gray-500">
        Enter a search term to find sermons.
      </div>
    );
  }

  if (sermonsData && sermonsData.items && sermonsData.items.length > 0) {
    return (
      <SermonsList
        videos={sermonsData.items}
        initialNextPageToken={sermonsData.nextPageToken}
        key={effectiveQuery}
        listQuery={effectiveQuery}
      />
    );
  }

  if (sermonsData && sermonsData.items?.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No sermons found for &quot;{effectiveQuery}&quot;.
      </div>
    );
  }

  return (
    <div className="text-center p-4 text-gray-400">
      No sermons to display...Try a different search.
    </div>
  );
}