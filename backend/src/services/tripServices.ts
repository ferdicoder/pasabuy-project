import { sql } from "../config/query";
import type { Trip, UpdateTrip } from "../interface/trip.interface";

async function createTrip(tripData: Trip) {
  const query = `
    INSERT INTO trips(
      user_id,
      current_location,
      destination,
      depart_date,
      arrival_date,
      capacity_kg,
      status
    )
    VALUES($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;
  `;

  const values = [
    tripData.user_id,
    tripData.current_loc,
    tripData.destination,
    tripData.depart_date,
    tripData.arrival_date,
    tripData.capacity_kg,
    tripData.status,
  ];

  const result = await sql(query, values);
  if (result.rowCount === 0) throw new Error("trip create failed");

  return result.rows[0];
}

async function readTrip(tripId: string) {
  const query = `
    SELECT *
    FROM trips
    WHERE trip_id = $1;
  `;
  const values = [tripId];

  const result = await sql(query, values);
  if (result.rowCount === 0) throw new Error("not found");

  return result.rows[0];
}

async function updateTrip(tripId: string, tripData: UpdateTrip) {
  await readTrip(tripId);

  const query = `
    UPDATE trips
    SET
      user_id = COALESCE($2, user_id),
      current_location = COALESCE($3, current_location),
      destination = COALESCE($4, destination),
      depart_date = COALESCE($5, depart_date),
      arrival_date = COALESCE($6, arrival_date),
      capacity_kg = COALESCE($7, capacity_kg),
      status = COALESCE($8, status)
    WHERE trip_id = $1
    RETURNING *;
  `;

  const values = [
    tripId,
    tripData.user_id ?? null,
    tripData.current_loc ?? null,
    tripData.destination ?? null,
    tripData.depart_date ?? null,
    tripData.arrival_date ?? null,
    tripData.capacity_kg ?? null,
    tripData.status ?? null,
  ];

  const result = await sql(query, values);
  if (result.rowCount === 0) throw new Error("update failed");

  return result.rows[0];
}

async function deleteTrip(tripId: string) {
  await readTrip(tripId);

  const query = `
    DELETE FROM trips
    WHERE trip_id = $1
    RETURNING *;
  `;
  const values = [tripId];

  const result = await sql(query, values);
  if (result.rowCount === 0) throw new Error("delete failed");

  return result.rows[0];
}

export {
  createTrip,
  readTrip,
  updateTrip,
  deleteTrip,
};