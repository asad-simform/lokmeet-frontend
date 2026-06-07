import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { FormMapComponent } from '../shared/form-map/form-map';
import { UserService } from '../user-service';
import { ToastService } from '../toast-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-register-venue-component',
    imports: [
        CommonModule,
        SelectModule,
        ReactiveFormsModule,
        FormMapComponent,
        InputTextModule,
        InputNumberModule,
        FileUploadModule,
        ButtonModule,
        RippleModule,
    ],
    templateUrl: './register-venue-component.html',
    styleUrl: './register-venue-component.css',
})
export class RegisterVenueComponent {
    private formBuilder = inject(FormBuilder);
    private userService = inject(UserService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    venueForm = this.formBuilder.group({
        venueName: ['', Validators.required],
        venueType: ['HALL', Validators.required],
        capacity: ['', [Validators.required, Validators.min(1)]],
        propertyPaperType: ['PROPERTY_TAXBILL', Validators.required],
        propertyNumber: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        geoCoordinates: [{ lat: 23.0225, lng: 72.5714 }, Validators.required],
    });

    uploadedFiles: { [key: string]: File | null } = {
        propertyDeed: null,
    };

    venueOptions = [
        { label: 'Open Air Party Plot', value: 'PARTYPLOT' },
        { label: 'Banquet / Conference Hall', value: 'HALL' },
        { label: 'Scenic Rooftop Terrace', value: 'ROOFTOP' },
        { label: 'Other Custom Structure', value: 'OTHER' },
    ];

    paperOptions = [
        { label: 'Government Property Tax Bill Receipt', value: 'PROPERTY_TAXBILL' },
        { label: 'Registered Leased Rent Agreement Deed', value: 'RENT_AGREEMENT' },
    ];

    onPrimeFileSelect(event: any, targetField: string): void {
        if (event.files && event.files.length > 0) {
            this.uploadedFiles[targetField] = event.files[0];
        }
    }

    onSubmit(): void {
        if (this.venueForm.valid) {
            if (!this.uploadedFiles['propertyDeed']!) return;
            const formData = new FormData();
            formData.append('venueName', this.venueForm.value.venueName!);
            formData.append('venueType', this.venueForm.value.venueType!);
            formData.append('propertyPaperType', this.venueForm.value.propertyPaperType!);
            formData.append('propertyNumber', this.venueForm.value.propertyNumber!);
            formData.append('capacity', this.venueForm.value.capacity!);
            formData.append('address', this.venueForm.value.address!);
            formData.append('city', this.venueForm.value.city!);
            formData.append('state', this.venueForm.value.state!);
            formData.append('zipCode', this.venueForm.value.zipCode!);
            formData.append('lat', String(this.venueForm.value.geoCoordinates?.lat!));
            formData.append('log', String(this.venueForm.value.geoCoordinates?.lng!));
            formData.append('propertyProof', this.uploadedFiles['propertyDeed']!);

            this.userService.registerVenue(formData).subscribe({
                next: (res) => {
                    if (res.ok) {
                        this.toastService.showSuccess(res.body?.message || 'Owner registered');
                        this.router.navigate(['/profile']);
                    }
                },
                error: (err: HttpErrorResponse) => {
                    this.toastService.showError(err.error.message);
                    this.venueForm.reset();
                },
            });
        }
    }
}
