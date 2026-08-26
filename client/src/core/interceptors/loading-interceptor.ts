import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.method === "GET") {
    const cachedRespone = cache.get(req.url);
    if(cachedRespone) {
      return of(cachedRespone);
    }
  }

  const busyService = inject(BusyService);
  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response => cache.set(req.url, response)),
    finalize(() => busyService.idle())
  );
};
