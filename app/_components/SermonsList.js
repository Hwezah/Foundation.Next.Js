"use client";
import { AiOutlineReload } from "react-icons/ai";
import { useState } from "react";

// import { useSearch } from "./SearchContext";
import { CiPlay1 } from "react-icons/ci";
import ReactPlayer from "react-player";
export default function SermonsList({ videos }) {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  return (
    <div>
      <ul className="xl:p-10 md:p-4 sm:p-2 lg:p-6 !pt-0 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] min-h-[40vh] gap-4">
        {videos.map((video) => (
          <VideoItem
            key={video.id.videoId || video.id.channelId || video.id.playlistId}
            video={video}
            isPlaying={playingVideoId === video.id.videoId}
            onPlay={() => setPlayingVideoId(video.id.videoId)}
          />
        ))}
      </ul>
      <button
        // onClick={handleLoadMoreSermons}
        className="flex items-center gap-2 mx-auto text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        <AiOutlineReload className="w-6 h-6" />
        Load More
      </button>
    </div>
  );
}

function VideoItem({ video, onClick, isPlaying }) {
  const videoId = video?.id?.videoId;
  if (!videoId) return null;

  return (
    <div className="custom748:flex">
      <li className=" cursor-pointer " onClick={onClick}>
        {!isPlaying ? (
          <div
            className=" w-full h-[200px] bg-cover bg-center md:rounded-lg shadow-lg relative"
            style={{
              backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`,
            }}
          >
            <button className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              <CiPlay1 className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <VideoEmbed videoId={videoId} title={video.snippet.title} />
        )}
      </li>
      <h3 className="truncate w-full p-2 text-sm lg:text-lg ">
        {video.snippet.title}
      </h3>
    </div>
  );
}

export function VideoEmbed({
  videoId,
  title,
  width = "100%",
  height = "100%",
  className = "",
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width, height }}
      aria-label={title}
    >
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}&modestbranding=1`}
        width="100%"
        height="100%"
        playing
        controls={true} // or true if you want native controls
      />
    </div>
  );
}
