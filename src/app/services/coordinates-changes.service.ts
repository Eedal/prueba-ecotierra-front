import { Injectable, Output, EventEmitter } from '@angular/core';
import { Map } from '../interfaces/map';

@Injectable({
  providedIn: 'root',
})
export class CoordinatesChangesService {
  @Output() emitChangeCoordinates: EventEmitter<Map> = new EventEmitter();
  @Output() sendCoordinatesFromForm: EventEmitter<Map> = new EventEmitter();
  @Output() sendPolygonFromForm: EventEmitter<Map[]> = new EventEmitter();
  @Output() emitChangeFormMode: EventEmitter<'markert' | 'polygon'> = new EventEmitter();
  
  

  constructor() {}
}
