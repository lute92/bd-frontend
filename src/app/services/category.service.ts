import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from '../models/category';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private endPoint = 'categories';
  private apiUrl = `${environment.BACKEND_SERVER_URL}:${environment.BACKEND_SERVER_PORT}`;

  constructor(private http: HttpClient) { }


  getCategories(page: number = 1, limit: number = 10, categoryName?: string, description?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    if (categoryName) {
      params = params.set('name', categoryName);
    }
  
    if (description) {
      params = params.set('description', description);
    }
  
    return this.http.get<any>(`${this.apiUrl}/${this.endPoint}`, { params });
  }

  getCategoryById(categoryId: string): Observable<ICategory> {
    const url = `${this.apiUrl}/${this.endPoint}/${categoryId}`;
    return this.http.get<ICategory>(url);
  }

  createCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.apiUrl}/${this.endPoint}`, category);
  }

  updateCategory(category: ICategory): Observable<ICategory> {
    const url = `${this.apiUrl}/${this.endPoint}/${category.categoryId}`;
    return this.http.put<ICategory>(url, category);
  }

  deleteCategory(categoryId: string): Observable<void> {
    const url = `${this.apiUrl}/${this.endPoint}/${categoryId}`;
    return this.http.delete<void>(url);
  }
}
