import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductReq } from '../models/request/IProductReq';
import { IProductRes } from '../models/response/IProductRes';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endPoint = 'products';
  private apiUrl = `${environment.BACKEND_SERVER_URL}:${environment.BACKEND_SERVER_PORT}/${this.endPoint}`;

  constructor(private http: HttpClient) { }

  getProducts(page:number, limit:number): Observable<any> {

    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}`, {params});
  }

  getProduct(id: string | null = ""): Observable<IProductRes> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<IProductRes>(url);
  }

  searchProducts(page:number, limit:number, name?: string, brandId?: string, categoryId?: string): Observable<any[]> {
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
    return this.http.get<any[]>(url);
  }

  createProduct(product: IProductReq): Observable<any> {
    return this.http.post<IProductReq>(`${this.apiUrl}/`, product);
  }

  updateProduct(id: string, product: IProductReq): Observable<IProductRes> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IProductRes>(url, product);
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
