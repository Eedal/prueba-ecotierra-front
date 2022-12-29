import { Component, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import {
  Map,
  tileLayer,
  marker,
  LeafletMouseEvent,
  LatLngExpression,
  polygon,
  LeafletEventHandlerFn,
  LeafletEvent,
  Polygon as PolygonLeaflet,
} from 'leaflet';
import { Map as MapI } from '../interfaces/map';
import { CoordinatesChangesService } from '../services/coordinates-changes.service';
import { HttpClient } from '@angular/common/http';
import { Polygon } from '../interfaces/polygon';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnInit {
  private map!: Map;
  private INITIAL_VALUE_MAP: LatLngExpression = [51.505, -0.09];
  private INITIAL_ZOOM = 10;

  formMode: 'markert' | 'polygon' = 'markert';
  polygons: PolygonLeaflet<any>[] = [];
  constructor(
    private coordinatesChangesService: CoordinatesChangesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.coordinatesChangesService.sendCoordinatesFromForm.subscribe(
      ({ lat, lng }) => {
        this.addMarker([lat, lng]);
      }
    );

    this.coordinatesChangesService.sendPolygonFromForm.subscribe((response) => {
      this.addPolygon(response);
    });

    this.coordinatesChangesService.emitChangeFormMode.subscribe((value) => {
      this.formMode = value;
    });
  }

  getMarkerts(): void {
    this.http
      .get<MapI[]>('http://127.0.0.1:8000/api/markerts')
      .subscribe((markerts) => {
        if (markerts) {
          markerts.forEach(({ lat, lng, id, polygon_id }) => {
            this.addMarker([lat, lng], id, polygon_id);
          });
          const lastMarkert = markerts[markerts.length - 1];
          this.map.setView([lastMarkert.lat, lastMarkert.lng]);
        }
      });
  }

  getPolygons(): void {
    this.http
      .get<Polygon[]>('http://127.0.0.1:8000/api/polygons')
      .subscribe((polygons) => {
        if (polygons) {
          polygons.forEach(({ markerts }) => {
            const polygon = this.addPolygon(markerts);

          });
        }
      });
  }

  ngAfterViewInit(): void {
    this.map = new Map('map', {
      center: this.INITIAL_VALUE_MAP,
      zoom: this.INITIAL_ZOOM,
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: LeafletMouseEvent) => this.onMapClick(e));

    this.getMarkerts();

    this.getPolygons();
  }

  onMapClick(e: LeafletMouseEvent) {
    this.coordinatesChangesService.emitChangeCoordinates.emit(e.latlng);
    if (this.formMode === 'polygon') {
      this.addMarker(e.latlng);
    }
  }

  addMarker(latlng: LatLngExpression, id?: number, polygon_id?: number) {
    // @ts-ignore
    marker(latlng, { id, polygon_id, draggable: true })
      .addTo(this.map)
      .on('click', (e: LeafletMouseEvent) => this.handleClickMarkert(e))
      .on('moveend', (e: LeafletEvent) => this.handleMovedMarkert(e));
  }

  handleClickMarkert(e: LeafletMouseEvent) {
    const markert = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      id: e.target.options.id,
      polygon_id: e.target.options.polygon_id,
    };
    this.coordinatesChangesService.emitChangeCoordinates.emit(markert);
  }

  handleClickPolygon(e: LeafletMouseEvent) {
  }

  handleMovedMarkert(e: LeafletEvent) {
    const { lat, lng } = e.target._latlng;

    const markert = {
      lat,
      lng,
      id: e.target.options.id,
      polygon_id: e.target.options.polygon_id,
    };
    this.coordinatesChangesService.emitChangeCoordinates.emit(markert);
  }

  addPolygon(markerts: MapI[]) {
    //@ts-ignore
    const poly = polygon(markerts, { id: markerts[0].polygon_id })
      .addTo(this.map)
      .on('click', (e: LeafletMouseEvent) => this.handleClickPolygon(e));

    this.polygons.push(poly);
  }
}
