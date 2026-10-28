
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MotelRoom {
  id: number;
  title: string;
  address: string;
  price: number;
  description: string;
  ownerId: number;
  owner?: any;
}

@Injectable({ providedIn: 'root' })
export class MotelRoomService {
  private apiUrl = 'http://localhost:5161/api/MotelRooms';
  constructor(private http: HttpClient) {}

  getAll(): Observable<MotelRoom[]> {
    return this.http.get<MotelRoom[]>(this.apiUrl);
  }
  getMyRooms(): Observable<MotelRoom[]> {
    return this.http.get<MotelRoom[]>(this.apiUrl + '/my');
  }
  getById(id: number): Observable<MotelRoom> {
    return this.http.get<MotelRoom>(`${this.apiUrl}/${id}`);
  }
  create(room: Partial<MotelRoom>): Observable<MotelRoom> {
    return this.http.post<MotelRoom>(this.apiUrl, room);
  }
  update(id: number, room: Partial<MotelRoom>): Observable<MotelRoom> {
    return this.http.put<MotelRoom>(`${this.apiUrl}/${id}`, room);
  }
  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  search(district?: string, minPrice?: number, maxPrice?: number): Observable<MotelRoom[]> {
    let params: any = {};
    if (district) params.district = district;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    return this.http.get<MotelRoom[]>(this.apiUrl + '/search', { params });
  }
}
