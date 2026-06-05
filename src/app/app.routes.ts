import { Routes } from '@angular/router';
import { SignupComponent } from './signup-component/signup-component';
import { LoginComponent } from './login-component/login-component';
import { VerifyEmail } from './verify-email/verify-email';

export const routes: Routes = [
    {
        path: 'signup',
        component: SignupComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'verify-email',
        component: VerifyEmail,
    },
];
