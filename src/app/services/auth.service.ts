import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: string | null = null;
  
  isAuthenticated(): boolean {
    // Check if the user is authenticated (e.g., check if a valid token is stored)
    return !!localStorage.getItem('token');
  }

  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
}
