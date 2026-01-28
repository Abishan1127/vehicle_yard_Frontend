import { sampleVehicles } from "../data/sampleData";

const KEY = "vehicle_yard_data_v2";


export function loadVehicles() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(sampleVehicles));
  return sampleVehicles;
}

export function saveVehicles(vehicles) {
  localStorage.setItem(KEY, JSON.stringify(vehicles));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

// Finance helpers
export function getMaintenanceTotal(vehicle) {
  return (vehicle.finance?.maintenance || []).reduce((sum, m) => sum + (Number(m.cost) || 0), 0);
}

export function getCostTotal(vehicle) {
  const bought = Number(vehicle.finance?.boughtPrice) || 0;
  return bought + getMaintenanceTotal(vehicle);
}

export function getProfit(vehicle) {
  const sold = Number(vehicle.finance?.soldPrice) || 0;
  return sold - getCostTotal(vehicle);
}

export function ymKey(dateStr) {
  // YYYY-MM
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function yKey(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return String(d.getFullYear());
}

export function aggregateProfit(vehicles) {
  // Only sold vehicles count for realized profit
  const sold = vehicles.filter(v => v.status === "sold" && v.finance?.soldDate);

  const monthly = {}; // { "2026-01": profitSum }
  const yearly = {};  // { "2026": profitSum }

  for (const v of sold) {
    const p = getProfit(v);
    const mk = ymKey(v.finance.soldDate);
    const yk = yKey(v.finance.soldDate);

    if (mk) monthly[mk] = (monthly[mk] || 0) + p;
    if (yk) yearly[yk] = (yearly[yk] || 0) + p;
  }

  return { monthly, yearly };
}
