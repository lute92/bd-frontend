import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBrand } from '../models/brand';

@Injectable({
    providedIn: 'root'
  })
export class BrandService {
    private apiUrl = 'http://localhost:3000/brands';

    constructor(private http: HttpClient) { }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(this.apiUrl);
  }

  getBrandById(brandId: string): Observable<IBrand> {
    const url = `${this.apiUrl}/${brandId}`;
    return this.http.get<IBrand>(url);
  }

  addBrand(brand: IBrand): Observable<IBrand> {
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
