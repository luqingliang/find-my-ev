import { Language } from "@/lib/useLanguageStore";

export const messages = {
  zh: {
    siteTitle: "找到我的车",
    navCompare: "查看对比",
    navHome: "返回列表",
    title: "电动车查询与对比",
    subtitle: "按车系搜索和筛选，先查看车系，再进入车系内选择具体车型。",
    keyword: "关键词",
    keywordPlaceholder: "例如：800V / Tesla / 特斯拉 / 四驱",
    priceRange: "价格区间",
    minPrice: "最低价格",
    maxPrice: "最高价格",
    minRange: "最低续航",
    sort: "排序",
    sortPrice: "价格从低到高",
    sortRange: "续航从高到低",
    sortCharge: "快充时间从快到慢",
    results: "结果",
    compareBar: "对比栏",
    compareQueueEmpty: "暂无加入对比的车型",
    added: "已加入对比",
    addCompare: "加入对比",
    viewDetail: "查看详情",
    range: "续航(CLTC)",
    charge: "快充时间",
    zeroToHundred: "0-100公里加速",
    emptyCompare: "对比列表为空",
    emptyCompareDesc: "请先从列表页添加 2-4 台车型再查看对比。",
    backToList: "返回列表页",
    compareTitle: "车型对比",
    selectedCars: "当前已选",
    carsUnit: "台车",
    continueAdd: "继续添加",
    clearCompare: "清空对比",
    parameters: "参数",
    categoryDimensions: "尺寸参数",
    categoryBatteryRange: "电池续航",
    categorySmart: "智能化",
    categoryPerformance: "性能",
    price: "价格",
    battery: "电池",
    dimensions: "长x宽x高(mm)",
    wheelbase: "轴距(mm)",
    batteryType: "电池类型",
    chargeRate: "充电倍率",
    voltagePlatform: "电压平台",
    curbWeight: "整备质量",
    maxPower: "最大功率",
    cockpitChip: "座舱芯片",
    adChip: "智驾芯片",
    adCompute: "智驾算力",
    coreSpecs: "核心参数",
    driveType: "驱动形式",
    seats: "座位数",
    topSpeed: "最高时速",
    compareThis: "仅对比此车型",
    seriesUnit: "个车系",
    modelsUnit: "款车型",
    viewSeries: "查看车系",
    backToSeries: "返回车系"
  },
  en: {
    siteTitle: "FindMyEV",
    navCompare: "Compare",
    navHome: "Back to List",
    title: "EV Search & Comparison",
    subtitle: "Search and filter by EV series, then choose specific trims inside each series.",
    keyword: "Keyword",
    keywordPlaceholder: "e.g. 800V / Tesla / 特斯拉 / AWD",
    priceRange: "Price Range",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    minRange: "Min Range",
    sort: "Sort",
    sortPrice: "Price: Low to High",
    sortRange: "Range: High to Low",
    sortCharge: "Fast Charge: Quick to Slow",
    results: "Results",
    compareBar: "Compare",
    compareQueueEmpty: "No cars in compare queue",
    added: "Added",
    addCompare: "Add to Compare",
    viewDetail: "View Details",
    range: "Range(CLTC)",
    charge: "Fast Charge",
    zeroToHundred: "0-100 km/h",
    emptyCompare: "Comparison is Empty",
    emptyCompareDesc: "Add 2-4 vehicles from the list page first.",
    backToList: "Back to List",
    compareTitle: "Vehicle Comparison",
    selectedCars: "Selected",
    carsUnit: "cars",
    continueAdd: "Add More",
    clearCompare: "Clear",
    parameters: "Parameters",
    categoryDimensions: "Dimensions",
    categoryBatteryRange: "Battery & Range",
    categorySmart: "Smart",
    categoryPerformance: "Performance",
    price: "Price",
    battery: "Battery",
    dimensions: "L x W x H (mm)",
    wheelbase: "Wheelbase (mm)",
    batteryType: "Battery Type",
    chargeRate: "Charge Rate",
    voltagePlatform: "Voltage Platform",
    curbWeight: "Curb Weight",
    maxPower: "Max Power",
    cockpitChip: "Cockpit Chip",
    adChip: "AD Chip",
    adCompute: "AD Compute",
    coreSpecs: "Core Specs",
    driveType: "Drive Type",
    seats: "Seats",
    topSpeed: "Top Speed",
    compareThis: "Compare This",
    seriesUnit: "series",
    modelsUnit: "trims",
    viewSeries: "View Series",
    backToSeries: "Back to Series"
  }
} as const;

export function t(language: Language) {
  return messages[language];
}

export function brandLabel(brand: string, brandZh: string, language: Language) {
  return language === "zh" ? brandZh : brand;
}

export function driveTypeLabel(driveType: "FWD" | "RWD" | "AWD", language: Language) {
  if (language === "en") return driveType;
  if (driveType === "FWD") return "前驱";
  if (driveType === "RWD") return "后驱";
  return "四驱";
}

export function batteryTypeLabel(batteryType: string, language: Language) {
  if (language === "en") {
    if (batteryType === "LFP") return "LFP";
    if (batteryType === "NCM") return "NCM";
    return batteryType;
  }
  if (batteryType === "LFP") return "磷酸铁锂";
  if (batteryType === "NCM") return "三元锂";
  return batteryType;
}
