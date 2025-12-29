import { describe, it, expect, vi } from 'vitest';
import { computeOdds } from './odds.service.js';
import { IRouteMap } from './models/route-map.model.js';
import { IBountyHunters } from './index.js';

// Mock RouteMap
class MockRouteMap implements IRouteMap {
    private map: Record<string, Record<string, number>> = {};
  
    setRoutes(from: string, to: string, days: number) {
      this.map[from] = this.map[from] ?? {};
      this.map[from]![to] = days;
    }
  
    getDestinations(planet: string) {
      return this.map[planet] || {};
    }
  }

// Mock BountyHunters
class MockBountyHunters implements IBountyHunters {
    private hunters: { planet: string; day: number }[];
  
    constructor(data: { planet: string; day: number }[] = []) {
      this.hunters = data;
    }
  
    isPresent(planet: string, day: number) {
      return this.hunters.some(bh => bh.planet === planet && bh.day === day);
    }
  }


describe('computeOdds examples', () => {
  let routes: MockRouteMap;
  let bountyHunters: MockBountyHunters;
  const logger = { info: vi.fn(), debug: vi.fn() };

  beforeEach(() => {
    routes = new MockRouteMap();

    // Configure routes from the db example
    routes.setRoutes('Tatooine', 'Dagobah', 6);
    routes.setRoutes('Dagobah', 'Endor', 4);
    routes.setRoutes('Dagobah', 'Hoth', 1);
    routes.setRoutes('Hoth', 'Endor', 1);
    routes.setRoutes('Tatooine', 'Hoth', 6);
  });

  it('Example 1: countdown 7 => 0%', () => {
    bountyHunters = new MockBountyHunters([
      { planet: 'Hoth', day: 6 },
      { planet: 'Hoth', day: 7 },
      { planet: 'Hoth', day: 8 },
    ]);
    const odds = computeOdds(routes, 6, bountyHunters, 'Tatooine', 'Endor', 7, logger);
    expect(odds).toBe(0);
  });

  it('Example 2: countdown 8 => 81%', () => {
    bountyHunters = new MockBountyHunters([
      { planet: 'Hoth', day: 6 },
      { planet: 'Hoth', day: 7 },
      { planet: 'Hoth', day: 8 },
    ]);
    const odds = computeOdds(routes, 6, bountyHunters, 'Tatooine', 'Endor', 8, logger);
    expect(odds).toBe(81);
  });

  it('Example 3: countdown 9 => 90%', () => {
    bountyHunters = new MockBountyHunters([
      { planet: 'Hoth', day: 6 },
      { planet: 'Hoth', day: 7 },
      { planet: 'Hoth', day: 8 },
    ]);
    const odds = computeOdds(routes, 6, bountyHunters, 'Tatooine', 'Endor', 9, logger);
    expect(odds).toBe(90);
  });

  it('Example 4: countdown 10 => 100%', () => {
    bountyHunters = new MockBountyHunters([
      { planet: 'Hoth', day: 6 },
      { planet: 'Hoth', day: 7 },
      { planet: 'Hoth', day: 8 },
    ]);
    const odds = computeOdds(routes, 6, bountyHunters, 'Tatooine', 'Endor', 10, logger);
    expect(odds).toBe(100);
  });
});
