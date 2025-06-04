"use client";
import { usePathname } from "next/navigation";
import Hero from "@/app/_components/hero";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/header";
import { Josefin_Sans } from "next/font/google";
import { SearchProvider } from "@/app/_components/SearchContext";
import QuerySyncer from "./_components/QuerySyncer"; // Import the new component
// The Trending component (which is now a Server Component)
// will be passed as a prop (slot) from a parent Server Component,
// so we remove the direct import here.
import "@/app/_styles/globals.css";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
export default function AppBody({ children, trendingSlot }) {
  // Added trendingSlot prop
  const pathname = usePathname();
  const hideHeroRoutes = ["/login", "/settings", "/about", "/downloads"];
  const shouldShowHero = !hideHeroRoutes.includes(pathname);
  return (
    <SearchProvider>
      <QuerySyncer />
      <div
        className={`${josefin.className} min-h-screen bg-primary-950 text-primary-100 flex flex-col antialiased `}
      >
        <Header />
        {shouldShowHero && <Hero />}
        {shouldShowHero && trendingSlot}{" "}
        <div className="flex-1 px-8 py-12 grid">
          <main className="mx-auto w-full">{children}</main>
        </div>
        <Footer />
      </div>
    </SearchProvider>
  );
}
