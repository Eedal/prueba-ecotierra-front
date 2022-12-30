import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Map } from '../interfaces/map';
import { CoordinatesChangesService } from '../services/coordinates-changes.service';
import { MapService } from '../services/map.service';

const INITIAL_VALUE_COORDINATE = {
  lat: 0,
  lng: 0,
}

@Component({
  selector: 'app-point-register',
  templateUrl: './point-register.component.html',
  styleUrls: ['./point-register.component.css'],
})
export class PointRegisterComponent implements OnInit, OnDestroy {
  changeCoordinateEmitter!: Subscription;

  coordinates: Map = INITIAL_VALUE_COORDINATE;
  formLoading = false;
  constructor(
    private coordinatesChangesService: CoordinatesChangesService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.changeCoordinateEmitter =
      this.coordinatesChangesService.emitChangeCoordinates.subscribe(
        (value) => {
          this.coordinates = value;
        }
      );

      this.coordinatesChangesService.formLoading.subscribe(
        (value) => {
          this.formLoading = value;
        }
      );
  }

  ngOnDestroy(): void {
    this.changeCoordinateEmitter.unsubscribe();
  }

  reset(): void {
    this.coordinates = INITIAL_VALUE_COORDINATE;
  }

  handleSaveCoordinates(): void {
    if (this.coordinates.id) {
      this.coordinatesChangesService.formLoading.emit(true);
      this.mapService.updateMarker(this.coordinates).subscribe((response) => {
        this.coordinatesChangesService.formLoading.emit(false);
        alert('Marcador actualizado en la db')
        this.reset();
      });
    } else {
      this.coordinatesChangesService.formLoading.emit(true);
      this.mapService.createMarker(this.coordinates).subscribe((response) => {
        this.coordinatesChangesService.formLoading.emit(false);
        alert('Marcador creado en la db')
        this.reset()
        this.coordinatesChangesService.sendCoordinatesFromForm.emit(response);
      });
    }
  }
}
