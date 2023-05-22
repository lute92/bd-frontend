import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:4900/products'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<IProduct> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<IProduct>(url);
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

    const url = `${this.apiUrl}/filter?${params}`;
    return this.http.get<any[]>(url);
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product);
  }

  updateProduct(id: string, product: IProduct): Observable<IProduct> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IProduct>(url, product);
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
