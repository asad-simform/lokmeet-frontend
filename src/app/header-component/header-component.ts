import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-header-component',
    imports: [CommonModule, ButtonModule, RippleModule, RouterLink],
    templateUrl: './header-component.html',
    styleUrl: './header-component.css',
})
export class HeaderComponent {
    authService = inject(AuthService);
    isUserLoggedIn = computed(() => this.authService.loginStatus());
    toastService = inject(ToastService);

    logout() {
        this.authService.logout().subscribe({
            next: (res) => {
                if (res.ok) {
                    this.authService.loginStatus.set(false);
                    this.toastService.showSuccess(res.body?.message || 'Logout successfully');
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastService.showError(err.error.message);
            },
        });
    }
}
