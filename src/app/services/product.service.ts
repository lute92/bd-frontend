import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductRequest } from '../models/request/IProductRequest';
import { IProductResponse } from '../models/response/IProductResponset';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getProducts(page:number, limit:number): Observable<any> {

    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<any>(this.apiUrl, {params});
  }

  getProduct(id: string): Observable<IProductResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<IProductResponse>(url);
  }

  searchProducts(name?: string, brandId?: string, categoryId?: string): Observable<any[]> {
    let params = '';
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

  createProduct(product: IProductRequest): Observable<any> {
    return this.http.post<IProductRequest>(`${this.apiUrl}/`, product);
  }

  updateProduct(id: string, product: IProductRequest): Observable<IProductRequest> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IProductRequest>(url, product);
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
