import { ComparePageClient } from "@/components/compare-page-client";

type ComparePageProps = {
  searchParams: Promise<{ ids?: string }>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { ids = "" } = await searchParams;
  const queryIds = ids.split(",").filter(Boolean);
  return <ComparePageClient queryIds={queryIds} />;
}
