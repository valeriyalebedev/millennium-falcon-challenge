import { BountyHunters } from "./models/bounty-hunters.model.js";
import { RouteMap, type Planet } from "./models/route-map.model.js";
import { State } from "./models/state.model.js";

/**
 * Calculate the probability of Millenium Falcon being captured based on the k which corresponds to the number of bounty hounters encountered
 * @param k - number of bounty hunters encountered
 * @returns probability percentage of being captured
 */
export function captureProbability(k: number): number {
  //return Math.round(Math.pow(0.9, k) * 100);

  let probability = 0;
  for (let i =1; i<=k;i++){
    //chances of being captured at the i-th encounter
    probability += Math.pow(9/10,i-1)*0.1
  }

  //chances of not being captured
  return Math.round((1-probability) * 100);

}

export function computeOdds(
  routesData: Record<Planet, Record<Planet, number>>,
  autonomy: number,
  bountyData: Record<Planet, Record<number, boolean>>,
  departure: Planet,
  arrival: Planet,
  countdown: number
): number {
  const routes = new RouteMap(routesData);
  const bountyHunters = new BountyHunters(bountyData);

  //initialize the search queue
  const queue: State[] = [];

  //track visited planets to avoid cycles
  const visited = new Set<string>();

  //store the number of hunters encountered for successful paths
  const successful: number[] = [];

  //start the search
  queue.push(new State(departure, 0, autonomy, 0));

  //searching the path using Breadth-First Search (BFS)
  while (queue.length > 0) {
    const state = queue.shift()!;

    //avoid revisiting the same planet
    if (visited.has(state.key())) {
      continue;
    }
    visited.add(state.key());

    //arrived to the destination
    if (state.planet === arrival) {
      successful.push(state.hunters);
      continue;
    }

    //exceeded the countdown
    if (state.day > countdown) {
      continue;
    }

    // Wait on the planet
    if (!bountyHunters.isPresent(state.planet, state.day + 1)) {
      queue.push(
        new State(state.planet, state.day + 1, state.fuel, state.hunters)
      );
    }

    //Jump to other planets
    for (const [nextPlanet, travelDays] of Object.entries(
      routes.getDestinations(state.planet)
    )) {
      let { day, fuel, hunters } = state;

      day += travelDays;
      fuel -= travelDays;

      if (day > countdown) {
        continue;
      }

      //bounty hunters on arrival check
      if (bountyHunters.isPresent(nextPlanet, day)) {
        hunters++;
      }

      //refuel if needed
      if (fuel === 0 && day < countdown) {
        day += 1;
        fuel = autonomy;

        if (bountyHunters.isPresent(nextPlanet, day)) {
          hunters++;
        }
      }

      //add a next jump to the queue
      queue.push(new State(nextPlanet, day, fuel, hunters));
    }
  }

  //no successful paths found gives 0 probability automatically
  if (successful.length === 0) return 0;

  //choose the path with the minimum number of hunters encountered
  return captureProbability(Math.min(...successful));
}
