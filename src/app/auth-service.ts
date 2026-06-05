import { inject, Injectable, signal } from '@angular/core';
import { BASE_URL } from './app.config';
import { HttpClient } from '@angular/common/http';

interface IRegisterUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    preferences: string[];
}

interface ICategoryTags {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    loginStatus = signal(false);
    userEmail = signal<string | undefined>(undefined);
    private baseUrl = inject(BASE_URL);
    private http = inject(HttpClient);

    register(data: IRegisterUser) {
        return this.http.post<{ message: string }>(this.baseUrl + '/api/auth/register', data, {
            observe: 'response',
        });
    }

    getCategoryTags() {
        return this.http.get<{ message: string; data: ICategoryTags[] }>(
            this.baseUrl + '/api/auth/category-tags',
            {
                observe: 'response',
            },
        );
    }

    login(data: { email: string; password: string }) {
        return this.http.post<{
            message: string;
            data: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string;
                isVerified: boolean;
            };
        }>(this.baseUrl + '/api/auth/login', data, {
            observe: 'response',
            withCredentials: true,
        });
    }
}
