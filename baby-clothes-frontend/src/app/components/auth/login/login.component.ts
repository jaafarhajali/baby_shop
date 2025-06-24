import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserLogin } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: UserLogin = {
    email: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.user) {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'Login failed. Please try again.';
      }
    });
  }

  private isFormValid(): boolean {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields.';
      return false;
    }

    if (!this.isValidEmail(this.loginData.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
