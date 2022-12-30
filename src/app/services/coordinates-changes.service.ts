import { Injectable, Output, EventEmitter } from '@angular/core';
import { Map } from '../interfaces/map';

@Injectable({
  providedIn: 'root',
})
export class CoordinatesChangesService {
  @Output() emitChangeCoordinates: EventEmitter<Map> = new EventEmitter();
  @Output() sendCoordinatesFromForm: EventEmitter<Map> = new EventEmitter();
  @Output() formLoading: EventEmitter<boolean> = new EventEmitter();

  constructor() {}
}
