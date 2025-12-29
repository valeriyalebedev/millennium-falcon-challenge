import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OddsService {
  private apiUrl = '/api/odds/compute';

  constructor(private http: HttpClient) {}

  calculateOdds(empireData: any): Observable<{ odds: number }> {
    return this.http.post<{ odds: number }>(this.apiUrl, empireData,{ headers: { 'Content-Type': 'application/json' } });
  }
}
