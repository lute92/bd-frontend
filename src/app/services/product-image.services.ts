import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductImage } from '../models/product-image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endPoint = 'productImages';
  private apiUrl = `${environment.BACKEND_SERVER_URL}`; // Replace with your API URL

  constructor(private http: HttpClient) { }

  /* getProductImages(page:number, limit:number): Observable<any> {

    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<any>(this.apiUrl, {params});
  } */

  /* 
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
  } */

  createProductImage(image: IProductImage): Observable<any> {
    return this.http.post<IProductImage>(`${this.apiUrl}/${this.endPoint}`, image);
  }

  /* updateProduct(id: string, product: IProductCreateReq): Observable<IProductCreateReq> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IProductCreateReq>(url, product);
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  } */
}
