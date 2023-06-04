import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) { }


  getCategories(page?: number, limit?: number, categoryName: string = '', description: string = ''): Observable<any> {
    let params = new HttpParams();
  
    if (page) {
      params = params.set('page', page.toString());
    }
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    if (categoryName) {
      params = params.set('name', categoryName);
    }
    if (description) {
      params = params.set('description', description);
    }
  
    return this.http.get<any>(this.apiUrl, { params });
  }

  getCategoryById(categoryId: string): Observable<ICategory> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.get<ICategory>(url);
  }

  createCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.apiUrl, category);
  }

  updateCategory(category: ICategory): Observable<ICategory> {
    const url = `${this.apiUrl}/${category.categoryId}`;
    return this.http.put<ICategory>(url, category);
  }

  deleteCategory(categoryId: string): Observable<void> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.delete<void>(url);
  }
}
