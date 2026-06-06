import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserSession } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionStorageKey = 'mrr-user-session';
  private readonly usersStorageKey = 'mrr-users';
  private readonly pendingRedirectKey = 'mrr-pending-redirect';

  private readonly userSubject = new BehaviorSubject<UserSession | null>(this.loadSession());
  readonly user$ = this.userSubject.asObservable();

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  getCurrentUser(): UserSession | null {
    return this.userSubject.value;
  }

  register(newUser: UserSession & { password: string }): { success: boolean; message: string } {
    const users = this.getStoredUsers();
    const userExists = users.some((storedUser) => storedUser.email.toLowerCase() === newUser.email.toLowerCase());

    if (userExists) {
      return { success: false, message: 'Diese E-Mail ist bereits registriert.' };
    }

    users.push(newUser);
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
    return { success: true, message: 'Registrierung erfolgreich. Bitte anmelden.' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const users = this.getStoredUsers();
    const matchedUser = users.find(
      (storedUser) => storedUser.email.toLowerCase() === email.toLowerCase() && storedUser.password === password
    );

    if (!matchedUser) {
      return { success: false, message: 'E-Mail oder Passwort sind nicht korrekt.' };
    }

    const session: UserSession = {
      firstName: matchedUser.firstName,
      lastName: matchedUser.lastName,
      email: matchedUser.email
    };

    localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
    this.userSubject.next(session);

    return { success: true, message: 'Login erfolgreich.' };
  }

  logout(): void {
    localStorage.removeItem(this.sessionStorageKey);
    this.userSubject.next(null);
  }

  setPendingRedirect(url: string): void {
    localStorage.setItem(this.pendingRedirectKey, url);
  }

  consumePendingRedirect(): string | null {
    const pending = localStorage.getItem(this.pendingRedirectKey);
    if (pending) {
      localStorage.removeItem(this.pendingRedirectKey);
    }
    return pending;
  }

  private loadSession(): UserSession | null {
    const raw = localStorage.getItem(this.sessionStorageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserSession;
    } catch (error) {
      localStorage.removeItem(this.sessionStorageKey);
      return null;
    }
  }

  private getStoredUsers(): Array<UserSession & { password: string }> {
    const raw = localStorage.getItem(this.usersStorageKey);
    if (!raw) {
      const demoUser = {
        firstName: 'Maximilian',
        lastName: 'Huber',
        email: 'max.huber@mrr-demo.de',
        password: 'demo1234'
      };
      localStorage.setItem(this.usersStorageKey, JSON.stringify([demoUser]));
      return [demoUser];
    }

    try {
      return JSON.parse(raw) as Array<UserSession & { password: string }>;
    } catch (error) {
      localStorage.removeItem(this.usersStorageKey);
      return [];
    }
  }
}
