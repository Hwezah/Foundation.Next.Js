import Podcasts from "@/app/_lib/apis/podcastsApi";
import Sermons from "@/app/_lib/apis/sermonsApi";

export default function TrendingServer({ selected, query }) {
  if (selected === "Podcasts") return <Podcasts query={query} />;
  if (selected === "Sermons") return <Sermons query={query} />;
  return null;
}
