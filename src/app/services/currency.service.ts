import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICurrency } from '../models/currency';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private endPoint = 'currencies';
  private apiUrl = `${environment.BACKEND_SERVER_URL}:${environment.BACKEND_SERVER_PORT}`;

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
  
    return this.http.get<any>(`${this.apiUrl}/${this.endPoint}`, { params });
  }

  getCurrencyById(currencyId: string): Observable<ICurrency> {
    const url = `${this.apiUrl}/${this.endPoint}/${currencyId}`;
    return this.http.get<ICurrency>(url);
  }

  createCurrency(currency: ICurrency): Observable<ICurrency> {
    return this.http.post<ICurrency>(`${this.apiUrl}/${this.endPoint}`, currency);
  }

  updateCurrency(currency: ICurrency): Observable<ICurrency> {
    const url = `${this.apiUrl}/${this.endPoint}/${currency.currencyId}`;
    return this.http.put<ICurrency>(url, currency);
  }

  deleteCurrency(currencyId: string): Observable<void> {
    const url = `${this.apiUrl}/${this.endPoint}/${currencyId}`;
    return this.http.delete<void>(url);
  }
}
