import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRegistration } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registrationData: UserRegistration = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: ''
  };
  
  loading = false;
  errorMessage = '';
  successMessage = '';

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
    this.successMessage = '';

    this.authService.register(this.registrationData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Registration successful! Please login with your credentials.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
      }
    });
  }

  private isFormValid(): boolean {
    // Required fields validation
    if (!this.registrationData.first_name || !this.registrationData.last_name || 
        !this.registrationData.email || !this.registrationData.password || 
        !this.registrationData.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields.';
      return false;
    }

    // Email validation
    if (!this.isValidEmail(this.registrationData.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }

    // Password validation
    if (this.registrationData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return false;
    }

    // Password confirmation
    if (this.registrationData.password !== this.registrationData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
