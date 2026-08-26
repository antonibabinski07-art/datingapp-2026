import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyCount = signal(0);

  busy() {
    this.busyCount.update(count => count + 1);
  }
  
  idle() {
    this.busyCount.update(count => Math.max(0, count - 1));
  }
}
