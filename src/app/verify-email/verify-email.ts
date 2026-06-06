import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-verify-email',
    imports: [CommonModule, ReactiveFormsModule, InputOtpModule, ButtonModule, RippleModule],
    templateUrl: './verify-email.html',
    styleUrl: './verify-email.css',
})
export class VerifyEmail {
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    timeLeft = signal(30);
    timerInterval: any;
    canResend = signal(false);

    otpForm = this.formBuilder.group({
        otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
    ngOnInit(): void {
        this.startTimer();
    }

    ngOnDestroy(): void {
        this.clearInterval();
    }

    startTimer(): void {
        this.timeLeft.set(30);
        this.canResend.set(false);
        this.clearInterval();
        this.timerInterval = setInterval(() => {
            if (this.timeLeft() > 0) {
                this.timeLeft.update((prev) => prev - 1);
            } else {
                this.canResend.set(true);
                this.clearInterval();
            }
        }, 1000);
    }

    clearInterval(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    resendOtp(): void {
        if (!this.canResend) return;
        if (!this.authService.userEmail()) {
            this.router.navigate(['/signup']);
            return;
        }
        this.authService.resendOtp(this.authService.userEmail()!).subscribe({
            next: (res) => {
                if (res.ok) {
                    this.toastService.showSuccess(res.body?.message || 'OTP send to your mail');
                    this.startTimer();
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastService.showError(err.error.message);
            },
        });
    }

    onSubmit(): void {
        if (this.otpForm.valid) {
            const code = this.otpForm.get('otpCode')?.value;
            if (!this.authService.userEmail()) {
                this.router.navigate(['/signup']);
                return;
            }
            this.authService
                .verifyOtp({ otp: Number(code), email: this.authService.userEmail()! })
                .subscribe({
                    next: (res) => {
                        if (res.ok) {
                            this.toastService.showSuccess(res.body?.message || 'OTP Verified');
                            this.authService.loginStatus.set(true);
                            this.router.navigate(['']);
                        }
                    },
                    error: (err: HttpErrorResponse) => {
                        this.toastService.showError(err.error.message);
                    },
                });
        } else {
            this.toastService.showError('Please submit the OTP.');
        }
    }
}
