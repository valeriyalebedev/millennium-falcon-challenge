import type { Request, Response } from 'express';
import { computeOdds } from './odds.service.js';
import { loadConfig } from '../../utils/config/config.js';
import { loadRouteMap } from '../../utils/config/load-route-map.js';
export function calculateOdds(req :Request, res: Response){
    const config = loadConfig()

    const {autonomy,bountyHunters,start,end,countdown} = req.body;

    //Loading routes from the database
    const routeMap = loadRouteMap(config.routes_db);

    const odds = computeOdds(routeMap.routesData,autonomy,bountyHunters,start,end,countdown);   
    res.json({odds});
}