import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductCreateReq } from '../models/request/IProductCreateReq';
import { IProductRes } from '../models/response/IProductRes';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:4900/products'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getProducts(page:number, limit:number): Observable<any> {

    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<any>(this.apiUrl, {params});
  }

  getProduct(id: string): Observable<IProductRes> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<IProductRes>(url);
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

  createProduct(product: IProductCreateReq): Observable<any> {
    return this.http.post<IProductCreateReq>(`${this.apiUrl}/`, product);
  }

  updateProduct(id: string, product: IProductCreateReq): Observable<IProductCreateReq> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IProductCreateReq>(url, product);
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
