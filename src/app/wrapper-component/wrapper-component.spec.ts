import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperComponent } from './wrapper-component';

describe('WrapperComponent', () => {
    let component: WrapperComponent;
    let fixture: ComponentFixture<WrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WrapperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(WrapperComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
