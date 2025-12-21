import { Planet } from '../models/route-map.model.js';
import { BountyHunters } from '../models/bounty-hunters.model.js';
export function loadBountyHunters(data:{planet: Planet; day:number}[]): BountyHunters{
    const bountyData: Record<Planet, Record<number, boolean>> = {};
  
    for (const entry of data) {
      const { planet, day } = entry;
      if (!bountyData[planet]) {
        bountyData[planet] = {};
      }
      bountyData[planet]![day] = true;
    }
  
    return new BountyHunters(bountyData);
  }