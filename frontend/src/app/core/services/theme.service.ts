import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly darkModeStorageKey = 'mrr-dark-mode';

  applyStoredTheme(): void {
    const darkModeEnabled = localStorage.getItem(this.darkModeStorageKey) === 'true';
    this.setDarkMode(darkModeEnabled);
  }

  setDarkMode(enabled: boolean): void {
    localStorage.setItem(this.darkModeStorageKey, String(enabled));
    document.body.classList.toggle('dark-mode', enabled);
  }

  isDarkModeEnabled(): boolean {
    return localStorage.getItem(this.darkModeStorageKey) === 'true';
  }
}
