"use client";
import { useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { HiMiniArrowsPointingOut } from "react-icons/hi2";
import { MdOutlineTheaters } from "react-icons/md";

import { useSearch } from "./SearchContext";
import { CiPlay1 } from "react-icons/ci";
import ReactPlayer from "react-player/youtube";

export default function SermonsList({ videos }) {
  const { playingVideoId, setCurrentlyPlayingVideo } = useSearch();

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
          <ul className="xl:p-10 md:p-4 sm:p-2 lg:p-6 !pt-0 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] min-h-[40vh] gap-4">
            {videos.map((video) => (
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

          <button className="flex items-center gap-2 mx-auto text-white px-4 py-2 rounded-lg cursor-pointer mt-4">
            <AiOutlineReload className="w-6 h-6" />
            Load More
          </button>
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
    <div
      className={`flex flex-col cursor-pointer h-[240px] group rounded-lg overflow-hidden transition-all duration-200 ease-in-out ${
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
      <div className="w-full h-[200px] relative bg-black">
        {isHoverPlaying && !isPlaying ? (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%"
            height="100%"
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
            className="w-full h-full bg-cover bg-center"
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
      <div className="flex items-center justify-between px-3 py-2 bg-primary-900 group-hover:bg-primary-800">
        <div>
          {" "}
          <h3 className="truncate w-full text-sm lg:text-base transition-colors ">
            {video.snippet.title}
          </h3>
        </div>
        <HiMiniArrowsPointingOut size={24} />

        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            setIsHoverMuted((prev) => !prev);
          }}
          className=" z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
          aria-label={isHoverMuted ? "Unmute preview" : "Mute preview"}
        >
          {isHoverMuted ? (
            <HiOutlineSpeakerXMark className="w-5 h-5" />
          ) : (
            <HiOutlineSpeakerWave className="w-5 h-5" />
          )}
        </button> */}
      </div>
    </div>
  );
}

export function VideoEmbed({ videoId, title }) {
  return (
    <div
      className=" w-full h-[100%] rounded-lg overflow-hidden"
      aria-label={title}
    >
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
