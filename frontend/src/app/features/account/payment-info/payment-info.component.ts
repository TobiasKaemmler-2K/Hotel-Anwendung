import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaymentMethod } from '../../../core/models/account.model';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-payment-info',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-info.component.html',
  styleUrl: './payment-info.component.css'
})
export class PaymentInfoComponent implements OnInit {
  paymentMethod: PaymentMethod | null = null;

  constructor(private readonly accountService: AccountService) {}

  ngOnInit(): void {
    this.paymentMethod = this.accountService.getPaymentMethod();
  }
}
