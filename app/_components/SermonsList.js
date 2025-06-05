"use client";
import { useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { HiMiniArrowsPointingOut } from "react-icons/hi2";
import fetchData from "../_lib/apis/api";

import { useSearch } from "./SearchContext";
import { CiPlay1 } from "react-icons/ci";
import ReactPlayer from "react-player/youtube";
import Spinner from "./Spinner";
export default function SermonsList({ videos, initialNextPageToken }) {
  const { playingVideoId, setCurrentlyPlayingVideo, query } = useSearch();
  const [displayedVideos, setDisplayedVideos] = useState(videos);
  const [currentPageToken, setCurrentPageToken] =
    useState(initialNextPageToken);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function handleLoadMoreSermons() {
    if (!currentPageToken) {
      console.log("No more pages to load.");
      return;
    }
    setIsLoadingMore(true);
    const API_KEY = "AIzaSyA1NFxiq7v8qqA6HADR2Xgfg3NiWphCRXY";

    try {
      const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&maxResults=2&pageToken=${currentPageToken}&type=video&key=${API_KEY}`;
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
          <ul className="xl:p-10 md:p-4 sm:p-2 lg:p-6 !pt-0 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] h-fit gap-4">
            {displayedVideos.map((video) => (
              <VideoItem
                key={
                  video.id.videoId || video.id.channelId || video.id.playlistId
                }
                video={video}
                isPlaying={playingVideoId === video.id.videoId}
                onPlay={() => setCurrentlyPlayingVideo(video)}
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

function VideoItem({ video, isPlaying, onPlay }) {
  const videoId = video?.id?.videoId;
  const [isHoverPlaying, setIsHoverPlaying] = useState(false);
  const [isHoverMuted, setIsHoverMuted] = useState(false);

  if (!videoId) return null;

  return (
    <>
      <div
        className={`flex flex-col  cursor-pointer  rounded-lg overflow-hidden transition-all duration-200 ease-in-out ${
          isPlaying ? "border-2 border-accent-500" : ""
        }`}
        onClick={() => {
          setIsHoverPlaying(false);
          setIsHoverMuted(false);
          onPlay();
        }}
        onMouseEnter={() => {
          if (!isPlaying) setIsHoverPlaying(true);
        }}
        onMouseLeave={() => {
          setIsHoverPlaying(false);
          setIsHoverMuted(false);
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
        <div className="w-full  relative">
          {isHoverPlaying && !isPlaying ? (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${videoId}`}
              width="100%"
              height="240px"
              loop
              playing
              muted={isHoverMuted}
              controls={false}
              volume={1}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    modestbranding: 1,
                    controls: 1,
                    disablekb: 1,
                    showinfo: 0,
                    rel: 0,
                  },
                },
              }}
            />
          ) : (
            <div
              className="w-full h-[240px] bg-cover bg-center"
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300">
                <CiPlay1 className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex-1 w-[70%] ">
            <h3 className="truncate  mr-2 text-sm lg:text-base transition-colors ">
              {video.snippet.title}
            </h3>
          </div>
          <div className="ml-auto">
            <HiMiniArrowsPointingOut size={24} />
          </div>
        </div>
      </div>
    </>
  );
}

export function VideoEmbed({ videoId, title }) {
  return (
    <div className=" w-full h-[100%] overflow-hidden" aria-label={title}>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}&modestbranding=1`}
        width="100%"
        height="100%"
        playing
        controls
      />
    </div>
  );
}
