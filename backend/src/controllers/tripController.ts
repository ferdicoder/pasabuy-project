import type { Request, Response } from "express";
import { validateBody } from "../utils/validateBody";
import { tripSchema, UpdateTripSchema } from "../interface/trip.interface";
import {
  createTrip,
  readOneTrip,
  readAllTrip,
  updateTrip,
  deleteTrip,
} from "../services/tripServices";

async function setTrip(req: Request, res: Response) {
  const result = validateBody(tripSchema, req.body);
  if (!result.success) return res.sendStatus(400);

  try {
    const tripData = result.data;
    const newTrip = await createTrip({ ...tripData });
    return res.status(201).json(newTrip);
  } catch (error) {
    console.log(`${error}`);
    return res.sendStatus(500);
  }
}

async function getOneTrip(req: Request<{ id: string }>, res: Response) {
  const tripId = req.params.id;
  if (!tripId || typeof tripId !== "string") return res.sendStatus(400);

  try {
    const trip = await readOneTrip(tripId);
    return res.status(200).json(trip);
  } catch (error) {
    console.log(`${error}`);
    return res.sendStatus(404);
  }
}

async function getAllTrip(req: Request, res: Response) {

  try {
    const trip = await readAllTrip();
    return res.status(200).json(trip);
  } catch (error) {
    console.log(`${error}`);
    return res.sendStatus(404);
  }
}

async function patchTrip(req: Request<{ id: string }>, res: Response) {
  const tripId = req.params.id;
  if (!tripId || typeof tripId !== "string") return res.sendStatus(400);

  const result = validateBody(UpdateTripSchema, req.body);
  if (!result.success) return res.sendStatus(400);

  try {
    const updated = await updateTrip(tripId, result.data);
    return res.status(200).json(updated);
  } catch (error) {
    console.log(`${error}`);
    return res.sendStatus(404);
  }
}

async function removeTrip(req: Request<{ id: string }>, res: Response) {
  const tripId = req.params.id;
  if (!tripId || typeof tripId !== "string") return res.sendStatus(400);

  try {
    await deleteTrip(tripId);
    return res.sendStatus(204);
  } catch (error) {
    console.log(`${error}`);
    return res.sendStatus(404);
  }
}

export { 
  setTrip, 
  getOneTrip, 
  getAllTrip,
  patchTrip, 
  removeTrip 
};