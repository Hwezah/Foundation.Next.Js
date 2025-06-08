"use client";
import { useState, useRef, useEffect } from "react";
import { AiOutlineReload } from "react-icons/ai";
import {
  HiMiniArrowsPointingOut,
  HiSpeakerWave,
  HiSpeakerXMark,
} from "react-icons/hi2";
import fetchData from "../api/api";

import { useSearch } from "./SearchContext";
import { CiPlay1 } from "react-icons/ci";
import ReactPlayer from "react-player/youtube";
import Spinner from "./Spinner";
export default function SermonsList({
  videos,
  initialNextPageToken,
  listQuery,
}) {
  // Added listQuery prop
  const {
    playingVideoId,
    setCurrentlyPlayingVideo,
    // query, // Context query is no longer needed for load more here
    addActiveHoverControllerId,
    removeActiveHoverControllerId,
  } = useSearch();
  const [displayedVideos, setDisplayedVideos] = useState(videos);
  const [currentPageToken, setCurrentPageToken] =
    useState(initialNextPageToken);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Effect to reset displayed videos and pagination when a new search occurs
  useEffect(() => {
    setDisplayedVideos(videos);
    setCurrentPageToken(initialNextPageToken);
    setIsLoadingMore(false); // Reset loading state for "load more"
  }, [videos, initialNextPageToken]); // Rerun when initial videos or token change

  async function handleLoadMoreSermons() {
    if (!currentPageToken) {
      console.log("No more pages to load.");
      return;
    }
    setIsLoadingMore(true);

    try {
      const URL = `/api/sermons?query=${encodeURIComponent(
        listQuery // Use listQuery prop for loading more
      )}&pageToken=${currentPageToken}`;
      const data = await fetchData(URL);
      console.log(data);
      setDisplayedVideos((prevVideos) => [...prevVideos, ...data.items]);
      setCurrentPageToken(data.nextPageToken);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }
  return (
    <div>
      {videos && videos.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p>No sermons found matching your search criteria.</p>
          <p>Try a different search term.</p>
        </div>
      )}

      {videos && videos.length > 0 && (
        <>
          <ul className="xl:p-10 md:p-4 sm:p-2 lg:p-6 !pt-0 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
            {displayedVideos.map((video) => (
              <VideoItem
                key={
                  video.id.videoId || video.id.channelId || video.id.playlistId
                }
                video={video}
                isPlaying={playingVideoId === video.id.videoId}
                onPlay={() => setCurrentlyPlayingVideo(video)}
                addActiveHoverControllerId={addActiveHoverControllerId}
                removeActiveHoverControllerId={removeActiveHoverControllerId}
              />
            ))}
          </ul>

          {isLoadingMore && <Spinner />}

          {currentPageToken && (
            <button
              className="flex flex-col items-center gap-2 mx-auto text-white px-4 py-2 rounded-lg cursor-pointer mt-4"
              onClick={handleLoadMoreSermons}
              disabled={isLoadingMore}
            >
              <AiOutlineReload className="w-6 h-6" />
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}

function VideoItem({
  video,
  isPlaying,
  onPlay,
  addActiveHoverControllerId,
  removeActiveHoverControllerId,
}) {
  const videoId = video?.id?.videoId;
  const [isHoverPlaying, setIsHoverPlaying] = useState(false);
  const [isHoverMuted, setIsHoverMuted] = useState(true); // Default to muted for hover previews
  const [hoverProgress, setHoverProgress] = useState({
    playedSeconds: 0,
    duration: 0,
  });
  const playerRef = useRef(null);
  const [isSeekingHover, setIsSeekingHover] = useState(false);

  useEffect(() => {
    if (isHoverPlaying && playerRef.current) {
      // Check if there's a meaningful progress to resume from and duration is known.
      // Avoid seeking to 0 if playedSeconds is 0, as that's the default start.
      if (hoverProgress.playedSeconds > 0 && hoverProgress.duration > 0) {
        // Ensure seekTime doesn't exceed duration, though unlikely with current logic.
        const seekTime = Math.min(
          hoverProgress.playedSeconds,
          hoverProgress.duration
        );
        playerRef.current.seekTo(seekTime, "seconds");
      }
    }
    // This effect should run when isHoverPlaying becomes true and the player is available.
    // The values of hoverProgress are read from state when the effect executes.
  }, [isHoverPlaying]);

  useEffect(() => {
    // If this item is NOT the hero video (i.e., !isPlaying), is hovered, and unmuted,
    // it should "request" control (mute/pause) of the hero video.
    const shouldBeActiveController =
      !isPlaying && isHoverPlaying && !isHoverMuted;

    if (shouldBeActiveController) {
      addActiveHoverControllerId(videoId);
    } else {
      // If conditions no longer met, remove this item as a controller
      removeActiveHoverControllerId(videoId);
    }

    // Cleanup function: ensure this item is removed as a controller when it unmounts
    // or when dependencies change causing it to no longer be a controller.
    return () => {
      removeActiveHoverControllerId(videoId);
    };
  }, [
    isPlaying,
    isHoverPlaying,
    isHoverMuted,
    videoId,
    addActiveHoverControllerId,
    removeActiveHoverControllerId,
  ]);
  if (!videoId) return null;
  return (
    <>
      <div
        className=" cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ease-in-out" // Removed overflow-hidden
        onClick={() => {
          setIsHoverPlaying(false);
          setIsHoverMuted(true); // Reset to default muted state for next hover
          onPlay(); // Projects to hero
        }}
        onMouseEnter={() => {
          if (!isPlaying) setIsHoverPlaying(true);
        }}
        onMouseLeave={() => {
          setIsHoverPlaying(false);
          setIsHoverMuted(true); // Ensure it's muted when hover ends and for next time
        }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsHoverPlaying(false);
            onPlay();
          }
        }}
        aria-label={`Play ${video.snippet.title} in hero`}
      >
        <div
          className={`w-full aspect-video rounded-lg overflow-hidden relative ${
            // Apply border and rounding here
            isPlaying
              ? "border-2 border-accent-500 rounded-lg overflow-hidden" // Ensure this div's border has rounded top corners and its content is clipped
              : ""
          }`}
        >
          {isHoverPlaying && !isPlaying ? (
            <>
              <ReactPlayer
                ref={playerRef}
                url={`https://www.youtube.com/watch?v=${videoId}`}
                width="100%"
                height="100%"
                loop
                playing
                muted={isHoverMuted}
                controls={false}
                volume={isHoverMuted ? 0 : 1}
                config={{
                  youtube: {
                    playerVars: {
                      autoplay: 1,
                      modestbranding: 1,
                      controls: 0,
                      disablekb: 1,
                      showinfo: 0,
                      rel: 0,
                    },
                  },
                }}
                onProgress={({ playedSeconds }) => {
                  if (!isSeekingHover) {
                    setHoverProgress((prev) => ({
                      ...prev,
                      playedSeconds,
                    }));
                  }
                }}
                onDuration={(duration) => {
                  setHoverProgress((prev) => ({ ...prev, duration }));
                }}
                onEnded={() => setIsHoverPlaying(false)}
              />

              {/* Transparent overlay to catch clicks */}
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                aria-hidden="true"
              />

              {/* Custom controls */}
              <div className="absolute bottom-0 left-0 right-0 px-2 z-20 ">
                {/* Progress Bar Wrapper for larger click area */}
                <div
                  className="pt-2 cursor-pointer" // Removed mb-1
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent hero projection
                    if (
                      !playerRef.current ||
                      !hoverProgress.duration ||
                      hoverProgress.duration === 0
                    )
                      return;

                    const progressBarWrapper = e.currentTarget;
                    const rect = progressBarWrapper.getBoundingClientRect();
                    const clickX = e.clientX - rect.left; // X position within the wrapper
                    const width = rect.width;

                    let newTime = (clickX / width) * hoverProgress.duration;
                    newTime = Math.max(
                      0,
                      Math.min(newTime, hoverProgress.duration)
                    ); // Clamp

                    setHoverProgress((prev) => ({
                      ...prev,
                      playedSeconds: newTime,
                    }));
                    playerRef.current.seekTo(newTime, "seconds");
                  }}
                >
                  <input
                    type="range"
                    min={0}
                    max={hoverProgress.duration || 0}
                    value={hoverProgress.playedSeconds || 0}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsSeekingHover(true);
                    }}
                    onChange={(e) => {
                      e.stopPropagation(); // Already on input, good practice
                      const newTime = parseFloat(e.target.value);
                      setHoverProgress((prev) => ({
                        ...prev,
                        playedSeconds: newTime,
                      }));
                      if (playerRef.current) {
                        playerRef.current.seekTo(newTime, "seconds");
                      }
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      setIsSeekingHover(false);
                    }}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm accent-accent-500"
                    onClick={(e) => e.stopPropagation()} // Stop propagation for direct clicks on the input itself
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white font-mono">
                    {formatTime(hoverProgress.playedSeconds)} /{" "}
                    {formatTime(hoverProgress.duration)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsHoverMuted(!isHoverMuted);
                    }}
                    className="p-1 text-white rounded-full hover:bg-opacity-80 transition-opacity"
                    aria-label={
                      isHoverMuted ? "Unmute preview" : "Mute preview"
                    }
                  >
                    {isHoverMuted ? (
                      <HiSpeakerXMark size={16} />
                    ) : (
                      <HiSpeakerWave size={16} />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              className="w-full rounded-lg h-full bg-cover bg-center group"
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300">
                <CiPlay1 className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center px-1 py-2 w-full">
          <h3 className="truncate mr-2 text-sm lg:text-base transition-colors ">
            {video.snippet.title}
          </h3>
          <span>
            <HiMiniArrowsPointingOut size={20} />
          </span>
        </div>
      </div>
    </>
  );
}

// Helper function to format time (seconds to MM:SS)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
export function VideoEmbed({ videoId, title, muted, playing }) {
  return (
    <div className=" w-full h-[100%] overflow-hidden" aria-label={title}>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}&modestbranding=1`}
        width="100%"
        height="100%"
        playing={playing} // Control play state via prop
        controls
        muted={muted} // Control mute state via prop
      />
    </div>
  );
}
