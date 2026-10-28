import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiMessageResponse } from './auth.service';

export interface User {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
}

export interface RegisterRequest {
  id: number;
  username: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getRegisterRequests(): Observable<RegisterRequest[]> {
    return this.http.get<RegisterRequest[]>(`${this.apiUrl}/register-requests`);
  }

  approveRegister(id: number): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(`${this.apiUrl}/approve/${id}`, {});
  }
}
