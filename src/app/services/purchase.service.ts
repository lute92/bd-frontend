import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { IPurchase } from '../models/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private endPoint = 'purchases';
  private apiUrl = `${environment.BACKEND_SERVER_URL}:${environment.BACKEND_SERVER_PORT}/${this.endPoint}`;

  constructor(private http: HttpClient) { }

  getPurchases(page:number, limit:number): Observable<any> {

    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}`, {params});
  }

  searchPurchase(page:number, limit:number): Observable<any[]> {
    let params = '';

    if (page) {
      params += `page=${encodeURIComponent(page)}&`;
    }

    if (limit) {
      params += `limit=${encodeURIComponent(limit)}&`;
    }

    params = params.slice(0, -1); // Remove trailing "&" character

    const url = `${this.apiUrl}/search?${params}`;
    return this.http.get<any[]>(url);
  }

  createPurchase(purchase: IPurchase): Observable<any> {
    debugger
    return this.http.post<IPurchase>(`${this.apiUrl}/`, purchase);
  }

  updatePurchase(id: string, purchase: IPurchase): Observable<IPurchase> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IPurchase>(url, purchase);
  }

  deletePurchase(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
