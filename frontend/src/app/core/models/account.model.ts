export interface UserSession {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate?: string;
  preferredLanguage: string;
  newsletterEnabled: boolean;
}

export interface PaymentMethod {
  cardHolder: string;
  cardProvider: string;
  maskedCardNumber: string;
  expiryDate: string;
  billingAddress: string;
  isPrototypeData: boolean;
}

export interface BookingHistoryEntry {
  bookingNumber: string;
  roomName: string;
  period: string;
  guestCount: number;
  totalPrice: number;
  bookingStatus: 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

export interface NotificationSettings {
  bookingUpdates: boolean;
  offers: boolean;
  reminders: boolean;
}

export interface UserSettings {
  darkModeEnabled: boolean;
  notificationSettings: NotificationSettings;
  newsletterEnabled: boolean;
}
