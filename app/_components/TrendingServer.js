import Podcasts from "@/app/api/podcasts/podcastsApi";
import Sermons from "@/app/api/sermons/sermonsApi";
// import Bible from "./Bible";
export default function TrendingServer({ selected, query }) {
  if (selected === "Podcasts") return <Podcasts query={query} />;
  if (selected === "Sermons") return <Sermons query={query} />; // Sermons is the default if no query
  return null;
}
