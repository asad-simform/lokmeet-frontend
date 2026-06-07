import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVenueComponent } from './register-venue-component';

describe('RegisterVenueComponent', () => {
    let component: RegisterVenueComponent;
    let fixture: ComponentFixture<RegisterVenueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegisterVenueComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterVenueComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
