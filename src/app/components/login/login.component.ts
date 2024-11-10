import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log("Login successful", response);
        this.errorMessage = null;
        this.router.navigate(['/home']); // Redirect to home after login
      },
      (error) => {
        console.error("Login failed", error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
  goBack() {
    this.router.navigate(['/']); // Navigate back to the homepage or previous page
  }
}