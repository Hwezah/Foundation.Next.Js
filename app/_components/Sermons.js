"use client";
import React, { useState, useEffect } from "react";

import { useSearch } from "./SearchContext";
import ReactPlayer from "react-player";

import { useLocalStorage } from "@/app/_components/UseLocalStorage";
import { toast } from "react-hot-toast";
import { AiOutlineReload } from "react-icons/ai";
import { CiPlay1 } from "react-icons/ci";
export default function Sermons() {
  const [sermons, setSermons] = useLocalStorage([], "sermons");
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const { query, dispatch } = useSearch(); // assuming query comes from context
  const [pageToken, setPageToken] = useState("");

  const API_KEY = "AIzaSyCyDM6zL56RjPY62zE30wi6TweFQXjCIYo";
  //   const API_KEY = "AIzaSyA_9QSamWQ-yBKdZCYbzI-ywkRy3fpGrWY";
  //   const API_KEY = "AIzaSyB-t8E-UrOC8CMTfpjLdMd7dZUejXvwx1c";
  //   const API_KEY = "AIzaSyCNyHlY3nfI0eJYR7_xHTobtrRTX3puk94";
  const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&maxResults=4&pageToken=${pageToken}&type=video&key=${API_KEY}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["sermons", query, pageToken],
    queryFn: () => fetchData(URL),
    onSuccess: () => {
      console.log("onSuccess triggered in Sermons.jsx. Data received:");
      toast.success("Sermons loaded successfully!");
    },

    onError: (err) => {
      toast.error(err.message);
    },
    enabled: !!query, // only fetch if query exists
    keepPreviousData: true, // keep old data while fetching new
  });

  // Update sermons when data changes
  useEffect(() => {
    if (data?.items) {
      setSermons((prevData) =>
        pageToken ? [...prevData, ...data.items] : data.items
      );
    }
  }, [data, pageToken, setSermons]);

  function handleLoadMoreSermons() {
    const nextPageToken = localStorage.getItem("nextPageToken");
    if (!query || query.trim() === "") {
      dispatch({
        type: "REJECTED",
        payload: "Please enter a valid search term.",
      });
      return;
    }

    if (nextPageToken) {
      setPageToken(nextPageToken); // triggers a new query because pageToken changes
    } else {
      dispatch({ type: "REJECTED", payload: "No more results" });
    }
  }

  return (
    <div>
      <ul className="xl:p-10 md:p-4 sm:p-2 lg:p-6 !pt-0 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] min-h-[40vh] gap-4">
        {sermons.length ? (
          sermons.map((video) => (
            <VideoItem
              key={
                video.id.videoId || video.id.channelId || video.id.playlistId
              }
              video={video}
              isPlaying={playingVideoId === video.id.videoId}
              onPlay={() => setPlayingVideoId(video.id.videoId)}
              onClick={() =>
                dispatch({ type: "SET_SELECTED_VIDEO", payload: video })
              }
              onPause={() => setPlayingVideoId(video)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No sermons found.
          </p>
        )}
      </ul>

      <button
        onClick={handleLoadMoreSermons}
        className="flex items-center gap-2 mx-auto text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        <AiOutlineReload className="w-6 h-6" />
        Load More
      </button>
    </div>
  );
}

export function ErrorMessage() {
  return <p>Empty Query</p>;
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
