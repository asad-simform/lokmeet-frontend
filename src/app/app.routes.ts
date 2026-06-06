import { Routes } from '@angular/router';
import { SignupComponent } from './signup-component/signup-component';
import { LoginComponent } from './login-component/login-component';
import { VerifyEmail } from './verify-email/verify-email';
import { WrapperComponent } from './wrapper-component/wrapper-component';
import { HomeComponent } from './home-component/home-component';
import { ProfileComponent } from './profile-component/profile-component';
import { authGuard } from './guards/auth-guard';

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
    {
        path: '',
        component: WrapperComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [authGuard],
            },
        ],
    },
];
