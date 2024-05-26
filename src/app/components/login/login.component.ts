import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  login() {
    this.http.post<{ token: string }>('http://localhost:4900/api/login', this.formData).subscribe(
      (response) => {
        this.authService.setAuthToken(response.token);
        this.messageService.showMessage("Login Success", 5000, "success");
        this.cdr.detectChanges(); // Trigger change detection after login
        this.router.navigate(['/products']);
      },
      (error) => {
        console.error('Login error', error);
        this.messageService.showMessage(`Login Failed: ${error.error}`, 5000, "error");
      }
    );
  }
}
