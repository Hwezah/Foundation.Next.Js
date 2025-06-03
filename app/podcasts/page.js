import Podcasts from "@/app/_lib/api/podcastsApi";

export default function Page({ searchParams }) {
  return <Podcasts query={searchParams.query} />;
}
