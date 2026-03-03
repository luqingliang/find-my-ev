import paramsRows from "@/data/dongchedi_params_table.json";
import pureModels from "@/data/dongchedi_brand_pure_ev_models.json";
import type { Car, CarParamSection } from "@/types/car";

type RawParamRow = {
  car_id: string;
  section: string;
  param_key: string;
  param_name: string;
  param_value: string;
  series_name: string;
  model_name: string;
};

type RawModel = {
  car_id: number;
  series_name: string;
  model_name: string;
  brand?: string;
  brand_zh?: string;
};

const rawRows = paramsRows as RawParamRow[];
const rawModels = pureModels as RawModel[];

const SECTION_ORDER = ["基本信息", "车身", "电动机", "电池/充电", "变速箱", "底盘/转向", "车轮/制动", "智能化配置"];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80";
const OPTIONAL_PACKAGE_SECTION = "选装包";
const NOA_FULL_SCENE_SUBSCRIPTION = "全场景领航辅助（NOA）订阅￥320/月";
const NOA_HIGHWAY_CITY_SUBSCRIPTION = "高速城快领航辅助（NOA）订阅￥320/月";
const NOA_FULL_SCENE_CANONICAL_VALUE =
  "包含:红绿灯路口通行、环岛通行、无红绿灯路口通行、开放路口通行、动态车道(可变转向车道、潮汐车道、公交专用道和多乘员车道等)通行、雨天模式（选配）。";
const NOA_HIGHWAY_CITY_CANONICAL_VALUE =
  "包含:主动防御性驾驶、自动上下匝道、自动变道超车、自动根据导航路线变道、自动避让汇入口、障碍物跨车道绕行（选配）。";

function normalizeSectionName(name: string): string {
  const v = String(name || "").trim();
  if (!v) return "选装包";
  return v;
}

function normalizeParamName(section: string, name: string, key: string): string {
  const cleanName = String(name || "").trim();
  const keyHasIndexSuffix = /_[1-9]\d*$/.test(String(key || "").trim());
  if (section !== "选装包" && !keyHasIndexSuffix) return cleanName;
  return cleanName.replace(/\s+[1-9]\d*$/, "").trim();
}

function mergeParamValue(section: string, existedValue: string, incomingValue: string): string {
  const a = String(existedValue ?? "").trim();
  const b = String(incomingValue ?? "").trim();
  if (!a) return b;
  if (!b) return a;

  const withMarker = (desc: string, marker: string) => (desc.includes(marker) ? desc : `${desc}（${marker}）`);
  if (a === "选配" && b !== "选配") return withMarker(b, "选配");
  if (b === "选配" && a !== "选配") return withMarker(a, "选配");
  if (a === "标配" && b !== "标配") return withMarker(b, "标配");
  if (b === "标配" && a !== "标配") return withMarker(a, "标配");

  if (section === "选装包" && a !== b) {
    // In option-package rows prefer the richer description when values differ.
    return b.length > a.length ? b : a;
  }

  return b.length > a.length ? b : a;
}

function normalizeNoaSubscriptionValue(name: string, value: string): string {
  const txt = String(value ?? "").trim();
  if (name === NOA_FULL_SCENE_SUBSCRIPTION) return NOA_FULL_SCENE_CANONICAL_VALUE;
  if (name === NOA_HIGHWAY_CITY_SUBSCRIPTION) return NOA_HIGHWAY_CITY_CANONICAL_VALUE;
  return txt;
}

function parsePriceCny(value: string): number {
  const txt = String(value || "").replace(/,/g, "").trim();
  const match = txt.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const num = Number(match[1]);
  if (!Number.isFinite(num)) return 0;
  if (txt.includes("万")) return Math.round(num * 10000);
  return Math.round(num);
}

function parseNumber(value: string): number {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const num = Number(match[0]);
  return Number.isFinite(num) ? num : 0;
}

function parseFastChargeMin(value: string): number {
  const txt = String(value || "");
  const hourMatch = txt.match(/快充\s*(\d+(?:\.\d+)?)\s*小时/);
  if (hourMatch) return Math.round(Number(hourMatch[1]) * 60);
  const minMatch = txt.match(/快充\s*(\d+(?:\.\d+)?)\s*分钟?/);
  if (minMatch) return Math.round(Number(minMatch[1]));
  return 0;
}

function pickValue(map: Record<string, string>, names: string[]): string {
  for (const name of names) {
    if (map[name]) return map[name];
  }
  return "";
}

function buildHighlights(map: Record<string, string>): string[] {
  const candidates: Array<[string, string[]]> = [
    ["续航", ["纯电续航里程(km)CLTC", "纯电续航里程(km)工信部"]],
    ["电池", ["电池容量(kWh)", "电池类型"]],
    ["快充", ["充电时间", "快充电量(%)"]],
    ["功率", ["电动机总功率(kW)", "最大功率(kW)"]],
    ["智能", ["车机系统", "辅助驾驶级别", "芯片算力(TOPS)"]]
  ];

  const out: string[] = [];
  for (const [label, names] of candidates) {
    const v = pickValue(map, names);
    if (v) out.push(`${label} ${v}`);
    if (out.length >= 3) break;
  }
  return out;
}

