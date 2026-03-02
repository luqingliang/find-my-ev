export type Car = {
  id: string;
  brand: string;
  brandZh: string;
  model: string;
  searchAliases: string[];
  priceCny: number;
  rangeKm: number;
  batteryKWh: number;
  maxPowerKw: number;
  zeroToHundredSec: number;
  maxSpeedKmh: number;
  fastChargeMin: number;
  driveType: "FWD" | "RWD" | "AWD";
  seats: number;
  image: string;
  highlights: string[];
};
