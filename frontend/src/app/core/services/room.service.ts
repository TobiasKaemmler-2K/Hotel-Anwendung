import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room, RoomFilter } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly apiBaseUrl = 'http://localhost:3000/api/rooms';

  constructor(private readonly http: HttpClient) {}

  getRooms(filters?: RoomFilter): Observable<Room[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'type') {
            params = params.set('category', String(value));
            return;
          }

          if (key === 'sortBy') {
            params = params.set('sortBy', String(value));
            return;
          }

          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<Room[]>(this.apiBaseUrl, { params });
  }

  getRoomById(roomId: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiBaseUrl}/${roomId}`);
  }
}
