import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { OddsService } from './odds.service.js';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

describe('OddsService', () => {
  let service: OddsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OddsService, provideHttpClientTesting()],
    });

    service = TestBed.inject(OddsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST empireData and return odds', async () => {
    const mockData = {
      "countdown": 7,
      "bounty_hunters": [
        {"planet": "Hoth", "day": 6 }
      ]
    };
    const mockResponse = { odds: 0 };

    const promise = firstValueFrom(service.calculateOdds(mockData));

    const req = httpMock.expectOne('/api/odds/compute');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockResponse);

    const response = await promise;
    expect(response.odds).toBe(0);
  });

  it('should handle HTTP error', async () => {
    const mockData = { countdown: 7, bounty_hunters: [] };

    const promise = firstValueFrom(service.calculateOdds(mockData));

    const req = httpMock.expectOne('/api/odds/compute');
    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

    await expect(promise).rejects.toMatchObject({ status: 500 });
  });
});
