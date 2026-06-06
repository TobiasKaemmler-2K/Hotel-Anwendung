import { Injectable } from '@angular/core';
import { BookingHistoryEntry, PaymentMethod, UserProfile, UserSettings } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly profileStorageKey = 'mrr-user-profile';
  private readonly paymentStorageKey = 'mrr-user-payment';
  private readonly historyStorageKey = 'mrr-booking-history';
  private readonly settingsStorageKey = 'mrr-user-settings';

  getProfile(): UserProfile {
    const fallback: UserProfile = {
      firstName: 'Maximilian',
      lastName: 'Huber',
      email: 'max.huber@mrr-demo.de',
      phone: '+49 89 12345678',
      address: 'Theresienstrasse 10, 80333 Muenchen',
      birthDate: '1993-06-18',
      preferredLanguage: 'Deutsch',
      newsletterEnabled: true
    };

    return this.readFromStorage(this.profileStorageKey, fallback);
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(this.profileStorageKey, JSON.stringify(profile));
  }

  getPaymentMethod(): PaymentMethod {
    const fallback: PaymentMethod = {
      cardHolder: 'Maximilian Huber',
      cardProvider: 'Visa',
      maskedCardNumber: '**** **** **** 4821',
      expiryDate: '09/28',
      billingAddress: 'Theresienstrasse 10, 80333 Muenchen',
      isPrototypeData: true
    };

    return this.readFromStorage(this.paymentStorageKey, fallback);
  }

  savePaymentMethod(paymentMethod: PaymentMethod): void {
    localStorage.setItem(this.paymentStorageKey, JSON.stringify(paymentMethod));
  }

  getBookingHistory(): BookingHistoryEntry[] {
    const fallback: BookingHistoryEntry[] = [
      {
        bookingNumber: 'MRR-2026-1042',
        roomName: 'MünchnerRoyalResidenz Deluxe 214',
        period: '12.08.2026 - 15.08.2026',
        guestCount: 2,
        totalPrice: 1095,
        bookingStatus: 'completed',
        paymentStatus: 'paid'
      },
      {
        bookingNumber: 'MRR-2026-1178',
        roomName: 'MünchnerRoyalResidenz Junior Suite 308',
        period: '04.10.2026 - 07.10.2026',
        guestCount: 2,
        totalPrice: 1590,
        bookingStatus: 'confirmed',
        paymentStatus: 'paid'
      },
      {
        bookingNumber: 'MRR-2026-1201',
        roomName: 'MünchnerRoyalResidenz Classic 111',
        period: '20.11.2026 - 22.11.2026',
        guestCount: 1,
        totalPrice: 498,
        bookingStatus: 'confirmed',
        paymentStatus: 'pending'
      }
    ];

    return this.readFromStorage(this.historyStorageKey, fallback);
  }

  getSettings(): UserSettings {
    const fallback: UserSettings = {
      darkModeEnabled: localStorage.getItem('mrr-dark-mode') === 'true',
      newsletterEnabled: true,
      notificationSettings: {
        bookingUpdates: true,
        offers: false,
        reminders: true
      }
    };

    return this.readFromStorage(this.settingsStorageKey, fallback);
  }

  saveSettings(settings: UserSettings): void {
    localStorage.setItem(this.settingsStorageKey, JSON.stringify(settings));
  }

  private readFromStorage<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
  }
}
