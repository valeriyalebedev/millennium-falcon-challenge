import express, { ErrorRequestHandler, Request, Response } from "express";
import router from "../modules/odds/odds.router.js";
import { loadConfig } from "./config/millenium-falcon-config.js";
import { loadRouteMap } from "core";
import logger from "./logger.js";
import { setupSwagger } from "./swagger.js";

const app = express();

app.use(express.json());

const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
    next(err);
  };

app.use(jsonErrorHandler);

//Health check
app.get("/", (req: Request, res: Response) => res.send("OK"));

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

app.use("/api/odds", router);

//Swagger UI is available at http://localhost:3000/api/docs
setupSwagger(app);

export default app;
