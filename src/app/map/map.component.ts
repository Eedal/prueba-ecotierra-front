import { Component, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
// import {
//   Map,
//   tileLayer,
//   marker,
//   LeafletMouseEvent,
//   LatLngExpression,
//   polygon,
//   LeafletEventHandlerFn,
//   LeafletEvent,
//   Polygon as PolygonLeaflet,
// } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-draw';

import { Map as MapI } from '../interfaces/map';
import { CoordinatesChangesService } from '../services/coordinates-changes.service';
import { HttpClient } from '@angular/common/http';
import { MapService } from '../services/map.service';
import { Polygon } from '../interfaces/polygon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnInit {
  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;
  private INITIAL_VALUE_MAP: L.LatLngExpression = [51.505, -0.09];
  private INITIAL_ZOOM = 10;
  private createMarkertEmitter!: Subscription;
  private createPolygontEmitter!: Subscription;


  constructor(
    private coordinatesChangesService: CoordinatesChangesService,
    private mapService: MapService,
  ) {}

  ngOnInit(): void {
    this.createMarkertEmitter = 
      this.coordinatesChangesService.sendCoordinatesFromForm.subscribe(
      ({ lat, lng, id }) => {
        this.addMarker([lat, lng], id);
      });
  }

  ngAfterViewInit(): void {
    this.initializationMap()

    this.getMarkerts();

    this.getPolygons();
  }

  initializationMap(): void {
    this.map = new L.Map('map', {
      center: this.INITIAL_VALUE_MAP,
      zoom: this.INITIAL_ZOOM,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);


    this.drawnItems = new L.FeatureGroup()
    this.map.addLayer(this.drawnItems);

    const drawControl = new L.Control.Draw({
      draw:{
        circle: false,
        polyline: false,
        rectangle: false,
        circlemarker: false,
      }
    });
    this.map.addControl(drawControl);

    this.map.on('draw:created', (e: any) => this.onDrawCreated(e))
    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  getMarkerts(): void {
    this.mapService.getMarkerts()
      .subscribe((markerts) => {
        if (markerts.length > 0) {
          markerts.forEach(({ lat, lng, id }) => {
            this.addMarker([lat, lng], id);
          });
          this.centerViewInLastMarkert(markerts);
        }
      });
  }

  getPolygons(): void {
    this.mapService.getPolygons()
      .subscribe((polygons) => {
        if (polygons.length > 0) {
          polygons.forEach(({ markerts }) => {
            this.addPolygon(markerts);
          });
        }
      });
  }

  addMarker(latlng: L.LatLngExpression, id?: number) {
    // @ts-ignore
    L.marker(latlng, { id, draggable: true })
      .addTo(this.map)
      .on('click', (e: L.LeafletMouseEvent) => this.handleClickMarkert(e))
      .on('moveend', (e: L.LeafletEvent) => this.handleMovedMarkert(e));
  }

  addPolygon(markerts: MapI[]) {
    L.polygon(markerts)
      .addTo(this.map)
  }

  centerViewInLastMarkert(markerts: MapI[]): void {    
    const lastMarkert = markerts[markerts.length - 1];
    this.map.setView([lastMarkert.lat, lastMarkert.lng]);
  }
  
  onDrawCreated(event: any): void{
    const { layerType, layer } = event;

    if(layerType === 'polygon') {
      const markerts: MapI[] = layer._latlngs[0];
      this.coordinatesChangesService.formLoading.emit(true);
      this.mapService.createPolygon(markerts).subscribe(() => {
        this.coordinatesChangesService.formLoading.emit(false);
        alert('Poligono y sus relaciones de puntos se han creado en la db');
        this.addPolygon(markerts);
      });
    }

    if(layerType === 'marker') {
      const markert: MapI = layer._latlng;
      this.coordinatesChangesService.formLoading.emit(true);
      this.mapService.createMarker(markert).subscribe(() => {
        this.coordinatesChangesService.formLoading.emit(false);
        alert('Marcador ha sido creado en la db')
        this.addMarker(layer._latlng)
      })
    }
  }

  onMapClick(e: L.LeafletMouseEvent) {
    this.coordinatesChangesService.emitChangeCoordinates.emit(e.latlng);
  }

  handleClickMarkert(e: L.LeafletMouseEvent) {
    const { lat, lng } = e.latlng;
    const markert = {
      lat,
      lng,
      id: e.target.options.id,
    };

    this.coordinatesChangesService.emitChangeCoordinates.emit(markert);
  }

  handleMovedMarkert(e: L.LeafletEvent) {
    const { lat, lng } = e.target._latlng;

    const markert = {
      lat,
      lng,
      id: e.target.options.id,
    };
    this.coordinatesChangesService.emitChangeCoordinates.emit(markert);
  }
}
