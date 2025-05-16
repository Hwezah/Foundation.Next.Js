import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "./Services/useLocalStorage";
import { fetchData } from "./Services/api";
import { Loader } from "./loader";
import { useSearch } from "./SearchContext";
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiMiniArrowDownTray,
} from "react-icons/hi2";
import { AiOutlineReload } from "react-icons/ai";
export async function PodcastsApi(query, offset = 0) {
  if (!query) return []; // Return an empty array if no query is provided
  // const API_KEY = "5499e7a41f314beaab46610580e99eaf";
  // const API_KEY = "8bdff6c6a5a94d2d9f43c1ad32b5d19e";
  // const API_KEY = "f6402a826907452d912101ce2e4addf0";

  const API_KEY = "f6402a826907452d912101ce2e4addf0";
  const URL = `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(
    query
  )}&type=episode&sort_by_date=1&len_min=0&len_max=0&only_in=title,query,fulltext&&safe_mode=0&offset=${offset}&page_size=2`;

  try {
    const endpoint = {
      headers: {
        "X-ListenAPI-Key": API_KEY,
      },
    };

    const data = await fetchData(URL, endpoint);

    return data.results || [];
  } catch (error) {
    console.error("not fetching Podcasts", error);
    throw new Error(error.message);
  }
}

export default function Podcasts({ query }) {
  const { dispatch, isloading } = useSearch();
  const [podcasts, setPodcasts] = useLocalStorage([], "podcasts");
  const [playingPodcastId, setPlayingPodcastId] = useState(null);
  const [progress, setProgress] = useState({});
  const [isSeeking, setIsSeeking] = useState(false);
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);
  const audioRefs = useRef({}); // Store references to audio elements

  // Fetch and set podcasts
  async function fetchAndSetPodcasts(query, offset = 0, append = false) {
    try {
      dispatch({ type: "LOADING" });
      dispatch({ type: "REJECTED", payload: "" });

      const results = await PodcastsApi(query, offset);
      const nextOffset = offset + 2; // 4 = page_size
      localStorage.setItem("nextPage", nextOffset); // Update next page offset in localStorage

      setPodcasts((prev) => {
        if (append) {
          const existingIds = new Set(prev.map((p) => p.id));
          const newUnique = results.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newUnique];
        } else {
          return results;
        }
      });
    } catch (error) {
      dispatch({ type: "REJECTED", payload: error.message });
    } finally {
      dispatch({ type: "LOADED" });
    }
  }

  // Initial fetch when query changes
  useEffect(() => {
    if (!query || typeof query !== "string" || query.trim() === "") {
      return;
    }

    localStorage.setItem("nextPage", 4); // Set initial next page offset
    fetchAndSetPodcasts(query, 0, false); // Fetch and set the first set of podcasts
  }, [query, dispatch]);

  // Load more podcasts
  async function handleLoadMorePodcasts() {
    const nextPage = parseInt(localStorage.getItem("nextPage"), 10); // Parse offset from localStorage

    if (!query || query.trim() === "") {
      dispatch({
        type: "REJECTED",
        payload: "Please enter a valid search term.",
      });
      return;
    }

    if (!isNaN(nextPage)) {
      await fetchAndSetPodcasts(query, nextPage, true); // true = append results
    } else {
      dispatch({ type: "REJECTED", payload: "No more results" });
    }
  }

  const handlePlayPause = (podcastId) => {
    const currentAudio = audioRefs.current[podcastId];

    if (playingPodcastId === podcastId) {
      // Pause the currently playing podcast
      currentAudio.pause();
      setPlayingPodcastId(null);
    } else {
      // Pause any other playing audio
      if (playingPodcastId && audioRefs.current[playingPodcastId]) {
        audioRefs.current[playingPodcastId].pause();
      }

      // Play the selected podcast
      if (currentAudio) {
        currentAudio.play();
        setPlayingPodcastId(podcastId);

        currentAudio.onloadedmetadata = () => {
          setProgress((prev) => ({
            ...prev,
            [podcastId]: {
              ...(prev[podcastId] || {}),
              duration: currentAudio.duration,
            },
          }));
        };

        currentAudio.ontimeupdate = () => {
          if (isSeeking) return;
          setProgress((prev) => ({
            ...prev,
            [podcastId]: {
              ...(prev[podcastId] || {}),
              currentTime: currentAudio.currentTime,
            },
          }));
        };
      }
    }
    setSelectedPodcastId(podcastId);
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleDownload = (audioUrl, filename) => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = filename || "podcast.mp3";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className=" xl:pb-1 xl:px-10 md:px-4 sm:px-2 lg:px-6 ">
      {isloading && <Loader />}
      {/* {error && <p className="text-red-500">{error}</p>} */}
      <div className=" grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))]  gap-4 gap-y-2 md:gap-y-4 ">
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            className={`${
              selectedPodcastId === podcast.id ? "bg-[#3f4c4e]" : "bg-[#01222e]"
            } p-3 lg:rounded shadow-md text-white relative max-h-[8.5rem]`}
          >
            <div className="flex gap-4 items-center ">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={podcast.image}
                  alt={podcast.title_original}
                  className=" rounded  object-cover"
                />
              </div>
              <div className="">
                {" "}
                <div className="flex">
                  <div className="w-[200px] overflow-hidden whitespace-nowrap">
                    <h4 className="text-md font-semibold mr-auto animate-marquee inline-block w-fit hover:[animation-play-state:paused]">
                      {podcast.title_original}
                    </h4>
                  </div>

                  <button
                    className="ml-auto"
                    onClick={() =>
                      handleDownload(
                        podcast.audio,
                        `${podcast.title_original || "podcast"}.mp3`
                      )
                    }
                  >
                    <HiMiniArrowDownTray className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-baseline">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 font-medium  line-clamp-2 relative">
                      {podcast.description_original
                        ? podcast.description_original
                            .replace(/<[^>]*>/g, "")
                            .slice(0, 70) + "..."
                        : "No query available."}
                      <audio
                        ref={(el) => (audioRefs.current[podcast.id] = el)}
                        src={podcast.audio}
                      />
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayPause(podcast.id)}
                    className="self-end ml-auto"
                  >
                    {playingPodcastId === podcast.id ? (
                      <HiOutlinePause className="w-6 h-6" />
                    ) : (
                      <HiOutlinePlay className="w-6 h-6" />
                    )}
                  </button>
                </div>
                {playingPodcastId === podcast.id && (
                  <div className="">
                    <div className="flex items-center gap-2 mt--1rem]">
                      {/* <span className="text-sm text-gray-400 ">
                        {formatTime(progress[podcast.id]?.currentTime || 0)}
                      </span> */}
                      <input
                        type="range"
                        className="custom-range w-full cursor-pointer"
                        min="0"
                        max={progress[podcast.id]?.duration || 0}
                        value={progress[podcast.id]?.currentTime || 0}
                        onMouseDown={() => setIsSeeking(true)}
                        onMouseUp={(e) => {
                          const newTime = parseFloat(e.target.value);
                          audioRefs.current[podcast.id].currentTime = newTime;
                          setProgress((prev) => ({
                            ...prev,
                            [podcast.id]: {
                              ...(prev[podcast.id] || {}),
                              currentTime: newTime,
                            },
                          }));
                          setIsSeeking(false);
                        }}
                        onChange={(e) => {
                          const newTime = parseFloat(e.target.value);
                          setProgress((prev) => ({
                            ...prev,
                            [podcast.id]: {
                              ...(prev[podcast.id] || {}),
                              currentTime: newTime,
                            },
                          }));
                        }}
                      />
                      <span className="text-sm text-gray-400">
                        {formatTime(progress[podcast.id]?.currentTime || 0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleLoadMorePodcasts}
        className="flex items-center gap-2 mx-auto text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        <AiOutlineReload className="w-6 h-6 mt-8" />
      </button>
    </div>
  );
}

// <div className="bg-[#01222e] p-[200px]  text-2xl min-h-[40vh]"></div>;
