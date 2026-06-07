import { Component, inject, input, model } from '@angular/core';
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
    selector: 'app-register-owner-component',
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
    templateUrl: './register-owner-component.html',
    styleUrl: './register-owner-component.css',
})
export class RegisterOwnerComponent {
    private formBuilder = inject(FormBuilder);
    private userService = inject(UserService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    ownerForm = this.formBuilder.group({
        businessName: ['', Validators.required],
        panNumber: ['', Validators.required],
        gstNumber: ['', Validators.required],
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
        gstCert: null,
        propertyDeed: null,
        panCard: null,
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
        if (this.ownerForm.valid) {
            if (
                !this.uploadedFiles['gstCert']! ||
                !this.uploadedFiles['propertyDeed']! ||
                !this.uploadedFiles['panCard']!
            )
                return;
            const formData = new FormData();
            formData.append('businessName', this.ownerForm.value.businessName!);
            formData.append('panNumber', this.ownerForm.value.panNumber!);
            formData.append('gstNumber', this.ownerForm.value.gstNumber!);
            formData.append('venueName', this.ownerForm.value.venueName!);
            formData.append('venueType', this.ownerForm.value.venueType!);
            formData.append('propertyPaperType', this.ownerForm.value.propertyPaperType!);
            formData.append('propertyNumber', this.ownerForm.value.propertyNumber!);
            formData.append('capacity', this.ownerForm.value.capacity!);
            formData.append('address', this.ownerForm.value.address!);
            formData.append('city', this.ownerForm.value.city!);
            formData.append('state', this.ownerForm.value.state!);
            formData.append('zipCode', this.ownerForm.value.zipCode!);
            formData.append('lat', String(this.ownerForm.value.geoCoordinates?.lat!));
            formData.append('log', String(this.ownerForm.value.geoCoordinates?.lng!));
            formData.append('gstCertificate', this.uploadedFiles['gstCert']!);
            formData.append('propertyProof', this.uploadedFiles['propertyDeed']!);
            formData.append('panCard', this.uploadedFiles['panCard']!);

            this.userService.registerOwner(formData).subscribe({
                next: (res) => {
                    if (res.ok) {
                        this.toastService.showSuccess(res.body?.message || 'Owner registered');
                        this.router.navigate(['/profile']);
                    }
                },
                error: (err: HttpErrorResponse) => {
                    this.toastService.showError(err.error.message);
                    this.ownerForm.reset();
                },
            });
        }
    }
}
