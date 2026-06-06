import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation, ReservationPayload } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly apiBaseUrl = 'http://localhost:3000/api/reservations';

  constructor(private readonly http: HttpClient) {}

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiBaseUrl);
  }

  getReservationById(reservationId: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiBaseUrl}/${reservationId}`);
  }

  createReservation(payload: ReservationPayload): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiBaseUrl, payload);
  }

  updateReservation(reservationId: number, payload: ReservationPayload): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiBaseUrl}/${reservationId}`, payload);
  }

  cancelReservation(reservationId: number): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.apiBaseUrl}/${reservationId}`);
  }
}
