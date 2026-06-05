import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../toast-service';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login-component',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        ButtonModule,
        CommonModule,
        InputTextModule,
        RouterLink,
        ToastModule,
    ],
    providers: [ToastService],
    templateUrl: './login-component.html',
    styleUrl: './login-component.css',
})
export class LoginComponent {
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
    });

    onSubmit() {
        // console.log(this.loginForm.value);
        if (this.loginForm.invalid) {
            this.toastService.showError('Provide proper values.');
            return;
        }
        if (this.loginForm.value.email && this.loginForm.value.password) {
            this.authService
                .login({
                    email: this.loginForm.value.email,
                    password: this.loginForm.value.password,
                })
                .subscribe({
                    next: (data) => {
                        if (data.ok) {
                            this.toastService.showSuccess(data.body?.message || '');
                            this.router.navigate(['']);
                        }
                    },
                    error: (err: HttpErrorResponse) => {
                        this.loginForm.reset();
                        this.toastService.showError(err.error.message);
                    },
                });
        }
    }
}
