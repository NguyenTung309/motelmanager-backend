import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiMessageResponse } from './auth.service';

export interface MotelRoomOwner {
  id: number;
  username: string;
  role: string;
}

export interface MotelRoom {
  id: number;
  title: string;
  address: string;
  price: number;
  description?: string;
  ownerId: number;
  owner?: MotelRoomOwner;
}

export interface MotelRoomPayload {
  title: string;
  address: string;
  price: number;
  description?: string;
}

interface ODataCollectionResponse<T> {
  value: T[];
  '@odata.count'?: number;
}

@Injectable({ providedIn: 'root' })
export class MotelRoomService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/motelrooms`;
  private readonly odataUrl = `${environment.apiBaseUrl}/odata/MotelRooms`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MotelRoom[]> {
    return this.queryRooms();
  }

  getMyRooms(): Observable<MotelRoom[]> {
    return this.http.get<MotelRoom[]>(`${this.apiUrl}/my`);
  }

  getById(id: number): Observable<MotelRoom> {
    return this.http.get<MotelRoom>(`${this.apiUrl}/${id}`);
  }

  create(room: MotelRoomPayload): Observable<MotelRoom> {
    return this.http.post<MotelRoom>(this.apiUrl, room);
  }

  update(id: number, room: MotelRoomPayload): Observable<MotelRoom> {
    return this.http.put<MotelRoom>(`${this.apiUrl}/${id}`, room);
  }

  deleteRoom(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(`${this.apiUrl}/${id}`);
  }

  search(district?: string, minPrice?: number, maxPrice?: number): Observable<MotelRoom[]> {
    return this.queryRooms({ district, minPrice, maxPrice });
  }

  private queryRooms(filters?: { district?: string; minPrice?: number; maxPrice?: number }): Observable<MotelRoom[]> {
    return this.http
      .get<ODataCollectionResponse<MotelRoom>>(this.odataUrl, { params: this.buildODataParams(filters) })
      .pipe(map(response => response.value ?? []));
  }

  private buildODataParams(filters?: { district?: string; minPrice?: number; maxPrice?: number }): HttpParams {
    let params = new HttpParams()
      .set('$count', 'true')
      .set('$expand', 'owner')
      .set('$orderby', 'id desc');

    const odataFilters: string[] = [];

    if (filters?.district?.trim()) {
      odataFilters.push(`contains(address,'${this.escapeODataString(filters.district.trim())}')`);
    }

    if (filters?.minPrice != null) {
      odataFilters.push(`price ge ${filters.minPrice}`);
    }

    if (filters?.maxPrice != null) {
      odataFilters.push(`price le ${filters.maxPrice}`);
    }

    if (odataFilters.length > 0) {
      params = params.set('$filter', odataFilters.join(' and '));
    }

    return params;
  }

  private escapeODataString(value: string): string {
    return value.replace(/'/g, "''");
  }
}
