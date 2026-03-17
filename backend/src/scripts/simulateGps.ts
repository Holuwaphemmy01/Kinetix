const BASE_URL = process.env.SIM_BASE_URL || "http://localhost:4000";
const TRIP_ID = process.env.SIM_TRIP_ID || "demo-trip-001";
const BUFFER_METERS = Number(process.env.SIM_BUFFER_METERS || 80);

type Point = { lat: number; lng: number };

const corridor: Point[] = [
  { lat: 6.5244, lng: 3.3792 },
  { lat: 6.526, lng: 3.382 },
  { lat: 6.528, lng: 3.386 },
  { lat: 6.53, lng: 3.39 }
];

const gpsTrack: Point[] = [
  { lat: 6.5245, lng: 3.3793 },
  { lat: 6.5252, lng: 3.3807 },
  { lat: 6.5262, lng: 3.3821 },
  { lat: 6.541, lng: 3.42 },
  { lat: 6.527, lng: 3.3845 },
  { lat: 6.5286, lng: 3.3872 },
  { lat: 6.53, lng: 3.39 }
];

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  let data: unknown = text;
  try { data = JSON.parse(text); } catch {}
  return { status: res.status, data };
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("sim_start", { BASE_URL, TRIP_ID, BUFFER_METERS });
  const setCorridor = await post(`/api/trips/${TRIP_ID}/corridor`, {
    corridor,
    bufferMeters: BUFFER_METERS
  });
  console.log("set_corridor", setCorridor);

  for (let i = 0; i < gpsTrack.length; i++) {
    const p = gpsTrack[i];
    const r = await post("/api/gps/ingest", {
      tripId: TRIP_ID,
      lat: p.lat,
      lng: p.lng,
      dropLat: corridor[corridor.length - 1].lat,
      dropLng: corridor[corridor.length - 1].lng,
      timestamp: Date.now(),
      rider: "demo-rider"
    });
    console.log("gps", i + 1, r);
    await delay(700);
  }
  console.log("sim_done");
}

run().catch((e) => {
  console.error("sim_failed", e);
  process.exit(1);
});
