import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reservation } from '../../../core/models/reservation.model';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = false;
  errorMessage = '';

  constructor(private readonly reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  cancelReservation(reservationId: number): void {
    this.errorMessage = '';

    this.reservationService.cancelReservation(reservationId).subscribe({
      next: () => this.loadReservations(),
      error: () => {
        this.errorMessage = 'Reservierung konnte nicht storniert werden.';
      }
    });
  }

  private loadReservations(): void {
    this.loading = true;
    this.reservationService.getReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Reservierungen konnten nicht geladen werden.';
        this.loading = false;
      }
    });
  }
}
