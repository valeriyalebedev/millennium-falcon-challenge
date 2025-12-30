import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { App } from './app.component.js';
import { OddsService } from '../services/odds.service.js';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: App;
  let oddsServiceSpy: any;

  beforeEach(async () => {
    oddsServiceSpy = {
      calculateOdds: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
      providers: [
        { provide: OddsService, useValue: oddsServiceSpy },
        Title
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title of the page', () => {
    const titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('Give me the odds');
  });

  it('should calculate odds using oddsService', async () => {
    const mockData = {
      "countdown": 7,
      "bounty_hunters": [
        {"planet": "Hoth", "day": 6 }
      ]
    };
    const mockResponse = { odds: 0 };
    component.empireData = mockData;
    oddsServiceSpy.calculateOdds.mockReturnValue(of(mockResponse));

    component.calculateOdds();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(component.odds).toBe(0);
    expect(component.loading).toBe(false);
  });

  it('should handle errors from oddsService', async () => {
    const mockData = { countdown: 5, bounty_hunters: [{ planet: 'Tatooine', day: 1 }] };
    component.empireData = mockData;
    oddsServiceSpy.calculateOdds.mockReturnValue(throwError(() => ({ status: 500 })));

    component.calculateOdds();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(component.error).toBe(
      'The Millennium Falcon onboard computer is currently unavailable. Please check the server.'
    );
    expect(component.loading).toBe(false);
  });

  it('oddsLevel should return correct levels', () => {
    component.odds = null;
    expect(component.oddsLevel).toBeNull();

    component.odds = 100;
    expect(component.oddsLevel).toBe('high');

    component.odds = 50;
    expect(component.oddsLevel).toBe('medium');

    component.odds = 0;
    expect(component.oddsLevel).toBe('low');
  });
});
