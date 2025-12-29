import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OddsService } from '../services/odds.service.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
})
export class App {
  empireData: any;
  odds: number | null = null;
  loading = false;
  error = '';


  constructor(
    private oddsService: OddsService,
    private cd: ChangeDetectorRef,
    private titleService: Title
  ) {
    this.titleService.setTitle('Give me the odds');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.readFile(input.files[0]);
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);

        //Basic check
        if (!data.countdown || !data.bounty_hunters) throw new Error('Invalid configuration');
        if (typeof data.countdown !== 'number') throw new Error('countdown must be a number');
        if (!Array.isArray(data.bounty_hunters)) throw new Error('bounty_hunters must be an array');
        data.bounty_hunters = data.bounty_hunters.map((bh: any) => {
          if (!bh.planet || typeof bh.planet !== 'string')
            throw new Error('planet must be a string');
          if (typeof bh.day !== 'number') throw new Error('day must be a number');
          return { planet: bh.planet.trim(), day: Number(bh.day) };
        });
        this.empireData = data;
        this.error = '';
        this.odds = null;
        this.cd.detectChanges();
      } catch (e: any) {
        this.error = `Ooh! There is a problem with the JSON file: ${e.message}`;
        this.empireData = null;
        this.odds = null;
        this.cd.detectChanges();
      }
    };
    reader.readAsText(file);
  }

  calculateOdds() {
    if (!this.empireData) return;

    this.loading = true;
    this.odds = null;
    this.error = '';

    this.oddsService
      .calculateOdds(this.empireData)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.odds = response.odds;
        },
        error: (err) => {
          if (!err.status || err.status === 0 || (err.status >= 400 && err.status < 600)) {
            this.error = `The Millennium Falcon onboard computer is currently unavailable. Please check the server.`;
          } else {
            this.error = err?.error?.message || 'Error calculating odds.';
          }
          this.cd.detectChanges();
        },
      });
  }

  get oddsLevel(): 'high' | 'medium' | 'low'| null{
    if (this.odds === null) {
      return null;
    } else if (this.odds == 100) {
      return 'high';
    } else if (this.odds > 0) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}
