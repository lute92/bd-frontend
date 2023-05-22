import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICurrency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://localhost:4900/currencies';

  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<ICurrency[]> {
    return this.http.get<ICurrency[]>(this.apiUrl);
  }

  createCurrency(currency: ICurrency): Observable<ICurrency> {
    return this.http.post<ICurrency>(this.apiUrl, currency);
  }

  updateCurrency(currency: ICurrency): Observable<ICurrency> {
    const url = `${this.apiUrl}/${currency._id}`;
    return this.http.put<ICurrency>(url, currency);
  }

  deleteCurrency(currencyId: string): Observable<void> {
    const url = `${this.apiUrl}/${currencyId}`;
    return this.http.delete<void>(url);
  }
}
