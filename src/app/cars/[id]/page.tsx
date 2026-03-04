import { notFound } from "next/navigation";
import { CarDetailClient } from "@/components/car-detail-client";
import { carMap } from "@/data/cars";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = carMap.get(id);

  if (!car) {
    notFound();
  }

  return <CarDetailClient car={car} />;
}
