"use client";
import { usePathname } from "next/navigation";
import Hero from "@/app/_components/hero";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/header";
import { Josefin_Sans } from "next/font/google";
import { SearchProvider } from "@/app/_components/SearchContext";
import "@/app/_styles/globals.css";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
export default function AppBody({ children }) {
  const pathname = usePathname();
  const hideHeroRoutes = ["/login", "/settings", "/about", "/downloads"];
  const shouldShowHero = !hideHeroRoutes.includes(pathname);
  return (
    <SearchProvider>
      <body
        className={`${josefin.className} min-h-screen bg-primary-950 text-primary-100 flex flex-col antialiased `}
      >
        <Header />
        {shouldShowHero && <Hero />}
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">{children}</main>
        </div>
        <Footer />
      </body>
    </SearchProvider>
  );
}
