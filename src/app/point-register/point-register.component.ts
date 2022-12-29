import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Map } from '../interfaces/map';
import { CoordinatesChangesService } from '../services/coordinates-changes.service';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-point-register',
  templateUrl: './point-register.component.html',
  styleUrls: ['./point-register.component.css'],
})
export class PointRegisterComponent implements OnInit, OnDestroy {
  constructor(
    private coordinatesChangesService: CoordinatesChangesService,
    private mapService: MapService
  ) {}
  changeEmitter!: Subscription;

  formMode: 'markert' | 'polygon' = 'markert';

  markerts: Map[] = [];
  @Output() mensajeEnviado = new EventEmitter<string>();

  coordinates: Map = {
    lat: 0,
    lng: 0,
  };

  ngOnInit(): void {
    this.changeEmitter =
      this.coordinatesChangesService.emitChangeCoordinates.subscribe(
        (value) => {
          this.coordinates = value;
          if (this.formMode === 'polygon') {
            this.handleAddCoordinates();
          }
        }
      );
  }
  ngOnDestroy(): void {
    this.changeEmitter.unsubscribe();
  }

  onChangeFormMode(e: any): void {
    if (this.markerts.length > 0) {
      alert('Hey, no alcanzaste a terminar poligono');
      this.markerts = [];
      return;
    }
    this.coordinatesChangesService.emitChangeFormMode.emit(e.value);
  }

  handleAddCoordinates(): void {
    this.markerts.push(this.coordinates);
    this.coordinates = {
      lat: 0,
      lng: 0,
    };
  }
  handleSaveCoordinates(): void {
    if (this.formMode === 'markert') {
      if (this.coordinates.id) {
        this.mapService.updateMarker(this.coordinates).subscribe((response) => {
          this.coordinatesChangesService.sendCoordinatesFromForm.emit(response);
        });
      } else {
        this.mapService.createMarker(this.coordinates).subscribe((response) => {
          this.coordinatesChangesService.sendCoordinatesFromForm.emit(response);
        });
      }
    }
    if (this.formMode === 'polygon') {
      if (this.markerts.length < 3) {
        alert(
          `Un poligono necesita al menos 3 puntos, te falta agregar ${
            3 - this.markerts.length
          }`
        );
      } else {
        const payloadCreatePolygon = {
          name: 'Poligono #x',
          markerts: this.markerts,
        };
        this.mapService
          .createPolygon(payloadCreatePolygon)
          .subscribe((response) => {
            this.coordinatesChangesService.sendPolygonFromForm.emit(response);
            this.markerts = [];
          });
      }
    }
  }
}
