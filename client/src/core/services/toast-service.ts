import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastId = 'toast-container';

  constructor() {
    this.createToastContainer();
  }

  private createToastContainer(): void {
    if(!document.getElementById(this.toastId)) {
      const container = document.createElement('div');
      container.id = this.toastId;
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container);
    }
  }

  createToastElement(message: string, alertClass: string, duration = 5000): void {
    const toastContainer = document.getElementById(this.toastId);
    if(!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg');
    toast.innerHTML = `
      <span>${message}</span>
      <button class="btn btn-sm btn-ghost ml-4">x</button>
    `;

    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });
    
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if(toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }

  success(message: string, duration?: number) {
    this.createToastElement(message, 'alert-success', duration);
  }

  error(message: string, duration?: number) {
    this.createToastElement(message, 'alert-error', duration);
  }

  warning(message: string, duration?: number) {
    this.createToastElement(message, 'alert-warning', duration);
  }

  info(message: string, duration?: number) {
    this.createToastElement(message, 'alert-info', duration);
  }
}
