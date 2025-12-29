// import { useSearch } from "../SearchContext";
"use client";
import { useState, useEffect } from "react"; // Import useEffect
import { fetchBibleData } from "@/app/_lib/bibleApi";
import Fuse from "fuse.js";
import { useSearch } from "./SearchContext";
import { useMemo } from "react";
import SpinnerMini from "./SpinnerMini";
import Spinner from "./Spinner";
import {
  HiMiniMagnifyingGlass,
  HiMiniBars3BottomLeft,
  HiMiniBars3,
  HiMiniArrowsRightLeft,
} from "react-icons/hi2";

export default function Bible() {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <BibleSearch fetchBibleData={fetchBibleData} />
    </div>
  );
}

export const BibleSearch = ({ fetchBibleData }) => {
  const [verse, setVerse] = useState("");
  const [chapter, setChapter] = useState("");
  const [book, setBook] = useState("");
  const { isLoading, setIsLoading, error, setError } = useSearch(); // Get setters from context
  const [result, setResult] = useState(null);
  const BIBLE_IDS = {
    KJV: "f276be3571f516cb-01",
    GANDA: "de4e12af7f28f599-01",
  };
  const [bibleVersion, setBibleVersion] = useState("KJV");
  const bibleId = useMemo(() => BIBLE_IDS[bibleVersion], [bibleVersion]);

  const [isVerseByVerse, setIsVerseByVerse] = useState(false);
  const toggleDisplayStyle = () => setIsVerseByVerse((prev) => !prev);

  const booksByVersion = {
    GANDA: {
      GEN: "Olubereberye",
      EXO: "Okuva",
      LEV: "Ebyabaleevi",
      NUM: "Okubala",
      DEU: "Ekyamateeka Olwokubiri",
      JOS: "Yoswa",
      JDG: "Balam",
      RUT: "Luusi",
      "1SA": "1 Samwiri",
      "2SA": "2 Samwiri",
      "1KI": "1 Bassekabaka",
      "2KI": "2 Bassekabaka",
      "1CH": "1 Ebyomumirembe",
      "2CH": "2 Ebyomumirembe",
      EZR: "Ezera",
      NEH: "Nekkemiya",
      EST: "Eseza",
      JOB: "Yobu",
      PSA: "Zabbuli",
      PRO: "Engero",
      ECC: "Omubuulizi",
      SNG: "Oluyimba",
      ISA: "Isaaya",
      JER: "Yeremiya",
      LAM: "Okukungubaga",
      EZK: "Ezeekyeri",
      DAN: "Danyeri",
      HOS: "Koseya",
      JOEL: "Yoweeri",
      AMO: "Amosi",
      OBA: "Obadiya",
      JON: "Yona",
      MIC: "Mikka",
      NAH: "Nakum",
      HAB: "Kaabakuuku",
      ZEP: "Zeffaniya",
      HAG: "Kaggayi",
      ZEC: "Zekkaliya",
      MAL: "Malaki",
      MAT: "Matayo",
      MRK: "Makko",
      LUK: "Lukka",
      JHN: "Yokaana",
      ACT: "Ebikolwa byʼAbatume",
      ROM: "Abaruumi",
      "1CO": "1 Abakkolinso",
      "2CO": "2 Abakkolinso",
      GAL: "Abaggalatiya",
      EPH: "Ephesians",
      PHP: "Abaefeso",
      COL: "Abakkolosaayi",
      "1TH": "1 Basessaloniika",
      "2TH": "2 Basessaloniika",
      "1TI": "1 Timoseewo",
      "2TI": "2 Timoseewo",
      TIT: "Tito",
      PHM: "Firemooni",
      HEB: "Abaebbulaniya",
      JAM: "Yakobo",
      "1PE": "1 Peetero",
      "2PE": "2 Peetero",
      "1JN": "1 Yokaana",
      "2JN": "2 Yokaana",
      "3JN": "3 Yokaana",
      JUD: "Yuda",
      REV: "Okubikkulirwa",
    },
    KJV: {
      GEN: "Genesis",
      EXO: "Exodus",
      LEV: "Leviticus",
      NUM: "Numbers",
      DEU: "Deuteronomy",
      JOS: "Joshua",
      JDG: "Judges",
      RUT: "Ruth",
      "1SA": "1 Samuel",
      "2SA": "2 Samuel",
      "1KI": "1 Kings",
      "2KI": "2 Kings",
      "1CH": "1 Chronicles",
      "2CH": "2 Chronicles",
      EZR: "Ezra",
      NEH: "Nehemiah",
      EST: "Esther",
      JOB: "Job",
      PSA: "Psalms",
      PRO: "Proverbs",
      ECC: "Ecclesiastes",
      SNG: "Song of Solomon",
      ISA: "Isaiah",
      JER: "Jeremiah",
      LAM: "Lamentations",
      EZK: "Ezekiel",
      DAN: "Daniel",
      HOS: "Hosea",
      JOEL: "Joel",
      AMO: "Amos",
      OBA: "Obadiah",
      JON: "Jonah",
      MIC: "Micah",
      NAH: "Nahum",
      HAB: "Habakkuk",
      ZEP: "Zephaniah",
      HAG: "Haggai",
      ZEC: "Zechariah",
      MAL: "Malachi",
      MAT: "Matthew",
      MRK: "Mark",
      LUK: "Luke",
      JHN: "John",
      ACT: "Acts",
      ROM: "Romans",
      "1CO": "1 Corinthians",
      "2CO": "2 Corinthians",
      GAL: "Galatians",
      EPH: "Ephesians",
      PHP: "Philippians",
      COL: "Colossians",
      "1TH": "1 Thessalonians",
      "2TH": "2 Thessalonians",
      "1TI": "1 Timothy",
      "2TI": "2 Timothy",
      TIT: "Titus",
      PHM: "Philemon",
      HEB: "Hebrews",
      JAM: "James",
      "1PE": "1 Peter",
      "2PE": "2 Peter",
      "1JN": "1 John",
      "2JN": "2 John",
      "3JN": "3 John",
      JUD: "Jude",
      REV: "Revelation",
    },
    // Other versions
  };

  const normalizeBook = (input) => {
    const userInput = input.trim().toLowerCase();

    // 1. Exact match (abbreviation or name)
    for (const version of Object.keys(booksByVersion)) {
      const mapping = booksByVersion[version];
      for (const [abbr, name] of Object.entries(mapping)) {
        if (
          abbr.toLowerCase() === userInput ||
          name.toLowerCase() === userInput
        ) {
          return abbr; // Return standardized abbreviation
        }
      }
    }

    // 2. Starts with (simple fuzzy-ish)
    for (const version of Object.keys(booksByVersion)) {
      const mapping = booksByVersion[version];
      for (const [abbr, name] of Object.entries(mapping)) {
        if (name.toLowerCase().startsWith(userInput)) {
          return abbr;
        }
      }
    }

    // 3. Fuzzy match with Fuse.js
    const books = [];
    for (const version of Object.keys(booksByVersion)) {
      for (const [abbr, name] of Object.entries(booksByVersion[version])) {
        books.push({ abbr, name });
      }
    }

    const fuse = new Fuse(books, {
      keys: ["abbr", "name"],
      threshold: 0.4, // tweak if needed
    });

    const result = fuse.search(userInput);
    if (result.length > 0) {
      return result[0].item.abbr;
    }

    return null;
  };

  // Effect to clear error when inputs change
  useEffect(() => {
    setError(null);
    if (!book || !chapter) return;
    handleBibleSearch();
  }, [chapter, verse, bibleVersion, setError]);

  const handleBibleSearch = async () => {
    setResult(null);
    setError(null); // Clear previous errors
    setIsLoading(true); // Start loading

    if (!book || !chapter) {
      setError("Please fill in Book and Chapter fields.");
      setIsLoading(false);
      return;
    }

    const abbr = normalizeBook(book);

    if (!abbr) {
      setError(`Book "${book}" not recognized.`);
      setIsLoading(false);
      return;
    }

    const verseId = verse
      ? `${abbr}.${chapter}.${verse}`
      : `${abbr}.${chapter}`;

    const endpoint = verse
      ? `/${bibleId}/verses/${verseId}`
      : `/${bibleId}/chapters/${verseId}`;

    try {
      const data = await fetchBibleData(endpoint); // Pass only the endpoint path

      // API returns data.data for the actual content
      const cleanContent = data.data.content.replace(/<[^>]*>/g, "");
      setResult({ ...data.data, content: cleanContent });
    } catch (err) {
      console.error("Error fetching Bible verse:", err);
      setError(err.message || "An error occurred while fetching the verse.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="p-4 w-full mx-auto">
      <form
        className="flex gap-1 justify-end mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleBibleSearch();
        }}
      >
        <button
          onClick={toggleDisplayStyle}
          className="bg-[#022b3a] text-white px-1.5 py-0.5 lg:py-1 rounded"
          type="button"
        >
          {isVerseByVerse ? (
            <HiMiniBars3BottomLeft className="w-6.5 h-6.5" />
          ) : (
            <HiMiniBars3 className="w-6.5 h-6.5" />
          )}
        </button>

        <button
          onClick={() =>
            setBibleVersion((prev) => (prev === "KJV" ? "GANDA" : "KJV"))
          }
          className=" px-1 sm:inline-block bg-[#4a5759] text-white  lg:py-1 rounded hover:bg-[#3b4647]"
          type="button"
        >
          <HiMiniArrowsRightLeft className="w-5 h-5" />
        </button>

        <input
          className="bg-[#022b3a] border-none focus:outline-none min-w-[100px] border rounded px-2 "
          type="text"
          placeholder="Book"
          value={book}
          onChange={(e) => setBook(e.target.value)}
        />
        <input
          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [moz-appearance:textfield] bg-[#022b3a] border-none focus:outline-none w-[8ch] border border-gray-300 rounded px-2 appearance-none"
          type="number"
          placeholder="Chapter"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
        />
        <input
          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [moz-appearance:textfield] bg-[#022b3a] border-none focus:outline-none w-[6ch] border border-gray-300 rounded px-2 appearance-none"
          type="number"
          placeholder="Verse"
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
        />

        <button
          type="submit"
          className="hidden sm:inline-block bg-[#4a5759] text-white px-2 py-0.5 lg:py-1 rounded hover:bg-[#3b4647]"
        >
          {isLoading ? <SpinnerMini /> : "Search"}
        </button>

        <button
          type="submit"
          className="sm:hidden py-1 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="spinner-mini"></span>
          ) : (
            <HiMiniMagnifyingGlass className="w-6 h-6" />
          )}
        </button>
      </form>

      {error && <p className="text-amber-500">{error}</p>}
      <div className="bible-display flex items-end justify-center min-h-[200px]">
        {isLoading ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        ) : (
          result && (
            <BibleDisplay
              result={result}
              isVerseByVerse={isVerseByVerse}
              bibleVersion={bibleVersion}
            />
          )
        )}
      </div>
    </div>
  );
};

function BibleDisplay({ result, isVerseByVerse, bibleVersion }) {
  return (
    <div className="bible-display flex items-center relative">
      <div className="mt-1 px-2">
        <h3 className="text-lg font-bold text-blue-400">
          {result.reference}
          <span className="text-xs text-amber-500 font-semibold px-2">
            {bibleVersion === "KJV" ? "(GANDA)" : "(KJV)"}
          </span>
        </h3>
        <p className="">
          {result.content
            .split(/(?=\b\d{1,3}[^a-zA-Z0-9]*[A-Z])/)
            .map((part, index) => {
              const match = part.match(/^(\d{1,3})([^a-zA-Z0-9]*)([A-Z].*)/);
              if (!match) return <span key={index}>{part}</span>;

              const [, verseNum, symbol, verseText] = match;

              return (
                <span
                  key={index}
                  className={isVerseByVerse ? "block mb-1" : "inline"}
                >
                  <span className="text-xs text-blue-400 mr-1 font-semibold">
                    {verseNum}.
                  </span>
                  <span className="text-gray-400">{symbol}</span>
                  {verseText + " "}
                </span>
              );
            })}
        </p>
      </div>
    </div>
  );
}
