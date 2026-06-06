import { Customer } from './customer.model';

export interface ReservationPayload {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  customer: Customer;
}

export interface Reservation extends ReservationPayload {
  id: number;
  status: 'active' | 'cancelled';
  roomNumber?: string;
  roomType?: string;
  roomPrice?: number;
  customerId?: number;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt?: string;
}
