import { Router } from "express";
import { 
  setTrip, 
  getOneTrip, 
  getAllTrip,
  patchTrip, 
  removeTrip, 
  getMyTrips
} from "../controllers/tripController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const tripRouter = Router();

export default tripRouter
  .post('/create', requireAuth, setTrip)
  .get('/get/:id', getOneTrip)
  .get('/getAll', getAllTrip)
  .patch('/update/:id', patchTrip)
  .delete('/delete/:id', removeTrip)
  .get('/myTrips', requireAuth, getMyTrips); 
