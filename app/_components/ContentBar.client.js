"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ContentBar({ selected }) {
  const searchParams = useSearchParams();
  const categories = [
    "Sermons",
    "Podcasts",
    "Music",
    "Bible Studies",
    "Prayer",
    "Live-feed",
    "Testimonies",
  ];

  return (
    <div className="flex mb-4  xl:px-10 md:px-4 sm:px-2 lg:px-6 overflow-x-auto justify-between gap-4 text-sm lg:text-md font-bold scrollbar-hidden px-4">
      {categories.map((category) => {
        const currentQuery = searchParams.get("query");
        let href = `?selected=${encodeURIComponent(category)}`;
        if (currentQuery) {
          href += `&query=${encodeURIComponent(currentQuery)}`;
        }

        return (
          <Link
            href={href}
            key={category}
            className={`${
              selected === category
                ? "bg-[#78898b] text-[#01222e]"
                : "bg-[#01222e] text-[#78898b]"
            } px-2 py-1 lg:px-3 lg:py-1.5 rounded-sm whitespace-nowrap font-semibold`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
