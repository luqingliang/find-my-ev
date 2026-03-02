"use client";

import Link from "next/link";
import { brandLabel, t } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/useLanguageStore";
import { Car } from "@/types/car";

export function CarDetailClient({ car }: { car: Car }) {
  const language = useLanguageStore((s) => s.language);
  const text = t(language);

  return (
    <div className="space-y-5">
      <section className="panel overflow-hidden">
        <img src={car.image} alt={car.model} className="h-64 w-full object-cover md:h-80" />
        <div className="space-y-3 p-5 md:p-6">
          <p className="text-sm uppercase tracking-wide text-slate-500">{brandLabel(car.brand, car.brandZh, language)}</p>
          <h1 className="text-3xl font-bold tracking-tight">{car.model}</h1>
          <p className="text-lg font-semibold text-emerald-700">
            {car.priceCny.toLocaleString()} {language === "zh" ? "元" : "CNY"}
          </p>
          <div className="flex flex-wrap gap-2">
            {car.highlights.map((item) => (
              <span key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-5 md:p-6">
        <h2 className="text-xl font-semibold">{text.coreSpecs}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <Metric label={text.range} value={`${car.rangeKm} km`} />
          <Metric label={text.battery} value={`${car.batteryKWh} kWh`} />
          <Metric label={text.maxPower} value={`${car.maxPowerKw} kW`} />
          <Metric label={text.zeroToHundred} value={`${car.zeroToHundredSec} s`} />
          <Metric label={text.charge} value={`${car.fastChargeMin} min`} />
          <Metric label={text.driveType} value={car.driveType} />
          <Metric label={text.seats} value={`${car.seats}`} />
          <Metric label={text.topSpeed} value={`${car.maxSpeedKmh} km/h`} />
        </div>
      </section>

      <div className="flex gap-2">
        <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">
          {text.navHome}
        </Link>
        <Link href={`/compare?ids=${car.id}`} className="rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white">
          {text.compareThis}
        </Link>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
