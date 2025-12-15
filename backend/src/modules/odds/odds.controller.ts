import { Request, Response } from 'express';
import { computeOdds } from './odds.service.js';
export function calculateOdds(req :Request, res: Response){
    const {routes,autonomy,bountyHunters,start,end,countdown} = req.body;

    const odds = computeOdds(routes,autonomy,bountyHunters,start,end,countdown);   
    res.json({odds});
}