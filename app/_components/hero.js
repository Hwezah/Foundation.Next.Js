// import { strokeColor } from "./App";
"use client";
import { useSearch } from "./SearchContext";
import { VideoEmbed } from "@/app/_components/SermonsList";
// import FoundationUtilities from "./FoundationUtilities";
import Bible from "./Bible";
import React, { memo, useState } from "react";
import Image from "next/image";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

function Hero() {
  const { selectedVideo } = useSearch();
  const [showBiblePanel, setShowBiblePanel] = useState(false);

  return (
    <div className="h-[75vh] relative overflow-hidden">
      {" "}
      {/* Added overflow-hidden */}
      {/* Main Content Area (Video/Image) */}
      <div
        className={`bg-[#01212c] w-full h-full sticky top-0 z-10
          xl:flex xl:justify-between items-start scrollbar-hidden overflow-hidden`}
      >
        {!selectedVideo ? (
          <div className="w-full h-full relative">
            <Image
              className="object-cover object-center"
              fill
              priority
              src="/pexels-jibarofoto-13963623.jpg"
              alt="Foundation"
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <VideoEmbed
              videoId={selectedVideo.id.videoId}
              title={selectedVideo.snippet.title}
            />
          </div>
        )}
      </div>
      {/* Sliding Panel (FoundationUtilities from left) */}
      <div
        className={`absolute top-0 right-0 h-full z-20 bg-[#01212c]
          transition-transform duration-300 ease-in-out transform
          ${showBiblePanel ? "translate-x-0" : "translate-x-full"}
          w-full sm:w-3/4 md:w-1/2 xl:w-[40%]
          overflow-y-auto scrollbar-hidden shadow-xl`}
      >
        {/* <FoundationUtilities /> */}
        <Bible />
      </div>
      {/* Toggle Button for the Panel */}
      <button
        className="absolute top-1/2 right-8 -translate-y-1/2 transform cursor-pointer z-30
          rounded-full p-2 opacity-30 hover:bg-opacity-100 hover:scale-110 
          transition-all duration-200"
        onClick={() => setShowBiblePanel((prev) => !prev)}
        aria-label={
          showBiblePanel ? "Close utilities panel" : "Open utilities panel"
        }
      >
        {showBiblePanel ? (
          <BsArrowRightCircleFill size={62} />
        ) : (
          <BsArrowLeftCircleFill size={62} />
        )}
      </button>
    </div>
  );
}
export default memo(Hero);

{
  /* Original button for right panel - reference
      {showBiblePanel && (
        <div className="absolute top-0 right-0 z-70"> // z-70 was high
          <FoundationUtilities />
        </div>
      )}
<button
    className="absolute top-1/2 right-10 -translate-y-1/2 transform cursor-pointer"
    onClick={() => setShowBiblePanel((prev) => !prev)}
    >
    <BsArrowLeftCircleFill size={64} /> // Original icon and size
</button>
*/
}
