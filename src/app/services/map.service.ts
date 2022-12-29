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

  createMarker(marker: Map): Observable<Map> {
    return this.http.post<Map>(`${environment.apiMapUrl}/markerts`, marker);
  }

  updateMarker(marker: Map): Observable<Map> {
    return this.http.put<Map>(
      `${environment.apiMapUrl}/markerts/${marker.id}`,
      marker
    );
  }

  createPolygon(markerts: {
    name: string;
    markerts: Map[];
  }): Observable<Map[]> {
    return this.http.post<Map[]>(`${environment.apiMapUrl}/polygons`, markerts);
  }

  getPolygons(): Observable<Polygon[]> {
    return this.http.get<Polygon[]>('http://127.0.0.1:8000/api/polygons');
  }
}
