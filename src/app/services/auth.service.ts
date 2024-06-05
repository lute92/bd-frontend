import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  constructor() {
    const token = this.getAuthToken();
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!token);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  removeAuthToken(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  // Check if the token is expired
  isTokenExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Date.now() >= expiry * 1000;
  }

  // Logout user if token is expired
  checkTokenExpiration(): void {
    const token = this.getAuthToken();
    if (token && this.isTokenExpired(token)) {
      this.removeAuthToken();
    }
  }

  // Handle server errors
  handleServerError(error: any): Observable<never> {
    if (error.status === 401) { // Assuming 401 is returned for expired token
      this.removeAuthToken();
      // Redirect to login page
      window.location.href = '/login';
    }
    return throwError(error);
  }

}
