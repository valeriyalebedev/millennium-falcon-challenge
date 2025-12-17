import type { Request, Response } from "express";
import { computeOdds } from "./odds.service.js";
import app from "../../utils/app.js";

export function calculateOdds(req: Request, res: Response) {
  const { bountyHunters, countdown } = req.body;

  const odds = computeOdds(
    app.locals.routeMap,
    app.locals.config.autonomy,
    bountyHunters,
    app.locals.config.departure,
    app.locals.config.arrival,
    countdown
  );
  res.json({ odds });
}
