import { HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";

export class BaseService {
    private headers: HttpHeaders = new HttpHeaders();

    constructor(private authService: AuthService){}

    getRequestOptions(params?: HttpParams): { headers: HttpHeaders; params?: HttpParams } {
        // Ensure the latest token is used in the headers
        this.headers = this.headers.set('Authorization', `Bearer ${this.authService.getAuthToken()}`);
        return { headers: this.headers, params };
      }
}