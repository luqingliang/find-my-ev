"use client";

import Fuse from "fuse.js";
import { useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { brandOptions, carSeriesList } from "@/data/cars";
import { brandLabel, t } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/useLanguageStore";

type SortType = "price-asc" | "range-desc" | "charge-asc";
const computedMaxPrice = Math.ceil(Math.max(...carSeriesList.map((series) => series.minPriceCny)) / 5000) * 5000;
const MAX_PRICE = computedMaxPrice > 0 ? computedMaxPrice : 5000;

export function CarList() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minRange, setMinRange] = useState(0);
  const [sort, setSort] = useState<SortType>("price-asc");

  const language = useLanguageStore((s) => s.language);
  const text = t(language);
  const pricePercent = (maxPrice / MAX_PRICE) * 100;
  const rangePercent = (minRange / 900) * 100;

  const fuse = useMemo(
    () =>
      new Fuse(carSeriesList, {
        keys: ["name", "brand", "brandZh", "searchAliases"],
        threshold: 0.3
      }),
    []
  );

  const filteredSeries = useMemo(() => {
    const keywordSeries = keyword.trim()
      ? fuse.search(keyword.trim()).map((result) => result.item)
      : carSeriesList;

    return keywordSeries
      .filter((series) => series.minPriceCny <= maxPrice)
      .filter((series) => series.maxRangeKm >= minRange)
      .filter((series) => (selectedBrands.length ? selectedBrands.includes(series.brand) : true))
      .sort((a, b) => {
        if (sort === "range-desc") return b.maxRangeKm - a.maxRangeKm;
        if (sort === "charge-asc") return a.fastestChargeMin - b.fastestChargeMin;
        return a.minPriceCny - b.minPriceCny;
      });
  }, [fuse, keyword, maxPrice, minRange, selectedBrands, sort]);

  return (
    <div className="space-y-5">
      <section className="panel p-4 md:p-5">
        <h1 className="text-2xl font-bold tracking-tight">{text.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{text.subtitle}</p>
      </section>

      <section className="panel p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-2 text-sm">
            <span className="font-medium">{text.keyword}</span>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={text.keywordPlaceholder}
                className="glass-field w-full px-3 py-2"
              />
            </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">
              {text.maxPrice}：{maxPrice.toLocaleString()} {language === "zh" ? "元" : "CNY"}
            </span>
              <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="single-range w-full"
              style={{ "--range-progress": `${pricePercent}%` } as CSSProperties}
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">
              {text.minRange}：{minRange} km
            </span>
            <input
              type="range"
              min={0}
              max={900}
              step={50}
              value={minRange}
              onChange={(e) => setMinRange(Number(e.target.value))}
              className="single-range w-full"
              style={{ "--range-progress": `${rangePercent}%` } as CSSProperties}
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">{text.sort}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
                className="glass-field w-full px-3 py-2"
              >
              <option value="price-asc">{text.sortPrice}</option>
              <option value="range-desc">{text.sortRange}</option>
              <option value="charge-asc">{text.sortCharge}</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {brandOptions.map((brand) => {
            const active = selectedBrands.includes(brand);
            const series = carSeriesList.find((item) => item.brand === brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() =>
                  setSelectedBrands((prev) =>
                    prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]
                  )
                }
                className={`glass-chip px-3 py-1 text-sm transition ${
                  active
                    ? "border-cyan-200 bg-cyan-100/70 text-cyan-900"
                    : "text-slate-700 hover:border-white"
                }`}
              >
                {series ? brandLabel(series.brand, series.brandZh, language) : brand}
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
          <span>
            {text.results}：{filteredSeries.length} {text.seriesUnit}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredSeries.map((series) => {
            const cover = series.cars[0];
            return (
              <article
                key={series.id}
                className="glass-panel cursor-pointer overflow-hidden transition hover:-translate-y-0.5"
                onClick={() => router.push(`/series/${series.id}`)}
              >
                <div className="relative h-44 w-full">
                  <Image src={cover.image} alt={series.name} fill unoptimized className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{brandLabel(series.brand, series.brandZh, language)}</p>
                      <h2 className="text-lg font-semibold">{series.name}</h2>
                      <p className="text-xs text-slate-500">
                        {series.cars.length} {text.modelsUnit}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                    <div>
                      <p>{text.range}</p>
                      <p className="font-semibold text-ink">{series.maxRangeKm} km</p>
                    </div>
                    <div>
                      <p>{text.charge}</p>
                      <p className="font-semibold text-ink">{series.fastestChargeMin || "-"} {series.fastestChargeMin ? "min" : ""}</p>
                    </div>
                    <div>
                      <p>{text.price}</p>
                      <p className="font-semibold text-ink">
                        {series.minPriceCny ? `${series.minPriceCny.toLocaleString()} ${language === "zh" ? "元起" : "CNY+"}` : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="glass-soft rounded-lg p-2">
                    <p className="text-center text-sm font-semibold text-ink">{text.viewSeries}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
