import { notFound } from "next/navigation";
import { carSeriesMap } from "@/data/cars";
import { SeriesDetailClient } from "@/components/series-detail-client";

type SeriesPageProps = {
  params: Promise<{ name: string }>;
};

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { name } = await params;
  let seriesName = name;
  try {
    seriesName = decodeURIComponent(name);
  } catch {
    seriesName = name;
  }
  const series = carSeriesMap.get(seriesName);

  if (!series) {
    notFound();
  }

  return <SeriesDetailClient series={series} />;
}
