import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: string | null = null;
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
}
