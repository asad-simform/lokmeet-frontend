import { Component, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-register-owner-component',
    imports: [DialogModule, InputTextModule, ButtonModule],
    templateUrl: './register-owner-component.html',
    styleUrl: './register-owner-component.css',
})
export class RegisterOwnerComponent {
    visible = model(false);
    cancel() {
        console.log('cancel');
        this.visible.set(false);
    }

    save() {
        console.log('save');
        this.visible.set(false);
    }
}
