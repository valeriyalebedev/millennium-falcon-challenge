import type { Request, Response } from "express";
import app from "../../utils/app.js";
import { BountyHunters, computeOdds } from "core";
import { coreLogger } from "../../utils/core-logger.adapter.js";

export function calculateOdds(req: Request, res: Response) {
  const { bounty_hunters, countdown } = req.body;

  const bountyHunters = new BountyHunters(bounty_hunters);

  const odds = computeOdds(
    app.locals.routeMap,
    app.locals.config.autonomy,
    bountyHunters,
    app.locals.config.departure,
    app.locals.config.arrival,
    countdown,
    coreLogger
  );
  res.json({ odds });
}
