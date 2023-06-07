import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICurrency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://localhost:3000/currencies';

  constructor(private http: HttpClient) { }


  getCurrencies(page: number = 1, limit: number = 10, currencyName?: string, description?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    if (currencyName) {
      params = params.set('name', currencyName);
    }
  
    if (description) {
      params = params.set('description', description);
    }
  
    return this.http.get<any>(this.apiUrl, { params });
  }

  getCurrencyById(currencyId: string): Observable<ICurrency> {
    const url = `${this.apiUrl}/${currencyId}`;
    return this.http.get<ICurrency>(url);
  }

  createCurrency(currency: ICurrency): Observable<ICurrency> {
    return this.http.post<ICurrency>(this.apiUrl, currency);
  }

  updateCurrency(currency: ICurrency): Observable<ICurrency> {
    const url = `${this.apiUrl}/${currency.currencyId}`;
    return this.http.put<ICurrency>(url, currency);
  }

  deleteCurrency(currencyId: string): Observable<void> {
    const url = `${this.apiUrl}/${currencyId}`;
    return this.http.delete<void>(url);
  }
}
