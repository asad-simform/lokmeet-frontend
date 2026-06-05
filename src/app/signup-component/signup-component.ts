import { Component, inject, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import {
    FormArray,
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { HttpErrorResponse } from '@angular/common/http';

interface ICategoryTags {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
}

@Component({
    selector: 'app-signup-component',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        RippleModule,
        RouterLink,
        ToastModule,
    ],
    providers: [ToastService],
    templateUrl: './signup-component.html',
    styleUrl: './signup-component.css',
})
export class SignupComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    categoryTags = signal<ICategoryTags[]>([]);

    ngOnInit(): void {
        this.authService.getCategoryTags().subscribe({
            next: (tags) => {
                console.log(tags.body);
                this.categoryTags.set(tags.body?.data || []);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    signupForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        phone: ['', [Validators.required]],
        preference: this.formBuilder.array<FormControl<string>>([], [Validators.required]),
    });

    get prefArray(): FormArray {
        return this.signupForm.controls['preference'] as FormArray;
    }

    updatePreferences(id: string) {
        const idx = this.prefArray.controls.findIndex((control) => control.value === id);
        if (idx >= 0) {
            this.prefArray.removeAt(idx);
        } else {
            this.prefArray.push(new FormControl<string>(id));
        }
        console.log(this.prefArray.value);
    }

    onSubmit() {
        if (this.signupForm.value.preference?.length === 0) {
            this.toastService.showError('Select atleast one preference.');
            return;
        } else if (this.signupForm.invalid) {
            this.toastService.showError('Provide proper values.');
            return;
        }
        console.log(this.signupForm.value);

        if (
            this.signupForm.value.email &&
            this.signupForm.value.firstName &&
            this.signupForm.value.lastName &&
            this.signupForm.value.password &&
            this.signupForm.value.preference &&
            this.signupForm.value.phone
        ) {
            this.authService
                .register({
                    email: this.signupForm.value.email,
                    firstName: this.signupForm.value.firstName,
                    lastName: this.signupForm.value.lastName,
                    password: this.signupForm.value.password,
                    phone: this.signupForm.value.phone,
                    preferences: this.signupForm.value.preference,
                })
                .subscribe({
                    next: (data) => {
                        if (data.ok) {
                            this.toastService.showSuccess(data.body?.message || '');
                            this.authService.userEmail.set(this.signupForm.value.email!);
                            this.router.navigate(['/verify-email']);
                        }
                    },
                    error: (err: HttpErrorResponse) => {
                        this.toastService.showError(err.error.message);
                        this.signupForm.controls.preference.clear();
                        this.signupForm.reset();
                    },
                });
        }
    }
}
