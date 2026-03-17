import type { CorridorPoint } from "../db";

function toMetersLatLngDelta(latDiff: number, lngDiff: number, atLat: number) {
  const mLat = latDiff * 111_320;
  const mLng = lngDiff * (111_320 * Math.cos((atLat * Math.PI) / 180));
  return { x: mLng, y: mLat };
}

function pointSegmentDistanceMeters(p: CorridorPoint, a: CorridorPoint, b: CorridorPoint) {
  const atLat = (a.lat + b.lat + p.lat) / 3;
  const ap = toMetersLatLngDelta(p.lat - a.lat, p.lng - a.lng, atLat);
  const ab = toMetersLatLngDelta(b.lat - a.lat, b.lng - a.lng, atLat);
  const ab2 = ab.x * ab.x + ab.y * ab.y;
  if (ab2 === 0) return Math.hypot(ap.x, ap.y);
  const t = Math.max(0, Math.min(1, (ap.x * ab.x + ap.y * ab.y) / ab2));
  const projX = ab.x * t;
  const projY = ab.y * t;
  return Math.hypot(ap.x - projX, ap.y - projY);
}

export function minDistanceToCorridorMeters(p: CorridorPoint, corridor: CorridorPoint[]) {
  if (corridor.length < 2) return Number.POSITIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;
  for (let i = 0; i < corridor.length - 1; i++) {
    const d = pointSegmentDistanceMeters(p, corridor[i], corridor[i + 1]);
    if (d < min) min = d;
  }
  return min;
}

export function reverseVectorScore(
  prev: CorridorPoint,
  curr: CorridorPoint,
  target: CorridorPoint
): number {
  const atLat = (prev.lat + curr.lat + target.lat) / 3;
  const move = toMetersLatLngDelta(curr.lat - prev.lat, curr.lng - prev.lng, atLat);
  const toTarget = toMetersLatLngDelta(target.lat - curr.lat, target.lng - curr.lng, atLat);
  const moveNorm = Math.hypot(move.x, move.y);
  const targetNorm = Math.hypot(toTarget.x, toTarget.y);
  if (moveNorm === 0 || targetNorm === 0) return 0;
  const cos = (move.x * toTarget.x + move.y * toTarget.y) / (moveNorm * targetNorm);
  return cos;
}
