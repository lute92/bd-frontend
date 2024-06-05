import { HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

export class BaseService {
  protected headers: HttpHeaders = new HttpHeaders();
  protected authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  getRequestOptions(params?: HttpParams): { headers: HttpHeaders; params?: HttpParams } {
    // Ensure the latest token is used in the headers
    const token = this.authService.getAuthToken();
    if (token) {
      this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers: this.headers, params };
  }
}
