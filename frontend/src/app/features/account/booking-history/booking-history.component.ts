import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingHistoryEntry } from '../../../core/models/account.model';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent implements OnInit {
  history: BookingHistoryEntry[] = [];

  constructor(
    private readonly accountService: AccountService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.history = this.accountService.getBookingHistory();
  }

  showDetails(bookingNumber: string): void {
    alert(`Prototyp: Detailansicht fuer ${bookingNumber}`);
  }

  rebook(): void {
    this.router.navigate(['/rooms']);
  }
}
