import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RoomListComponent } from './features/rooms/room-list/room-list.component';
import { RoomDetailsComponent } from './features/rooms/room-details/room-details.component';
import { ReservationFormComponent } from './features/reservations/reservation-form/reservation-form.component';
import { ReservationListComponent } from './features/reservations/reservation-list/reservation-list.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { PasswordResetComponent } from './features/account/password-reset/password-reset.component';
import { ProfileComponent } from './features/account/profile/profile.component';
import { SettingsComponent } from './features/account/settings/settings.component';
import { PaymentInfoComponent } from './features/account/payment-info/payment-info.component';
import { BookingHistoryComponent } from './features/account/booking-history/booking-history.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'rooms/:id', component: RoomDetailsComponent },
  { path: 'reservations', component: ReservationListComponent, canActivate: [authGuard] },
  { path: 'reservations/new', component: ReservationFormComponent, canActivate: [authGuard] },
  { path: 'reservations/:id/edit', component: ReservationFormComponent, canActivate: [authGuard] },
  { path: 'account/login', component: LoginComponent },
  { path: 'account/register', component: RegisterComponent },
  { path: 'account/password-reset', component: PasswordResetComponent },
  { path: 'account/profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'account/settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'account/payment', component: PaymentInfoComponent, canActivate: [authGuard] },
  { path: 'account/booking-history', component: BookingHistoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
