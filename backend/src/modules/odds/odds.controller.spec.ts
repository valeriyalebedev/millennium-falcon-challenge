import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateOdds } from "./odds.controller";
import * as core from 'core';


// Мокаем app.locals для тестов
const mockApp = {
  locals: {
    routeMap: {}, // пустой маршрут
    config: {
      autonomy: 6,
      departure: "Tatooine",
      arrival: "Endor",
    },
  },
};

function callController(body: any) {
  const mockReq = { body };
  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn(),
  };

  // bind app к this
  calculateOdds.call(mockApp, mockReq, mockRes);
  return mockRes;
}

describe("calculateOdds controller", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 400 if body is invalid", () => {
    const res = callController({ bounty_hunters: [] });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid configuration",
    });
  });

  it("should return 500 if computeOdds throws", () => {
    const spy = vi.spyOn(core, "computeOdds").mockImplementation(() => {
      throw new Error("fail");
    });

    const res = callController({
      bounty_hunters: [{ planet: "Hoth", day: 6 }],
      countdown: 7,
    });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });

    spy.mockRestore();
  });

  it("should return odds when body is valid", () => {
    const spy = vi.spyOn(core, "computeOdds").mockReturnValue(80);

    const res = callController({
      bounty_hunters: [{ planet: "Hoth", day: 6 }],
      countdown: 7,
    });

    expect(res.json).toHaveBeenCalledWith({ odds: 80 });

    spy.mockRestore();
  });
});
