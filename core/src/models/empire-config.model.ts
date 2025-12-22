import { Planet } from "./route-map.model.js";

export interface EmpireConfig {
  countdown: number;
  bounty_hunters: {
    planet: Planet;
    day: number;
  }[];
}
