import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBrand } from '../models/brand';
import { environment } from '../../../src/environments/environment';
import { AuthService } from './auth.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService extends BaseService {

  private endPoint = 'brands';
  private apiUrl = `${environment.BACKEND_SERVER_URL}`;

  constructor(private http: HttpClient, authService: AuthService) {
    super(authService);
  }


  searchBrands(brandName?: string, description?: string): Observable<any> {
    let params = new HttpParams();

    if (brandName) {
      params = params.set('name', brandName);
    }

    if (description) {
      params = params.set('description', description);
    }

    return this.http.get<any>(`${this.apiUrl}/${this.endPoint}`, this.getRequestOptions(params) );
  }

  getBrands(page?: number, limit?: number, brandName?: string, description?: string): Observable<any> {
    
    let params = new HttpParams();

    if (page) {
      params = params.set('page', page);
    }

    if (limit) {
      params = params.set('limit', limit);
    }

    if (brandName) {
      params = params.set('name', brandName);
    }

    if (description) {
      params = params.set('description', description);
    }

    return this.http.get<any>(`${this.apiUrl}/${this.endPoint}`, this.getRequestOptions(params));
  }

  getBrandById(brandId: string): Observable<IBrand> {
    const url = `${this.apiUrl}/${this.endPoint}/${brandId}`;
    return this.http.get<IBrand>(url, this.getRequestOptions());
  }

  createBrand(brand: IBrand): Observable<IBrand> {
    return this.http.post<IBrand>(`${this.apiUrl}/${this.endPoint}`, brand, this.getRequestOptions());
  }

  updateBrand(brand: IBrand): Observable<IBrand> {
    const url = `${this.apiUrl}/${this.endPoint}/${brand._id}`;
    return this.http.put<IBrand>(url, brand, this.getRequestOptions());
  }

  deleteBrand(brandId: string): Observable<void> {
    const url = `${this.apiUrl}/${this.endPoint}/${brandId}`;
    return this.http.delete<void>(url,this.getRequestOptions());
  }
}
