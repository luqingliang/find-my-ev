"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";
import { brandLabel, t } from "@/lib/i18n";
import { carMap } from "@/data/cars";
import { createSimplifiedParamLookup } from "@/lib/simplified-params";
import { useCompareStore } from "@/lib/useCompareStore";
import { useLanguageStore } from "@/lib/useLanguageStore";
import type { Car } from "@/types/car";

const MAX_COMPARE_COUNT = 4;

export function ComparePageClient({ queryIds }: { queryIds: string[] }) {
  const ids = useCompareStore((s) => s.ids);
  const setIds = useCompareStore((s) => s.setIds);
  const clear = useCompareStore((s) => s.clear);
  const language = useLanguageStore((s) => s.language);
  const text = t(language);
  const [simpleMode, setSimpleMode] = useState(true);
  const simplifiedLookup = useMemo(() => createSimplifiedParamLookup(), []);

  useEffect(() => {
    setIds(queryIds);
  }, [queryIds, setIds]);

  const cars = useMemo(() => ids.map((id) => carMap.get(id)).filter((car): car is Car => Boolean(car)), [ids]);

  const specCategories = useMemo(() => {
    const sectionMap = new Map<string, Set<string>>();
    const order: string[] = [];

    for (const car of cars) {
      for (const section of car.paramsBySection) {
        if (!sectionMap.has(section.name)) {
          sectionMap.set(section.name, new Set<string>());
          order.push(section.name);
        }
        for (const item of section.items) {
          sectionMap.get(section.name)?.add(item.name);
        }
      }
    }

    const categories = order.map((sectionName) => ({
      title: sectionName,
      rows: [...(sectionMap.get(sectionName) ?? [])].map((label) => ({
        label,
        render: (id: string) => {
          const car = carMap.get(id);
          return car?.paramValueByName[label] || "-";
        }
      }))
    }));

    if (!simpleMode) return categories;

    return categories
      .map((category) => {
        const rowMap = new Map<string, { label: string; render: (id: string) => string }>();
        for (const row of category.rows) {
          const canonicalLabel = simplifiedLookup.aliasToCanonical.get(row.label);
          if (!canonicalLabel || rowMap.has(canonicalLabel)) continue;
          rowMap.set(canonicalLabel, {
            label: canonicalLabel,
            render: (id: string) => {
              const car = carMap.get(id);
              if (!car) return "-";
              const keys = simplifiedLookup.canonicalToKeys.get(canonicalLabel) ?? [canonicalLabel];
              for (const key of keys) {
                const value = car.paramValueByName[key];
                if (String(value || "").trim().length > 0) return value;
              }
              return "-";
            }
          });
        }
        return { ...category, rows: [...rowMap.values()] };
      })
      .filter((category) => category.rows.length > 0);
  }, [cars, simpleMode, simplifiedLookup]);

  const columns = `140px repeat(${cars.length}, minmax(0, 1fr))`;

  if (!cars.length) {
    return (
      <section className="panel p-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{text.emptyCompare}</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{text.emptyCompareDesc}</p>
        <Link href="/" className="glass-btn glass-btn-primary mt-6 inline-block px-6 py-3 text-sm font-semibold">
          {text.backToList}
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="panel relative p-8 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4 lg:pr-52">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{text.parameters}</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{text.compareTitle}</h1>
            <p className="text-sm text-slate-600">
              {text.selectedCars} {cars.length} {text.carsUnit}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3 lg:absolute lg:right-10 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2">
          <div className="glass-chip p-1">
            <button
              type="button"
              onClick={() => setSimpleMode(false)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                !simpleMode ? "glass-btn-primary text-black" : "text-slate-700 hover:bg-white/60"
              }`}
            >
              {language === "zh" ? "完整" : "Full"}
            </button>
            <button
              type="button"
              onClick={() => setSimpleMode(true)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                simpleMode ? "glass-btn-primary text-black" : "text-slate-700 hover:bg-white/60"
              }`}
            >
              {language === "zh" ? "简化" : "Simple"}
            </button>
          </div>
        </div>
      </section>

      <section className="panel overflow-x-auto rounded-3xl">
        <div className="min-w-[760px] p-4 md:min-w-0 md:p-6">
          <div className="grid gap-x-3 gap-y-4" style={{ gridTemplateColumns: columns }}>
            <div />
            {cars.map((car) => (
              <article key={car.id} className="relative rounded-2xl px-4 py-5 text-center">
                <button
                  type="button"
                  onClick={() => setIds(ids.filter((id) => id !== car.id))}
                  className="glass-btn absolute right-2 top-2 flex h-6 w-6 items-center justify-center text-sm leading-none text-slate-500"
                  aria-label={language === "zh" ? "移除该车型" : "Remove this vehicle"}
                >
                  ×
                </button>
                <div className="mx-auto flex h-24 w-full items-center justify-center overflow-hidden rounded-xl">
                  <Image src={car.image} alt={car.model} width={320} height={180} unoptimized className="h-20 w-auto object-contain" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {brandLabel(car.brand, car.brandZh, language)}
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-tight">{car.model}</h2>
              </article>
            ))}

            {specCategories.map((category) => (
              <Fragment key={category.title}>
                <div
                  className="mt-2 bg-transparent pl-0 pr-3 py-2 text-left text-xl font-bold uppercase tracking-wide text-slate-700 md:text-2xl"
                  style={{ gridColumn: "1 / -1" }}
                >
                  {category.title}
                </div>
                <div className="border-b border-slate-300/80" style={{ gridColumn: "1 / -1" }} />
                {category.rows.map((row) => (
                  <Fragment key={`${category.title}-${row.label}`}>
                    <div className="flex items-center py-4 text-sm font-normal text-gray-500">
                      {row.label}
                    </div>
                    {cars.map((car) => (
                      <div
                        key={`${row.label}-${car.id}`}
                        className="flex items-center justify-center py-4 text-center text-base font-semibold text-ink"
                      >
                        {row.render(car.id)}
                      </div>
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-40">
        {cars.length < MAX_COMPARE_COUNT ? (
          <Link href="/" className="glass-btn glass-btn-primary inline-flex items-center px-4 py-3 text-sm font-semibold">
            {text.continueAdd}
          </Link>
        ) : (
          <button
            onClick={clear}
            className="glass-btn glass-btn-danger inline-flex items-center px-4 py-3 text-sm font-semibold"
          >
            {text.clearCompare}
          </button>
        )}
      </div>
    </div>
  );
}
