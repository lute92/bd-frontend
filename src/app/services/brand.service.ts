import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBrand } from '../models/brand';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private endPoint = 'brands';
  private apiUrl = `${environment.BACKEND_SERVER_URL}:${environment.BACKEND_SERVER_PORT}`;

  constructor(private http: HttpClient) { }


  getBrands(page: number = 1, limit: number = 10, brandName?: string, description?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    if (brandName) {
      params = params.set('name', brandName);
    }
  
    if (description) {
      params = params.set('description', description);
    }
  
    return this.http.get<any>(`${this.apiUrl}/${this.endPoint}`, { params });
  }

  getBrandById(brandId: string): Observable<IBrand> {
    const url = `${this.apiUrl}/${this.endPoint}/${brandId}`;
    return this.http.get<IBrand>(url);
  }

  createBrand(brand: IBrand): Observable<IBrand> {
    return this.http.post<IBrand>(`${this.apiUrl}/${this.endPoint}`, brand);
  }

  updateBrand(brand: IBrand): Observable<IBrand> {
    const url = `${this.apiUrl}/${this.endPoint}/${brand.brandId}`;
    return this.http.put<IBrand>(url, brand);
  }

  deleteBrand(brandId: string): Observable<void> {
    const url = `${this.apiUrl}/${this.endPoint}/${brandId}`;
    return this.http.delete<void>(url);
  }
}