function sortSections(sections: CarParamSection[]): CarParamSection[] {
  return [...sections].sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a.name);
    const bi = SECTION_ORDER.indexOf(b.name);
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name, "zh-Hans-CN");
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function inferBrandFields(model: RawModel): { brand: string; brandZh: string } {
  const brand = String(model.brand || "").trim();
  const brandZh = String(model.brand_zh || "").trim();
  if (brand && brandZh) return { brand, brandZh };
  if (brand && !brandZh) return { brand, brandZh: brand };
  if (!brand && brandZh) return { brand: brandZh, brandZh };

  const series = String(model.series_name || "").trim();
  const zhPrefix = series.match(/^[\u4e00-\u9fff]+/)?.[0] || "";
  if (zhPrefix) return { brand: zhPrefix, brandZh: zhPrefix };
  if (series) return { brand: series, brandZh: series };
  return { brand: "Unknown", brandZh: "Unknown" };
}

export const cars: Car[] = rawModels
  .map((model) => {
    const carId = String(model.car_id);
    const rows = rawRows.filter((row) => row.car_id === carId);
    if (!rows.length) return null;

    const sectionsMap = new Map<string, CarParamSection>();
    const sectionParamNameIndex = new Map<string, Map<string, number>>();
    const valueMap: Record<string, string> = {};

    for (const row of rows) {
      const sectionName = normalizeSectionName(row.section);
      const paramName = normalizeParamName(sectionName, row.param_name, row.param_key);
      const paramValue = normalizeNoaSubscriptionValue(paramName, row.param_value);
      if (!sectionsMap.has(sectionName)) {
        sectionsMap.set(sectionName, { name: sectionName, items: [] });
        sectionParamNameIndex.set(sectionName, new Map<string, number>());
      }
      const nameIndex = sectionParamNameIndex.get(sectionName);
      const items = sectionsMap.get(sectionName)?.items ?? [];
      const existedIndex = nameIndex?.get(paramName);
      if (existedIndex === undefined) {
        sectionsMap.get(sectionName)?.items.push({
          key: row.param_key,
          name: paramName,
          value: paramValue
        });
        nameIndex?.set(paramName, items.length);
      } else {
        const existed = items[existedIndex];
        if (!existed) {
          sectionsMap.get(sectionName)?.items.push({
            key: row.param_key,
            name: paramName,
            value: paramValue
          });
          nameIndex?.set(paramName, items.length);
        } else {
          const mergedValue = mergeParamValue(sectionName, existed.value, paramValue);
          items[existedIndex] = {
            key: mergedValue === existed.value ? existed.key : row.param_key,
            name: paramName,
            value: mergedValue
          };
        }
      }

      valueMap[paramName] = mergeParamValue(sectionName, valueMap[paramName], paramValue);
    }

    const optionSection = sectionsMap.get(OPTIONAL_PACKAGE_SECTION);
    if (optionSection) {
      const hasHighwayCityNoa = optionSection.items.some((item) => item.name === NOA_HIGHWAY_CITY_SUBSCRIPTION);
      const fullSceneNoa = optionSection.items.find((item) => item.name === NOA_FULL_SCENE_SUBSCRIPTION);

      if (!hasHighwayCityNoa && fullSceneNoa) {
        optionSection.items.push({
          key: "synthetic_noa_highway_city_subscription",
          name: NOA_HIGHWAY_CITY_SUBSCRIPTION,
          value: NOA_HIGHWAY_CITY_CANONICAL_VALUE
        });
        valueMap[NOA_HIGHWAY_CITY_SUBSCRIPTION] = NOA_HIGHWAY_CITY_CANONICAL_VALUE;
      }
    }

    const paramsBySection = sortSections([...sectionsMap.values()]);

    const priceCny = parsePriceCny(pickValue(valueMap, ["官方指导价"]));
    const rangeKm = parseNumber(pickValue(valueMap, ["纯电续航里程(km)CLTC", "纯电续航里程(km)工信部"]));
    const fastChargeMin = parseFastChargeMin(pickValue(valueMap, ["充电时间"]));
    const zeroToHundredSec = parseNumber(pickValue(valueMap, ["官方百公里加速时间(s)"]));
    const { brand, brandZh } = inferBrandFields(model);

    return {
      id: `car-${carId}`,
      brand,
      brandZh,
      model: model.model_name,
      searchAliases: [brandZh, brand, model.series_name, model.model_name, carId],
      priceCny,
      rangeKm,
      zeroToHundredSec,
      fastChargeMin,
      image: PLACEHOLDER_IMAGE,
      highlights: buildHighlights(valueMap),
      paramsBySection,
      paramValueByName: valueMap
    } as Car;
  })
  .filter((item): item is Car => Boolean(item));

export const carMap = new Map(cars.map((car) => [car.id, car]));
export const brandOptions = Array.from(new Set(cars.map((car) => car.brand)));
