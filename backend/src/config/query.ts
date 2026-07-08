import { pool } from "./connectDB.js";
import type { QueryResult, QueryResultRow } from "pg";

export async function sql<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query(text, params);
}