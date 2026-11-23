/*
 * Drains match_outbox by repeatedly calling public.process_match_outbox(),
 * which claims ONE event, refreshes match_candidates, and commits - all in a
 * single round trip and a single short transaction (see 10_match_candidates.sql).
*/
import { Client, Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("Set DATABASE_URL");

const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4);
const IDLE_POLL_MS = Number(process.env.IDLE_POLL_MS ?? 3000);
const SWEEP_EVERY_MS = 10 * 60 * 1000;
const USE_LISTEN = process.env.USE_LISTEN === "1";

const pool = new Pool({ connectionString: DATABASE_URL, max: CONCURRENCY + 1 });
let stopping = false;

// Sleep that can be interrupted (NOTIFY or shutdown) for ALL sleeping loops.
const sleepers = new Set<() => void>();
const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timer);
      sleepers.delete(done);
      resolve();
    };
    const timer = setTimeout(done, ms);
    sleepers.add(done);
  });
const wakeAll = () => [...sleepers].forEach((fn) => fn());

const errorCode = (e: unknown) => (e as { code?: string } | null)?.code;

async function drainLoop(id: number): Promise<void> {
  let backoffMs = 1000;
  while (!stopping) {
    try {
      const { rows } = await pool.query<{ n: number }>("SELECT public.process_match_outbox() AS n");
      backoffMs = 1000;
      if (rows[0]?.n === 0) await sleep(IDLE_POLL_MS); // queue empty
      // n === 1: immediately take the next event
    } catch (err) {
      if (errorCode(err) === "40P01" || errorCode(err) === "40001") {
        console.warn(`[loop ${id}] deadlock/serialization failure; event was rolled back, retrying`);
        continue; // the event reappeared in the queue
      }
      console.error(`[loop ${id}] error`, err);
      await sleep(backoffMs);
      backoffMs = Math.min(backoffMs * 2, 30_000);
    }
  }
}

async function sweep(): Promise<void> {
  try {
    const { rows } = await pool.query<{ n: number }>("SELECT public.sweep_match_candidates() AS n");
    if (rows[0]?.n) console.log(`sweeper removed ${rows[0].n} expired candidates`);
  } catch (err) {
    console.error("sweep failed", err);
  }
}

async function startListener(): Promise<Client> {
  const listener = new Client({ connectionString: DATABASE_URL });
  await listener.connect();
  await listener.query("LISTEN match_outbox");
  listener.on("notification", wakeAll);
  listener.on("error", (e) => console.error("listener error", e));
  return listener;
}

async function main(): Promise<void> {
  const stop = () => {
    stopping = true;
    wakeAll();
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  const listener = USE_LISTEN ? await startListener() : null;
  const sweepTimer = setInterval(sweep, SWEEP_EVERY_MS);
  void sweep();

  console.log(`worker started: ${CONCURRENCY} loops, listen=${USE_LISTEN}`);
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => drainLoop(i)));

  clearInterval(sweepTimer);
  await listener?.end();
  await pool.end();
  console.log("worker stopped");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});