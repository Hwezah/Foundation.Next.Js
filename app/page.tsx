import AppBody from "./AppBody";
import Trending from "./_components/Trending";

export default function Page({ searchParams }) {
  return <AppBody trendingSlot={<Trending searchParams={searchParams} />} />;
}
