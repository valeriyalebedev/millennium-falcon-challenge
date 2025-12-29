import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateOdds } from "./odds.controller.js";
import app from "../../utils/app.js";
import * as core from "core";

describe("calculateOdds controller", () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    // Mock request and response
    mockReq = { body: {} };
    mockRes = {
      json: vi.fn(),
      status: vi.fn(() => mockRes),
    };

    app.locals.routeMap = {
    };
    app.locals.config = {
      autonomy: 6,
      departure: "Tatooine",
      arrival: "Endor",
    };
  });

  it("should return 400 if body is invalid", () => {
    mockReq.body = { bounty_hunters: [] };

    calculateOdds(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid configuration",
    });
  });

  it("should return 500 if computeOdds throws", () => {
    mockReq.body = {
      bounty_hunters: { Hoth: { "6": true } },
      countdown: 7,
    };

    // Mock BountyHunters and computeOdds
    const computeOddsMock = vi
      .spyOn(core, "computeOdds")
      .mockImplementation(() => {
        throw new Error("fail");
      });

    calculateOdds(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });

    computeOddsMock.mockRestore();
  });

  it("should return odds when body is valid", () => {
    mockReq.body = {
      bounty_hunters: { Hoth: { "6": true } },
      countdown: 7,
    };

    // Mock computeOdds
    const computeOddsMock = vi.spyOn(core, "computeOdds").mockReturnValue(80);

    calculateOdds(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ odds: 80 });

    computeOddsMock.mockRestore();
  });
});
