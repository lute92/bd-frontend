import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { IProductReq } from '../models/request/IProductReq';
import { IProductRes } from '../models/response/IProductRes';
import { environment } from '../../../src/environments/environment';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {
  private endPoint = 'products';
  private apiUrl = `${environment.BACKEND_SERVER_URL}/${this.endPoint}`;

  constructor(private http: HttpClient, authService: AuthService) {
    super(authService);
  }

  getProducts(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}`, this.getRequestOptions(params)).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  getProduct(id: string | null = ""): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<IProductRes>(url, this.getRequestOptions()).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  searchProducts(page: number, limit: number, name?: string, brandId?: string, categoryId?: string): Observable<any[]> {
    let params = new HttpParams();

    if (page) {
      params = params.set('page', page.toString());
    }

    if (limit) {
      params = params.set('limit', limit.toString());
    }

    if (name) {
      params = params.set('name', name);
    }

    if (brandId) {
      params = params.set('brandId', brandId);
    }

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<any[]>(`${this.apiUrl}/search`, this.getRequestOptions(params)).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, product, this.getRequestOptions()).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  updateProduct(id: string, product: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, product, this.getRequestOptions()).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.getRequestOptions()).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }
}
