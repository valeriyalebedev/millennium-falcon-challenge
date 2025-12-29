import type { Request, Response } from "express";
import app from "../../utils/app.js";
import { BountyHunters, computeOdds } from "core";
import { coreLogger } from "../../utils/core-logger.adapter.js";


/**
 * @swagger
 * /api/odds/compute:
 *   post:
 *     summary: Calculate odds for Millennium Falcon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bounty_hunters:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                   additionalProperties:
 *                     type: boolean
 *               countdown:
 *                 type: number
 *             example:
 *               bounty_hunters:
 *                 Hoth:
 *                   "6": true
 *                   "7": true
 *                   "8": true
 *               countdown: 8
 *     responses:
 *       200:
 *         description: Odds calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 odds:
 *                   type: number
 *                   example: 81
 *       400:
 *         description: Invalid configuration
 *       500:
 *         description: Internal server error
 */
export function calculateOdds(req: Request, res: Response) {
  const { bounty_hunters, countdown } = req.body;

  if (
    !bounty_hunters || 
    typeof bounty_hunters !== "object" || 
    Array.isArray(bounty_hunters) || 
    typeof countdown !== "number"
  ) {
    return res.status(400).json({ error: "Invalid configuration" });
  }

  const bountyHunters = new BountyHunters(bounty_hunters);

  try{
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
  }catch(error){
    res.status(500).json({ error: "Internal server error" });
  }
}
