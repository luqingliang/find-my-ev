"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { carMap } from "@/data/cars";
import { brandLabel, t } from "@/lib/i18n";
import { useCompareStore } from "@/lib/useCompareStore";
import { useLanguageStore } from "@/lib/useLanguageStore";
import type { Car } from "@/types/car";

export function CompareFab() {
  const pathname = usePathname();
  const ids = useCompareStore((s) => s.ids);
  const language = useLanguageStore((s) => s.language);
  const text = t(language);
  const compareCars = ids.map((id) => carMap.get(id)).filter((car): car is Car => Boolean(car));
  const compareHref = ids.length ? `/compare?ids=${ids.join(",")}` : "/compare";

  if (pathname === "/compare") return null;

  return (
    <div className="group fixed bottom-6 right-6 z-40">
      <div className="pointer-events-none absolute bottom-full right-0 mb-3 w-44 translate-y-2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:w-48">
        <div className="glass-panel p-2.5">
          <div className="flex items-center justify-between border-b border-white/60 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{text.compareBar}</p>
            <span className="glass-chip px-2 py-0.5 text-[11px] font-semibold text-slate-700">{ids.length}/4</span>
          </div>
          {compareCars.length ? (
            <ul className="mt-2 space-y-1.5">
              {compareCars.map((car) => (
                <li key={car.id} className="glass-soft rounded-lg px-2.5 py-2">
                  <p className="text-[11px] text-slate-500">{brandLabel(car.brand, car.brandZh, language)}</p>
                  <p className="text-xs font-semibold leading-5 text-slate-800">{car.model}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="glass-soft mt-2 rounded-lg px-2.5 py-2 text-xs text-slate-500">{text.compareQueueEmpty}</p>
          )}
        </div>
      </div>
      <Link href={compareHref} className="glass-btn glass-btn-primary inline-flex items-center px-4 py-3 text-sm font-semibold">
        {text.navCompare}（{ids.length}/4）
      </Link>
    </div>
  );
}
