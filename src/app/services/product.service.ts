import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {
    const authService = new AuthService();
    super(authService);
  }

  getProducts(page: number, limit: number): Observable<any> {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}`, this.getRequestOptions(params));
  }

  getProduct(id: string | null = ""): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<IProductRes>(url, this.getRequestOptions());
  }

  searchProducts(page: number, limit: number, name?: string, brandId?: string, categoryId?: string): Observable<any[]> {
    let params = '';

    if (page) {
      params += `page=${encodeURIComponent(page)}&`;
    }

    if (limit) {
      params += `limit=${encodeURIComponent(limit)}&`;
    }

    if (name) {
      params += `name=${encodeURIComponent(name)}&`;
    }

    if (brandId) {
      params += `brandId=${encodeURIComponent(brandId)}&`;
    }

    if (categoryId) {
      params += `categoryId=${encodeURIComponent(categoryId)}&`;
    }

    params = params.slice(0, -1); // Remove trailing "&" character

    const url = `${this.apiUrl}/search?${params}`;
    return this.http.get<any[]>(url, this.getRequestOptions());
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, product, this.getRequestOptions());
  }

  updateProduct(id: string, product: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, product, this.getRequestOptions());
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.getRequestOptions());
  }
}
