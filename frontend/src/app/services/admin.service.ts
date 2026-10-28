import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:5161/api/Admin';
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  getRegisterRequests(): Observable<RegisterRequest[]> {
    return this.http.get<RegisterRequest[]>(`${this.apiUrl}/register-requests`);
  }
  approveRegister(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve/${id}`, {}, { responseType: 'text' });
  }
}
