import {
    Component,
    OnInit,
    forwardRef,
    OnDestroy,
    ElementRef,
    ViewChild,
    Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as L from 'leaflet';

export interface MapCoordinates {
    lat: number;
    lng: number;
}

@Component({
    selector: 'app-form-map',
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormMapComponent),
            multi: true,
        },
    ],
    template: `
        <div
            class="relative w-full rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700"
        >
            <div #mapContainer [style.height]="height" class="w-full z-10"></div>
        </div>
    `,
})
export class FormMapComponent implements OnInit, ControlValueAccessor, OnDestroy {
    @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

    @Input() height = '350px';
    @Input() defaultCenter: MapCoordinates = { lat: 23.0225, lng: 72.5714 }; // Default: Ahmedabad
    @Input() defaultZoom = 13;

    private map!: L.Map;
    private marker!: L.Marker;
    private coordinates: MapCoordinates | null = null;

    onChange: (value: MapCoordinates | null) => void = () => {};
    onTouched: () => void = () => {};
    isDisabled = false;

    ngOnInit(): void {
        this.initMap();
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    private initMap(): void {
        // Fall back to defaultCenter if writeValue hasn't provided coordinates yet
        const initialLat = this.coordinates?.lat ?? this.defaultCenter.lat;
        const initialLng = this.coordinates?.lng ?? this.defaultCenter.lng;

        this.map = L.map(this.mapContainer.nativeElement, {
            center: [initialLat, initialLng],
            zoom: this.defaultZoom,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        // Initialize Marker with dragging configuration matched to initial component state
        this.marker = L.marker([initialLat, initialLng], {
            draggable: !this.isDisabled,
        }).addTo(this.map);

        // Fix map rendering issues inside hidden/dynamic tabs or delayed renders
        setTimeout(() => {
            this.map.invalidateSize();
        }, 0);

        // Bind interactive map events
        this.map.on('click', (e: L.LeafletMouseEvent) => {
            if (this.isDisabled) return;
            this.updateCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
        });

        this.marker.on('dragend', () => {
            const position = this.marker.getLatLng();
            this.updateCoordinates({ lat: position.lat, lng: position.lng });
        });
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 200);
    }

    private updateCoordinates(coords: MapCoordinates): void {
        this.coordinates = coords;
        this.marker.setLatLng([coords.lat, coords.lng]);
        this.map.panTo([coords.lat, coords.lng]);

        this.onChange(this.coordinates);
        this.onTouched();
    }

    // --- ControlValueAccessor Implementation Methods ---

    writeValue(value: MapCoordinates | null): void {
        // Allow clearing/resetting the form control state gracefully
        if (!value) {
            this.coordinates = null;
            return;
        }

        this.coordinates = value;

        // If map is initialized, push visual updates to view layer
        if (this.map && this.marker) {
            this.marker.setLatLng([value.lat, value.lng]);
            this.map.setView([value.lat, value.lng], this.map.getZoom());
        }
    }

    registerOnChange(fn: (value: MapCoordinates | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;

        // If map isn't ready yet, marker options initialization handles it
        if (!this.map || !this.marker) return;

        if (isDisabled) {
            this.marker.dragging?.disable();
        } else {
            this.marker.dragging?.enable();
        }
    }
}
