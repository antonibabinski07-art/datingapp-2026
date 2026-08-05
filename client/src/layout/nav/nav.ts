import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  protected creds: any = {};

  login() {
    this.accountService.login(this.creds).subscribe({
      next: result => {
        this.router.navigateByUrl('/members');
        this.toastService.success("Logged in successfully");
        this.creds = {};
      },
      error: error => this.toastService.error(error.error)
    });
  }
  
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toastService.info("Logged out", 2000);
  }
}
