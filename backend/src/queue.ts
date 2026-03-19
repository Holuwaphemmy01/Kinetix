import PgBoss from "pg-boss";
import { DATABASE_FALLBACK_URL, DATABASE_URL } from "./config";
import { addTripEvent } from "./db";

const JOB_TICK_STREAM = "vault_tick_stream";
const JOB_REPORT_DEVIATION = "vault_report_deviation";
const JOB_REPORT_REENTRY = "vault_report_reentry";
const JOB_SETTLE = "vault_settle";
const JOB_DEPOSIT_ESCROW = "vault_deposit_escrow";
const JOBS = [JOB_TICK_STREAM, JOB_REPORT_DEVIATION, JOB_REPORT_REENTRY, JOB_SETTLE, JOB_DEPOSIT_ESCROW] as const;

let boss: PgBoss | null = null;
let started = false;
let workersAttached = false;
const enqueuedCounts: Record<string, number> = {};
const processedOkCounts: Record<string, number> = {};
const processedErrorCounts: Record<string, number> = {};
for (const job of JOBS) {
  enqueuedCounts[job] = 0;
  processedOkCounts[job] = 0;
  processedErrorCounts[job] = 0;
}

function primaryConnectionString() {
  const base = DATABASE_URL || DATABASE_FALLBACK_URL || "";
  return base.replace(/^postgresql:\/\//, "postgres://");
}

function getBoss() {
  if (!boss) {
    boss = new PgBoss({
      connectionString: primaryConnectionString()
    });
  }
  return boss;
}

type LoggerLike = {
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
};

export async function setupQueue(vault: any, log: LoggerLike) {
  const q = getBoss();
  if (!started) {
    await q.start();
    started = true;
  }
  if (workersAttached) return;

  await q.work(JOB_TICK_STREAM, async (job: any) => {
    try {
      const d = job.data as { tripId: string; tripIdHex: string; amountWei: string };
      await vault.tickStream(d.tripIdHex, BigInt(d.amountWei));
      await addTripEvent(d.tripId, "job_tick_stream_ok", { amountWei: d.amountWei });
      processedOkCounts[JOB_TICK_STREAM]++;
    } catch (e) {
      processedErrorCounts[JOB_TICK_STREAM]++;
      throw e;
    }
  });

  await q.work(JOB_REPORT_DEVIATION, async (job: any) => {
    try {
      const d = job.data as { tripId: string; tripIdHex: string; vectorScaled: number };
      await vault.reportDeviation(d.tripIdHex, BigInt(d.vectorScaled));
      await addTripEvent(d.tripId, "job_report_deviation_ok", { vectorScaled: d.vectorScaled });
      processedOkCounts[JOB_REPORT_DEVIATION]++;
    } catch (e) {
      processedErrorCounts[JOB_REPORT_DEVIATION]++;
      throw e;
    }
  });

  await q.work(JOB_REPORT_REENTRY, async (job: any) => {
    try {
      const d = job.data as { tripId: string; tripIdHex: string };
      await vault.reportReentry(d.tripIdHex);
      await addTripEvent(d.tripId, "job_report_reentry_ok", {});
      processedOkCounts[JOB_REPORT_REENTRY]++;
    } catch (e) {
      processedErrorCounts[JOB_REPORT_REENTRY]++;
      throw e;
    }
  });

  await q.work(JOB_SETTLE, async (job: any) => {
    try {
      const d = job.data as { tripId: string; tripIdHex: string };
      await vault.settle(d.tripIdHex);
      await addTripEvent(d.tripId, "job_settle_ok", {});
      processedOkCounts[JOB_SETTLE]++;
    } catch (e) {
      processedErrorCounts[JOB_SETTLE]++;
      throw e;
    }
  });

  await q.work(JOB_DEPOSIT_ESCROW, async (job: any) => {
    try {
      const d = job.data as {
        tripId: string;
        tripIdHex: string;
        customer: string;
        rider: string;
        amountCngnWei: string;
      };
      await vault.depositEscrow(d.tripIdHex, d.customer, d.rider, BigInt(d.amountCngnWei));
      await addTripEvent(d.tripId, "job_deposit_escrow_ok", { amountCngnWei: d.amountCngnWei });
      processedOkCounts[JOB_DEPOSIT_ESCROW]++;
    } catch (e) {
      processedErrorCounts[JOB_DEPOSIT_ESCROW]++;
      throw e;
    }
  });

  workersAttached = true;
  log.info({ queue: "pg-boss", jobs: 5 }, "queue_ready");
}

async function send(name: string, data: object) {
  const q = getBoss();
  if (!started) {
    await q.start();
    started = true;
  }
  await q.send(name, data, {
    retryLimit: 8,
    retryDelay: 2
  });
  if (name in enqueuedCounts) {
    enqueuedCounts[name]++;
  }
}

export async function enqueueTickStream(input: { tripId: string; tripIdHex: string; amountWei: string }) {
  await send(JOB_TICK_STREAM, input);
}

export async function enqueueReportDeviation(input: { tripId: string; tripIdHex: string; vectorScaled: number }) {
  await send(JOB_REPORT_DEVIATION, input);
}

export async function enqueueReportReentry(input: { tripId: string; tripIdHex: string }) {
  await send(JOB_REPORT_REENTRY, input);
}

export async function enqueueSettle(input: { tripId: string; tripIdHex: string }) {
  await send(JOB_SETTLE, input);
}

export async function enqueueDepositEscrow(input: {
  tripId: string;
  tripIdHex: string;
  customer: string;
  rider: string;
  amountCngnWei: string;
}) {
  await send(JOB_DEPOSIT_ESCROW, input);
}

export function getQueueHealth() {
  return {
    started,
    workersAttached,
    jobs: [...JOBS],
    enqueuedCounts: { ...enqueuedCounts },
    processedOkCounts: { ...processedOkCounts },
    processedErrorCounts: { ...processedErrorCounts }
  };
}
