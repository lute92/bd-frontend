import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ICategory } from '../models/category';
import { environment } from '../../../src/environments/environment';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {
  private endPoint = 'categories';
  private apiUrl = `${environment.BACKEND_SERVER_URL}`;

  constructor(private http: HttpClient, authService: AuthService) {
    super(authService);
  }

  getCategories(page: number, limit: number, categoryName?: string, description?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    if (categoryName) {
      params = params.set('name', categoryName);
    }
  
    if (description) {
      params = params.set('description', description);
    }
  
    return this.http.get<any>(`${this.apiUrl}/${this.endPoint}`, this.getRequestOptions(params)).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  getCategoryById(categoryId: string): Observable<ICategory> {
    const url = `${this.apiUrl}/${this.endPoint}/${categoryId}`;
    return this.http.get<ICategory>(url).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  createCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.apiUrl}/${this.endPoint}`, category, this.getRequestOptions()).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  updateCategory(category: ICategory): Observable<ICategory> {
    const url = `${this.apiUrl}/${this.endPoint}/${category._id}`;
    return this.http.put<ICategory>(url, category, this.getRequestOptions()).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }

  deleteCategory(categoryId: string): Observable<void> {
    const url = `${this.apiUrl}/${this.endPoint}/${categoryId}`;
    return this.http.delete<void>(url, this.getRequestOptions()).pipe(
      catchError(error => this.authService.handleServerError(error))
    );
  }
}
