import { Component, inject, OnInit, signal } from '@angular/core';
import { Location, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../../data/themes';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  private router = inject(Router);
  private location = inject(Location)
  protected accountService = inject(AccountService);
  private toastService = inject(ToastService);
  protected creds: any = {};
  protected themes = themes;
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSetTheme(theme: string): void {
    if(!themes.includes(theme)) return;

    if(theme !== this.selectedTheme()) {
      localStorage.setItem('theme', theme);
      this.selectedTheme.set(theme);
      document.documentElement.setAttribute('data-theme', theme);
      const el = document.activeElement as HTMLDivElement;
      if(el) el.blur();
    }
  }

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
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

  isRootRoute(): boolean {
    return this.router.url === '/';
  }
}
