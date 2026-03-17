type State = { lastDist: number | null; accum: number; frozen: boolean; lastLat: number | null; lastLng: number | null };
const states: Map<string, State> = new Map();

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 = Math.sin(dLng / 2) ** 2;
  const c = s1 + Math.cos(lat1) * Math.cos(lat2) * s2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(c)));
}

export function getState(tripId: string): State {
  const s = states.get(tripId) || { lastDist: null, accum: 0, frozen: false, lastLat: null, lastLng: null };
  states.set(tripId, s);
  return s;
}

export function setFrozen(tripId: string, frozen: boolean) {
  const s = getState(tripId);
  s.frozen = frozen;
  states.set(tripId, s);
}
