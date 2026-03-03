export type CarParam = {
  key: string;
  name: string;
  value: string;
};

export type CarParamSection = {
  name: string;
  items: CarParam[];
};

export type Car = {
  id: string;
  brand: string;
  brandZh: string;
  model: string;
  searchAliases: string[];
  priceCny: number;
  rangeKm: number;
  zeroToHundredSec: number;
  fastChargeMin: number;
  image: string;
  highlights: string[];
  paramsBySection: CarParamSection[];
  paramValueByName: Record<string, string>;
};
