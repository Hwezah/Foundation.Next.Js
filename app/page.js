import AppBody from "./AppBody";
import Trending from "./_components/TrendingClient";

export default function Page({ searchParams }) {
  return <AppBody trendingSlot={<Trending searchParams={searchParams} />} />;
}
