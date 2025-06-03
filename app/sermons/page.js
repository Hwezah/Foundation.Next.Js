import Sermons from "@/app/_lib/api/sermonsApi";

export default function Page({ searchParams }) {
  return <Sermons query={searchParams.query} />;
}
