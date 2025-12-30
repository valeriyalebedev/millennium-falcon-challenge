import { Router } from "express";
import { calculateOdds } from "./odds.controller.js";

const router = Router()
router.post('/compute', calculateOdds);

export default router;