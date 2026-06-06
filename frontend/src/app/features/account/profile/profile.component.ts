import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingHistoryEntry, UserProfile } from '../../../core/models/account.model';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  bookingHistory: BookingHistoryEntry[] = [];

  constructor(private readonly accountService: AccountService) {}

  ngOnInit(): void {
    this.profile = this.accountService.getProfile();
    this.bookingHistory = this.accountService.getBookingHistory().slice(0, 2);
  }
}
