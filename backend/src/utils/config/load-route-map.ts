import Database from "better-sqlite3";
import { RouteMap } from "../../modules/odds/models/route-map.model.js";
interface RouteRow {
    origin: string;
    destination: string;
    travel_time: number;
}

export function loadRouteMap(dbPath: string): RouteMap{
    const db = new Database(dbPath,{readonly: true});  
    const routes: Record<string, Record<string, number>> = {};

    const rows = db.prepare('SELECT origin, destination, travel_time FROM routes').all() as RouteRow[];
    for(const {origin,destination,travel_time} of rows){
        if(!routes[origin]){
            routes[origin] = {};
        }
        if(!routes[destination]){
            routes[destination] = {};
        }
        const from = routes[origin] || {};
        const to = routes[destination] || {};
        from[destination] = travel_time;
        to[origin] = travel_time;
    }

    return new RouteMap(routes);
}