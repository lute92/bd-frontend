import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBrand } from '../models/brand';

@Injectable({
    providedIn: 'root'
  })
export class BrandService {
    private apiUrl = 'http://localhost:4900/brands';

    constructor(private http: HttpClient) { }

    getBrands(): Observable<IBrand[]> {
        return this.http.get<IBrand[]>(this.apiUrl);
    }
}
