"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Spinner from "@/app/_components/Spinner";
import { useSearch } from "./SearchContext";
import fetchData from "../_lib/apis/api";
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiMiniArrowDownTray,
} from "react-icons/hi2";
import { AiOutlineReload } from "react-icons/ai";
export default function PodcastsList({ podcasts, initialNextOffset }) {
  const { isloading, query, setIsLoading } = useSearch();
  const [playingPodcastId, setPlayingPodcastId] = useState(null);
  const [progress, setProgress] = useState({});
  const [isSeeking, setIsSeeking] = useState(false);
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);
  const [displayedPodcasts, setDisplayedPodcasts] = useState(podcasts);
  const [currentOffset, setCurrentOffset] = useState(initialNextOffset);
  const audioRefs = useRef({}); // Store references to audio elements

  async function handleLoadMorePodcasts() {
    if (!currentOffset) {
      console.log("No more pages to load.");
      return;
    }
    setIsLoading(true);

    const API_KEY = "f6402a826907452d912101ce2e4addf0";
    const URL = `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(
      query
    )}&type=episode&sort_by_date=1&len_min=0&len_max=0&only_in=title,query,fulltext&&safe_mode=0&offset=${currentOffset}&page_size=2`;

    try {
      const endpoint = {
        headers: { "X-ListenAPI-Key": API_KEY },
      };
      const data = await fetchData(URL, endpoint);
      if (data && data.results) {
        setDisplayedPodcasts((prevPodcasts) => {
          // filter out duplicates
          const existingIds = new Set(prevPodcasts.map((p) => p.id));
          const newUniquePodcasts = data.results.filter(
            (podcast) => !existingIds.has(podcast.id)
          );
          return [...prevPodcasts, ...newUniquePodcasts];
        });
      }
      setCurrentOffset(data.next_offset);
    } catch (error) {
      console.error("Error fetching podcasts", error);
    } finally {
      setIsLoading(false);
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
        // Attempt to set initial progress state, especially if reusing a paused audio
        // This ensures the UI has some values before onloadedmetadata if audio was already loaded
        setProgress((prev) => {
          const existingProgress = prev[podcastId] || {};
          return {
            ...prev,
            [podcastId]: {
              currentTime:
                currentAudio.currentTime || existingProgress.currentTime || 0,
              duration:
                currentAudio.duration && isFinite(currentAudio.duration)
                  ? currentAudio.duration
                  : existingProgress.duration || 0,
            },
          };
        });

        currentAudio.play().catch((error) => {
          console.error(`Error playing podcast ${podcastId}:`, error);
          if (playingPodcastId === podcastId) {
            setPlayingPodcastId(null); // Reset playing state if play fails
          }
        });
        setPlayingPodcastId(podcastId);

        currentAudio.onloadedmetadata = () => {
          const duration = currentAudio.duration;
          const currentTime = currentAudio.currentTime;
          if (duration && isFinite(duration)) {
            setProgress((prev) => ({
              ...prev,
              [podcastId]: {
                currentTime: isFinite(currentTime)
                  ? currentTime
                  : prev[podcastId]?.currentTime || 0,
                duration: duration,
              },
            }));
          }
        };

        currentAudio.ontimeupdate = () => {
          if (isSeeking) return;
          const currentTime = currentAudio.currentTime;
          const duration = currentAudio.duration;

          if (isFinite(currentTime) && duration && isFinite(duration)) {
            setProgress((prev) => ({
              ...prev,
              [podcastId]: {
                currentTime: currentTime,
                duration: duration,
              },
            }));
          } else if (isFinite(currentTime)) {
            // If only currentTime is valid, update it but try to keep old duration
            setProgress((prev) => ({
              ...prev,
              [podcastId]: {
                currentTime: currentTime,
                duration: prev[podcastId]?.duration || 0,
              },
            }));
          }
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
      {isloading && <Spinner />}
      {/* {error && <p className="text-red-500">{error}</p>} */}
      <div className=" grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))]  gap-4 gap-y-2 md:gap-y-4 ">
        {displayedPodcasts.map((podcast) => (
          <div
            key={podcast.id}
            className={`${
              selectedPodcastId === podcast.id ? "bg-[#3f4c4e]" : "bg-[#01222e]"
            } p-3 lg:rounded  text-white relative h-[6rem] flex items-center`}
          >
            <div className="flex items-center gap-4 ">
              <div className="w-16 h-16 flex-shrink-0 aspect-square relative">
                <Image
                  fill
                  src={podcast.image}
                  alt={podcast.title_original}
                  className=" rounded  object-cover"
                />
              </div>
              <div className="">
                {" "}
                <div className="flex items-start">
                  <div className="w-[200px] overflow-hidden whitespace-nowrap">
                    <h4 className="text-md font-semibold mr-auto animate-marquee inline-block w-fit hover:[animation-play-state:paused] ">
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
                    <p className="text-sm text-gray-400 font-medium  line-clamp-2 relative mb-2 leading-tight">
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
                    <div className="flex items-center gap-2 mt-[-4px]">
                      {" "}
                      {/* Corrected typo and used a small negative margin */}
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
                          const finalTime = parseFloat(e.target.value);
                          if (
                            audioRefs.current[podcast.id] &&
                            isFinite(finalTime) &&
                            finalTime >= 0
                          ) {
                            const audio = audioRefs.current[podcast.id];
                            let seekTime = finalTime;
                            if (audio.duration && finalTime > audio.duration) {
                              seekTime = audio.duration; // Cap at duration
                            }
                            audio.currentTime = seekTime;
                            setProgress((prev) => ({
                              // Ensure progress state matches final audio time
                              ...prev,
                              [podcast.id]: {
                                ...(prev[podcast.id] || {}),
                                currentTime: seekTime,
                                duration:
                                  audio.duration ||
                                  prev[podcast.id]?.duration ||
                                  0,
                              },
                            }));
                          }
                          setIsSeeking(false);
                        }}
                        onChange={(e) => {
                          const newTime = parseFloat(e.target.value);
                          // Update the visual progress immediately
                          setProgress((prev) => ({
                            ...prev,
                            [podcast.id]: {
                              ...(prev[podcast.id] || {}),
                              currentTime: newTime,
                              // Keep duration if already set
                              duration:
                                prev[podcast.id]?.duration ||
                                audioRefs.current[podcast.id]?.duration ||
                                0,
                            },
                          }));
                          // Update the audio element's current time for live seeking
                          if (
                            audioRefs.current[podcast.id] &&
                            isFinite(newTime) &&
                            newTime >= 0
                          ) {
                            const audio = audioRefs.current[podcast.id];
                            let seekTime = newTime;
                            // Prevent seeking beyond duration during live drag if duration is known
                            if (audio.duration && newTime > audio.duration) {
                              seekTime = audio.duration;
                            }
                            audio.currentTime = seekTime;
                          }
                        }}
                      />
                      <div className="text-sm text-amber-500 flex">
                        <span className="mr-1">
                          {formatTime(progress[podcast.id]?.currentTime || 0)}
                        </span>
                        /{" "}
                        <span className="ml-1">
                          {formatTime(progress[podcast.id]?.duration || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isloading && <Spinner />}
      {currentOffset && (
        <div className="flex flex-col justify-center items-center ">
          <button
            // onClick={handleLoadMorePodcasts}
            className="flex items-center gap-2 mx-auto text-white px-4 py-2 rounded-lg cursor-pointer"
            onClick={handleLoadMorePodcasts}
          >
            <AiOutlineReload className="w-6 h-6 mt-8" />
          </button>
          <p>Load More</p>
        </div>
      )}
    </div>
  );
}

// <div className="bg-[#01222e] p-[200px]  text-2xl min-h-[40vh]"></div>;
