import { Injectable } from '@angular/core';
import { Map } from '../interfaces/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Polygon } from '../interfaces/polygon';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}
  
  getPolygons(): Observable<Polygon[]> {
    return this.http.get<Polygon[]>(`${environment.apiMapUrl}/polygons`);
  }

  getMarkerts(): Observable<Map[]> {
    return this.http.get<Map[]>(`${environment.apiMapUrl}/markerts`);
  }

  createMarker(marker: Map): Observable<Map> {
    return this.http.post<Map>(`${environment.apiMapUrl}/markerts`, marker);
  }

  updateMarker(marker: Map): Observable<Map> {
    return this.http.put<Map>(
      `${environment.apiMapUrl}/markerts/${marker.id}`,
      marker
    );
  }

  createPolygon(markerts: Map[]): Observable<Map[]> {
    return this.http.post<Map[]>(`${environment.apiMapUrl}/polygons`, markerts);
  }
}
