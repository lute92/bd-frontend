import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBrand } from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:4900/brands';

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
  
    return this.http.get<any>(this.apiUrl, { params });
  }

  getBrandById(brandId: string): Observable<IBrand> {
    const url = `${this.apiUrl}/${brandId}`;
    return this.http.get<IBrand>(url);
  }

  createBrand(brand: IBrand): Observable<IBrand> {
    return this.http.post<IBrand>(this.apiUrl, brand);
  }

  updateBrand(brand: IBrand): Observable<IBrand> {
    const url = `${this.apiUrl}/${brand.brandId}`;
    return this.http.put<IBrand>(url, brand);
  }

  deleteBrand(brandId: string): Observable<void> {
    const url = `${this.apiUrl}/${brandId}`;
    return this.http.delete<void>(url);
  }
}
