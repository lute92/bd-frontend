import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { IPurchase } from '../models/purchase';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private endPoint = 'purchases';
  private apiUrl = `${environment.BACKEND_SERVER_URL}/${this.endPoint}`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPurchases(page:number, limit:number): Observable<any> {

    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}`, {params}).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  getPurchasesById(purchaseId: string): Observable<any> {
    
    const url = `${this.apiUrl}/${purchaseId}`;
    console.log(url);
    return this.http.get<any>(url).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
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
    return this.http.get<any[]>(url).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  createPurchase(purchase: IPurchase): Observable<any> {
    return this.http.post<IPurchase>(`${this.apiUrl}/`, purchase).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  updatePurchase(id: string, purchase: IPurchase): Observable<IPurchase> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IPurchase>(url, purchase).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  deletePurchase(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }
}
