import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Room } from '../../../core/models/room.model';
import { ReservationPayload } from '../../../core/models/reservation.model';
import { ReservationService } from '../../../core/services/reservation.service';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit {
  rooms: Room[] = [];
  loading = false;
  submitting = false;
  errorMessage = '';
  reservationId: number | null = null;

  readonly reservationForm = this.formBuilder.group({
    roomId: [0, [Validators.required, Validators.min(1)]],
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
    guestCount: [1, [Validators.required, Validators.min(1)]],
    customer: this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(5)]]
    })
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly roomService: RoomService,
    private readonly reservationService: ReservationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadRooms();

    const routeReservationId = Number(this.route.snapshot.paramMap.get('id'));
    if (routeReservationId) {
      this.reservationId = routeReservationId;
      this.loadReservationForEdit(routeReservationId);
      return;
    }

    const roomIdFromQuery = Number(this.route.snapshot.queryParamMap.get('roomId'));
    if (roomIdFromQuery) {
      this.reservationForm.patchValue({ roomId: roomIdFromQuery });
    }
  }

  get isEditMode(): boolean {
    return this.reservationId !== null;
  }

  submitForm(): void {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const payload = this.reservationForm.getRawValue() as ReservationPayload;

    const request$ = this.isEditMode
      ? this.reservationService.updateReservation(this.reservationId as number, payload)
      : this.reservationService.createReservation(payload);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/reservations']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Reservierung konnte nicht gespeichert werden.';
        this.submitting = false;
      }
    });
  }

  private loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: () => {
        this.errorMessage = 'Zimmer konnten nicht geladen werden.';
      }
    });
  }

  private loadReservationForEdit(reservationId: number): void {
    this.loading = true;
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        this.reservationForm.patchValue({
          roomId: reservation.roomId,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          guestCount: reservation.guestCount,
          customer: {
            firstName: reservation.customerFirstName || '',
            lastName: reservation.customerLastName || '',
            email: reservation.customerEmail || '',
            phone: reservation.customerPhone || ''
          }
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Reservierung konnte nicht geladen werden.';
        this.loading = false;
      }
    });
  }
}
