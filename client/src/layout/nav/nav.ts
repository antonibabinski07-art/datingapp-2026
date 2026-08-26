import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { filter, Subscription } from 'rxjs';

import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../../data/themes';
import { BusyService } from '../../core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit, OnDestroy {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private subscription = new Subscription();
  protected busyService = inject(BusyService);
  protected accountService = inject(AccountService);
  protected creds: any = {};
  protected themes = themes;
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  isRootRoute = false;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
    const sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.isRootRoute = (this.router.url === '/');
        }
      });
    
    this.subscription.add(sub);
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

  editAccount() {
    const el = document.activeElement as HTMLAnchorElement;
    el.blur();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
