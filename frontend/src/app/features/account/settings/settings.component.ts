import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSettings } from '../../../core/models/account.model';
import { AccountService } from '../../../core/services/account.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  savedMessage = '';

  readonly form = this.formBuilder.group({
    darkModeEnabled: [false],
    email: ['', [Validators.required, Validators.email]],
    currentPassword: ['', [Validators.minLength(6)]],
    newPassword: ['', [Validators.minLength(6)]],
    bookingUpdates: [true],
    offers: [false],
    reminders: [true],
    newsletterEnabled: [true],
    paymentReference: ['Visa **** 4821']
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly accountService: AccountService,
    private readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const settings = this.accountService.getSettings();
    const profile = this.accountService.getProfile();

    this.form.patchValue({
      darkModeEnabled: settings.darkModeEnabled,
      email: profile.email,
      bookingUpdates: settings.notificationSettings.bookingUpdates,
      offers: settings.notificationSettings.offers,
      reminders: settings.notificationSettings.reminders,
      newsletterEnabled: settings.newsletterEnabled
    });
  }

  save(): void {
    const value = this.form.getRawValue();

    const settings: UserSettings = {
      darkModeEnabled: value.darkModeEnabled || false,
      newsletterEnabled: value.newsletterEnabled || false,
      notificationSettings: {
        bookingUpdates: value.bookingUpdates || false,
        offers: value.offers || false,
        reminders: value.reminders || false
      }
    };

    this.accountService.saveSettings(settings);
    this.themeService.setDarkMode(settings.darkModeEnabled);

    const profile = this.accountService.getProfile();
    this.accountService.saveProfile({ ...profile, email: value.email || profile.email, newsletterEnabled: settings.newsletterEnabled });

    this.savedMessage = 'Einstellungen wurden gespeichert.';
  }
}
