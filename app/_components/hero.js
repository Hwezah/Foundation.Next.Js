// import { strokeColor } from "./App";
"use client";
import { useSearch } from "./SearchContext";
import { VideoEmbed } from "@/app/_components/SermonsList";
import FoundationUtilities from "./FoundationUtilities";
import React, { memo } from "react";
import Image from "next/image";
function Hero() {
  const { selectedVideo, isLoading } = useSearch();

  // const isSticky = book && chapter && !verse; // Check if book and chapter are defined

  return (
    <div
      // ${ isSticky ? "" : "sticky top-0 z-10"}
      className={`bg-[#01212c] w-full sticky top-0 z-1 
      xl:flex xl:justify-between items-start scrollbar-hidden overflow-hidden`}
    >
      {/* If still loading, show the Loader */}
      {!selectedVideo ? (
        // Show fallback video while waiting for the selected video
        // <video autoPlay muted loop className="w-full h-[70vh] object-cover">
        //   <source
        //     src="public\Assets\5875774-uhd_3840_2160_24fps.mp4" // Ensure the path is correct
        //     type="video/mp4"
        //   />
        // </video>
        <div className="relative aspect-square flex-1">
          {" "}
          <Image
            className="w-full max-h-[70vh] object-cover object-center block"
            fill
            src="/pexels-jibarofoto-13963623.jpg"
            alt="trending sermons"
          />
        </div>
      ) : (
        // Once the selected video is available, show the selected video
        <>
          <div className="hidden xl:block h-full">
            {/* <Tools setIsFeedVisible={setIsFeedVisible} /> */}
          </div>
          <div className="w-full aspect-video ">
            <VideoEmbed
              className=" shadow-none rounded-none w-full h-full object-cover "
              videoId={selectedVideo.id.videoId}
              title={selectedVideo.snippet.title}
            />
          </div>
        </>
      )}
      <FoundationUtilities />
    </div>
  );
}
export default memo(Hero);

{
  /* <div className="absolute top-1/2 right-10 -translate-y-1/2 transform cursor-pointer rounded-full p-4 bg-white text-white transition hover:bg-gray-100">
              <svg
                height="24px"
                width="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z"
                  fill="#0F0F0F"
                />
              </svg>
            </div> */
}

{
  /* <div className="absolute top-1/2 left-10 -translate-y-1/2 transform cursor-pointer  rounded-full bg-white p-4 text-white transition hover:bg-gray-100">
              <svg
                height="24px"
                width="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z"
                  fill="#0F0F0F"
                />
              </svg>
            </div> */
}
