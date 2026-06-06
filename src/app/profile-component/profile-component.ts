import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { RegisterOwnerComponent } from '../register-owner-component/register-owner-component';

interface UserProfile {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatarUrl: string | null;
    isOwner: boolean;
}

@Component({
    selector: 'app-profile-component',
    imports: [CommonModule, ButtonModule, RippleModule, RegisterOwnerComponent],
    templateUrl: './profile-component.html',
    styleUrl: './profile-component.css',
})
export class ProfileComponent {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    visible = signal(false);
    user = signal<UserProfile | undefined>(undefined);
    ngOnInit(): void {
        this.authService.getUserDetails().subscribe({
            next: (res) => {
                if (res.ok) {
                    this.toastService.showSuccess(res.body?.message || 'User details fetched');
                    this.user.set(res.body?.data);
                }
            },
        });
    }
    registerAsOwner(): void {
        console.log('Initiating business ownership verification flow...');
        // Execute backend api patch updates here
        // this.user.up= true;
        this.visible.set(true);
    }
}
