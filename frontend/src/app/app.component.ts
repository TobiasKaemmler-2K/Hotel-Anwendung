import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSession } from './core/models/account.model';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly hotelName = 'MünchnerRoyalResidenz';
  showCookieBanner = false;
  currentUser: UserSession | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const savedConsent = localStorage.getItem('mrr-cookie-consent');
    this.showCookieBanner = savedConsent === null;

    this.themeService.applyStoredTheme();
    this.currentUser = this.authService.getCurrentUser();
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  acceptCookies(): void {
    localStorage.setItem('mrr-cookie-consent', 'accepted');
    this.showCookieBanner = false;
  }

  declineCookies(): void {
    localStorage.setItem('mrr-cookie-consent', 'declined');
    this.showCookieBanner = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
