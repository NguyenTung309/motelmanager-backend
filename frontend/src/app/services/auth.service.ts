import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

// Định nghĩa interface đúng với backend
export interface LoginPayload {
  Username: string;
  Password: string;
}
export interface RegisterPayload {
  Username: string;
  Password: string;
  Role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5161/api/auth';
  private tokenKey = 'jwt_token';
  private roleKey = 'user_role';

  constructor(private http: HttpClient) {}

  login(data: LoginPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (res && res.token && res.role) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.roleKey, res.role);
          console.log('JWT Token:', res.token);
          console.log('User Role:', res.role);
        } else {
          console.warn('Login response missing token or role:', res);
        }
      })
    );
  }

  register(data: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getRole(): string {
    return localStorage.getItem(this.roleKey) || '';
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }
}
