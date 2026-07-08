import { Router } from "express";
import { 
  setTrip, 
  getOneTrip, 
  getAllTrip,
  patchTrip, 
  removeTrip 
} from "../controllers/tripController.js";

const tripRouter = Router();

export default tripRouter
  .post('/create', setTrip)
  .get('/get/:id', getOneTrip)
  .get('/getAll', getAllTrip)
  .patch('/update/:id', patchTrip)
  .delete('/delete/:id', removeTrip);
