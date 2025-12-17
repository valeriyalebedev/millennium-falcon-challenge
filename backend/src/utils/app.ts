import express from "express";
import router from "../modules/odds/odds.router.js";
import { loadConfig } from "./config/config.js";
import { loadRouteMap } from "./config/load-route-map.js";
import logger from "./logger.js";

const app = express();

//Loading configuration
const config = loadConfig();
app.locals.config = config;

//Loading routes from the database
const routeMap = loadRouteMap(config.routes_db);
app.locals.routeMap = routeMap;

logger.info(`
Configuration loaded:
Millenium falcon has autonomy of ${config.autonomy} days. 
We are currently on the ${config.departure} planet and plan to reach ${config.arrival}.`);
logger.info(`
Route map loaded:  
${JSON.stringify(routeMap.routesData)}
`);

app.use(express.json());

app.use("/api/odds", router);

export default app;
