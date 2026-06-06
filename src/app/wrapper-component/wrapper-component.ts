import { Component } from '@angular/core';
import { HeaderComponent } from '../header-component/header-component';
import { FooterComponent } from '../footer-component/footer-component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-wrapper-component',
    imports: [HeaderComponent, FooterComponent, RouterOutlet],
    templateUrl: './wrapper-component.html',
    styleUrl: './wrapper-component.css',
})
export class WrapperComponent {}
