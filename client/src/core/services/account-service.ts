import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import type { LoginData, RegisterData, User } from '../../types/user';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: "root"
})
export class AccountService {
    private readonly http = inject(HttpClient);
    public readonly currentUser = signal<User | null>(null);
    private apiBaseUrl = environment.apiUrl;
    
    setCurrentUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
    }

    register(creds: RegisterData) {

        return this.http.post<User>(this.apiBaseUrl + 'account/register', creds).pipe(
            tap(user => {
                if(user) {
                    this.setCurrentUser(user);
                }
            })
        );
    }

    login(creds: LoginData) {

        return this.http.post<User>(this.apiBaseUrl + "account/login", creds).pipe(
            tap(user => {
                if(user) {
                    this.setCurrentUser(user);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }
}
