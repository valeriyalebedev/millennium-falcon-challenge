import { type Planet, IRouteMap } from "./models/route-map.model.js";
import { State } from "./models/state.model.js";
import { IBountyHunters } from "./models/bounty-hunters.model.js";
import { Logger, noopLogger } from "./utils/logger.js";

/**
 * Calculate the probability of Millenium Falcon being captured based on the k which corresponds to the number of bounty hounters encountered
 * @param k - number of bounty hunters encountered
 * @returns probability percentage of being captured
 */
export function captureProbability(k: number): number {
  //return Math.round(Math.pow(0.9, k) * 100);

  let probability = 0;
  for (let i = 1; i <= k; i++) {
    //chances of being captured at the i-th encounter
    probability += Math.pow(9 / 10, i - 1) * 0.1;
  }

  //chances of not being captured
  return Math.round((1 - probability) * 100);
}

/**
 * Computes the maximum odds of Millenium Falcon reaching from departure to arrival within the countdown time considering the routes, autonomy and bounty hunters data
 * @param routes - graph of planets and travel times
 * @param autonomy - maximum travel days without refueling
 * @param bountyData - bounty hunters presence data
 * @param departure - starting planet
 * @param arrival - destination planet
 * @param countdown - maximum allowed travel days
 * @returns probability percentage of safe arrival
 */
export function computeOdds(
  routes: IRouteMap,
  autonomy: number,
  bountyHunters: IBountyHunters,
  departure: Planet,
  arrival: Planet,
  countdown: number,
  logger: Logger = noopLogger
): number {
  //initialize the search queue
  const queue: State[] = [];
  //track visited planets to avoid cycles
  const visited = new Set<string>();

  //store the number of hunters encountered for successful paths
  const successful: number[] = [];

  //start the search
  queue.push(new State(departure, 0, autonomy, 0));

  logger.info(`
  Starting odds computation...
  `);

  //searching the path using Breadth-First Search (BFS)
  while (queue.length > 0) {
    const state = queue.shift();
    if (!state) continue;

    logger.debug(
      `Visiting planet ${state.planet} on day ${state.day} with ${state.fuel} fuel and ${state.hunters} hunters encountered`
    );

    //avoid revisiting the same planet
    if (visited.has(state.key())) {
      logger.debug(
        `   Planet ${state.planet} on day ${state.day} already visited, skipping...`
      );

      continue;
    }
    visited.add(state.key());

    //check whether we arrived to the destination
    if (state.planet === arrival) {
      logger.info(
        `     Reached destination ${arrival} on day ${state.day} with ${state.hunters} hunters encountered`
      );

      successful.push(state.hunters);
      continue;
    }

    //exceeded the countdown - cannot proceed further
    if (state.day >= countdown) {
      logger.debug(
        `      Exceeded countdown on day ${state.day}, cannot proceed further, skipping...`
      );
      continue;
    }

    // Wait one day on the planet if no hunters are present
    const waitDay = state.day + 1;
    if (
      waitDay <= countdown &&
      !bountyHunters.isPresent(state.planet, state.day + 1)
    ) {
      queue.push(new State(state.planet, waitDay, state.fuel, state.hunters));
      logger.debug(
        `  Queued waiting on planet ${state.planet} for day ${waitDay} with ${state.fuel} fuel and ${state.hunters} hunters encountered`
      );
    }

    //Jump to other planets
    for (const [nextPlanet, travelDays] of Object.entries(
      routes.getDestinations(state.planet)
    )) {
      let nextDay = state.day + travelDays;
      let nextFuel = state.fuel - travelDays;
      let nextHunters = state.hunters;

      if (nextDay > countdown) {
        logger.debug(
          `    Skipping jump to ${nextPlanet}: day ${nextDay} exceeds countdown(${countdown})`
        );
        continue;
      }

      //bounty hunters on arrival check
      if (bountyHunters.isPresent(nextPlanet, nextDay)) {
        nextHunters++;
        logger.debug(
          `Encountered bounty hunters present on ${nextPlanet} planet on day ${nextDay}, total hunters encountered: ${nextHunters}`
        );
      }

      //refuel if needed
      if (nextFuel <= 0 && nextDay < countdown) {
        nextDay += 1;
        nextFuel = autonomy;

        //Check again for bounty hunters after refueling
        if (bountyHunters.isPresent(nextPlanet, nextDay)) {
          logger.debug(
            `Refueling on planet ${nextPlanet}, day incremented to ${nextDay}, fuel restored to ${autonomy}`
          );
          nextHunters++;
          logger.debug(
            `Encountered bounty hunters present on planet ${nextPlanet} after refueling on day ${nextDay}, total hunters encountered: ${nextHunters}`
          );
        }
      }

      //Only queue if nextDay is within countdown
      if (nextDay <= countdown) {
        queue.push(new State(nextPlanet, nextDay, nextFuel, nextHunters));
        logger.debug(
          `  Queued jump to planet ${nextPlanet} arriving on day ${nextDay} with ${nextFuel} fuel and ${nextHunters} hunters encountered`
        );
      }
    }
  }

  //no successful paths found gives 0 probability automatically
  if (successful.length === 0) {
    logger.info(
      "     No successful paths found within the countdown - returning 0% odds."
    );
    return 0;
  }

  //choose the path with the minimum number of hunters encountered
  const minHunters = Math.min(...successful);
  logger.info(
    `     Minimum bounty hunters encountered on successful path: ${minHunters}`
  );

  const result = captureProbability(minHunters);

  logger.info(`
  Probability of safe arrival with ${minHunters} bounty hunters encountered: ${result}%
  `);

  return result;
}
