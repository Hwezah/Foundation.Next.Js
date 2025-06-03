import AppBody from "./AppBody";
import Trending from "./_components/TrendingClient"; // or the correct path

export default function Page({ searchParams }) {
  return (
    <AppBody trendingSlot={<Trending searchParams={searchParams} />} /> )
 
}
