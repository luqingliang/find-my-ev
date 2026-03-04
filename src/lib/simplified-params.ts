export const SIMPLIFIED_PARAMS: Array<{ label: string; keys: string[] }> = [
  { label: "上市时间", keys: ["上市时间"] },
  { label: "纯电续航里程(km)CLTC", keys: ["纯电续航里程(km)CLTC"] },
  { label: "长x宽x高(mm)", keys: ["长x宽x高(mm)"] },
  { label: "轴距(mm)", keys: ["轴距(mm)"] },
  { label: "整备质量(kg)", keys: ["整备质量(kg)"] },
  { label: "座位数(个)", keys: ["座位数(个)"] },
  { label: "电动机总功率(kW)", keys: ["电动机总功率(kW)"] },
  { label: "电动机总扭矩(N·m)", keys: ["电动机总扭矩(N·m)"] },
  { label: "电池类型", keys: ["电池类型"] },
  { label: "电池组质保", keys: ["电池组质保"] },
  { label: "电池容量(kWh)", keys: ["电池容量(kWh)"] },
  { label: "电芯品牌", keys: ["电芯品牌"] },
  { label: "电池充电倍率", keys: ["电池充电倍率"] },
  { label: "驱动方式", keys: ["驱动方式"] },
  { label: "前悬挂形式", keys: ["前悬挂形式"] },
  { label: "后悬挂形式", keys: ["后悬挂形式"] },
  { label: "车载智能芯片", keys: ["车载智能芯片"] },
  { label: "热泵管理系统", keys: ["热泵管理系统"] },
  { label: "车机系统内存(GB)", keys: ["车机系统内存(GB)"] },
  { label: "辅助驾驶芯片算力(TOPS)", keys: ["辅助驾驶芯片算力(TOPS)"] },
  { label: "辅助驾驶芯片", keys: ["辅助驾驶芯片"] },
  { label: "车机系统存储(GB)", keys: ["车机系统存储(GB)"] },
  { label: "抬头显示系统(HUD)", keys: ["抬头显示系统(HUD)"] },
  { label: "HUD投影尺寸(英寸)", keys: ["HUD投影尺寸(英寸)"] },
  { label: "手机无线充电最大功率(W)", keys: ["手机无线充电最大功率(W)", "手机无线充电"] },
  { label: "110V/220V/230V电源插座", keys: ["110V/220V/230V电源插座"] },
  { label: "扬声器数量(个)", keys: ["扬声器数量(个)"] },
  { label: "功放最大输出功率(W)", keys: ["功放最大输出功率(W)"] },
  { label: "中控屏尺寸(英寸)", keys: ["中控屏尺寸(英寸)"] },
  { label: "4G/5G网络", keys: ["4G/5G网络"] }
];

export function createSimplifiedParamNameSet() {
  const names = new Set<string>();
  for (const item of SIMPLIFIED_PARAMS) {
    names.add(item.label);
    for (const key of item.keys) names.add(key);
  }
  return names;
}

export function createSimplifiedParamLookup() {
  const aliasToCanonical = new Map<string, string>();
  const canonicalToKeys = new Map<string, string[]>();

  for (const item of SIMPLIFIED_PARAMS) {
    canonicalToKeys.set(item.label, item.keys);
    aliasToCanonical.set(item.label, item.label);
    for (const key of item.keys) aliasToCanonical.set(key, item.label);
  }

  return { aliasToCanonical, canonicalToKeys };
}
