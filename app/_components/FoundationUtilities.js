import { HiBookmark, HiMiniBookOpen } from "react-icons/hi2";
import Link from "next/link";
import { useSearch } from "./SearchContext";
import Bible from "./Bible";
// import FileInput from "./FileInput";
// import User from "./user";
export default function FoundationUtilities() {
  const { selectedVideo, isFeedVisible, dispatch } = useSearch();

  return (
    <div
      className={`xl:max-w-[40%] 
         max-h-[28rem] 
       overflow-y-auto  bg-[#01212c] gap-6 xl:pt-0 ${
         isFeedVisible ? "scrollbar-hidden " : ""
       }`}
    >
      {" "}
      <div className=" xl:w-full ">
        <div className="sticky top-0 bg-[#01212c]">
          {/* <h2 className="hidden xl:block text-2xl md:text-3xl font-black mb-3 px-4  pt-3">
            <span className="text-[#4a5759] uppercase">Following,</span>{" "}
            <p>{query ? `${query}'s Foundation.` : ""}</p>
          </h2> */}
          <div className="flex justify-between bg-[#4a5759] px-3 py-1 md:py-1.5 lg:py-2 items-end">
            <h3 className="w-3/4 xl:w-full truncate xl:truncate-two-lines">
              <span className="text-xl md:text-2xl lg:text-3xl text-white font-extrabold mr-3">
                On:
              </span>
              <span className="  font-bold lg:text-lg  text-[#01212c] ">
                {selectedVideo?.snippet?.title || "Pick something to watch"}...
              </span>
            </h3>
            <div className="">
              <Tools isFeedVisible={isFeedVisible} dispatch={dispatch} />
            </div>
          </div>
        </div>
        <div className={isFeedVisible ? "block" : "hidden"}>
          <Bible />
        </div>
      </div>
    </div>
  );
}

export function Tools({ dispatch }) {
  return (
    <nav className="flex justify-between gap-2">
      <div>
        {/* <NavLink to="/users"> */}
        <HiMiniBookOpen
          href="/bible"
          className="w-6 h-6 "
          onClick={() =>
            dispatch({
              type: "SET_IS_FEED_VISIBLE",
            })
          }
        />
      </div>
      <div>
        <Link href="/bookmarks">
          <HiBookmark className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}

// const StyledNavLink = styled(NavLink)`
//   &:link,
//   &:visited {
//     display: flex;
//     align-items: center;
//     gap: 1.2rem;

//     color: var(--color-grey-600);
//     font-size: 1.6rem;
//     font-weight: 500;
//     padding: 1.2rem 2.4rem;
//     transition: all 0.3s;
//   }

//   /* This works because react-router places the active class on the active NavLink */
//   &:hover,
//   &:active,
//   &.active:link,
//   &.active:visited {
//     color: var(--color-grey-800);
//     background-color: var(--color-grey-50);
//     border-radius: var(--border-radius-sm);
//   }

//   & svg {
//     width: 2.4rem;
//     height: 2.4rem;
//     color: var(--color-grey-400);
//     transition: all 0.3s;
//   }

//   &:hover svg,
//   &:active svg,
//   &.active:link svg,
//   &.active:visited svg {
//     color: var(--color-brand-600);
//   }
// `;

// import { useSearch } from "../SearchContext";
// import { useState } from "react";
// import { Loader } from "../trending";
// import { strokeColor } from "../constants";

// // bibleApi.js
// const BASE_URL = "https://example-bible-api.com"; // Replace with actual API URL

// const fetchBibleVerse = async (
//   version,
//   book,
//   chapter,
//   verse,
//   setError,
//   setIsLoading
// ) => {
//   try {
//     setIsLoading(true);
//     setError("");
//     if (!version || !book || !chapter || !verse) {
//       throw new Error(
//         "All parameters (version, book, chapter, verse) are required"
//       );
//     }

//     const response = await fetch(
//       `${BASE_URL}/${version}/${book}/${chapter}/${verse}`
//     );

//     if (!response.ok) {
//       throw new Error(`Error ${response.status}: Unable to fetch verse`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     //     return { error: error.message };
//   } finally {
//     setIsLoading(false);
//   }
// };

// // Bible Component
// export default function Bible() {
//   return (
//     <div>
//       <BibleSearch fetchBibleVerse={fetchBibleVerse} />
//     </div>
//   );
// }

// // BibleSearch Component
// export const BibleSearch = ({ fetchBibleVerse }) => {
//   const [version, setVersion] = useState("");
//   const [book, setBook] = useState("");
//   const [chapter, setChapter] = useState("");
//   const [verse, setVerse] = useState("");
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const { setIsLoading } = useSearch();

//   const handleBibleSearch = async () => {
//     setIsLoading(true);
//     setError(null);
//     setResult(null);

//     if (!book || !chapter || !verse) {
//       setError("Please fill in all fields");
//       return;
//     }

//     const data = await fetchBibleVerse(version, book, chapter, verse);
//     if (data.error) {
//       setError(data.error);
//     } else {
//       setResult(data);
//     }
//   };

//   return (
//     <div className="flex justify-center p-4 gap-4">
//       <input
//         className="focus:outline-none w-fit min-w-[100px]"
//         type="text"
//         placeholder="Version (e.g., KJV)"
//         value={version}
//         onChange={(e) => setVersion(e.target.value)}
//       />
//       <input
//         className="focus:outline-none w-fit min-w-[100px]"
//         type="text"
//         placeholder="Book"
//         value={book}
//         onChange={(e) => setBook(e.target.value)}
//       />
//       <input
//         className="focus:outline-none w-[8ch] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
//         type="number"
//         placeholder="Chapter"
//         value={chapter}
//         onChange={(e) => setChapter(e.target.value)}
//       />
//       <input
//         className="focus:outline-none w-[6ch] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
//         type="number"
//         placeholder="Verse"
//         value={verse}
//         onChange={(e) => setVerse(e.target.value)}
//         onKeyPress={(e) => e.key === "Enter" && handleBibleSearch()}
//       />
//       <button onClick={handleBibleSearch}>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke={strokeColor}
//           className="h-5 w-5"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010 17.5 7.5 7.5 0 0016.65 16.65z"
//           />
//         </svg>
//       </button>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {result && <p>{result.text}</p>}
//     </div>
//   );
// };
