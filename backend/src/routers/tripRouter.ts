import { Router } from "express";
import { setTrip, getTrip, patchTrip, removeTrip } from "../controllers/tripController";

const tripRouter = Router();

export default tripRouter
  .post('/create', setTrip)
  .get('/get/:id', getTrip)
  .patch('/update/:id', patchTrip)
  .delete('/delete/:id', removeTrip);
