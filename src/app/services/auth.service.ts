import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://fakestoreapi.com';
  private isAuthenticated = false;
  private userId: number | null = null; 
  

  constructor(private http: HttpClient,) {
    if (this.isBrowser()) {
    this.isAuthenticated = !!localStorage.getItem('token');     
  }
}

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

public getUserId(): number | null {
    return this.userId; 
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (this.isBrowser() && response.token) {
            localStorage.setItem('token', response.token); // Store token in localStorage
            localStorage.setItem('userId', '1');
            this.isAuthenticated = true;
          }
        }),
        map(() => this.isAuthenticated)
      );
  }

  retrieveUserId(): number | null {
    if (this.isBrowser()) {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
  return null;
}
  
  logout(): void {
    if (this.isBrowser()) {
    localStorage.removeItem('token'); 
    // Remove token from localStorage
    }
    this.isAuthenticated = false;
    this.userId = null;

  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}



