import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from '../models/category';

@Injectable({
    providedIn: 'root'
  })
export class CategoryService {
    private apiUrl = 'http://localhost:4900/categories';

    constructor(private http: HttpClient) { }

    getCategories(): Observable<ICategory[]> {
        return this.http.get<ICategory[]>(this.apiUrl);
    }
}
