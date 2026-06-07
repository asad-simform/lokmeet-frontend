import { inject, Injectable } from '@angular/core';
import { BASE_URL } from './app.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private baseUrl = inject(BASE_URL);
    private http = inject(HttpClient);

    registerOwner(data: FormData) {
        return this.http.post<{ message: string }>(
            this.baseUrl + '/api/user/register-owner',
            data,
            {
                observe: 'response',
                withCredentials: true,
            },
        );
    }

    registerVenue(data: FormData) {
        return this.http.post<{ message: string }>(
            this.baseUrl + '/api/user/register-venue',
            data,
            {
                observe: 'response',
                withCredentials: true,
            },
        );
    }
}
