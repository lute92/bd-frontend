import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formData = {
    username: '',
    password: '',
  };

  constructor(private http: HttpClient,private router: Router, private authService: AuthService) {}

  login() {
    this.http.post<{ token: string }>('http://localhost:4900/api/login', this.formData).subscribe(
      (response) => {
        
        // Redirect to the '/products' page upon successful login
        //console.log(response.token)
        this.authService.setAuthToken(response.token);
        this.router.navigate(['/products']);
      },
      (error) => {
        console.error('Login error', error);
        // Handle login error
      }
    );
  }
}
