import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Menu, MenuRequest } from '../interfaces/menu';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) {}


  getAllMenus(): Observable<MenuRequest[]> {
    return this.http.get<MenuRequest[]>(`${environment.apiMapUrl}/menus-all`);
  }

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${environment.apiMapUrl}/menus`);
  }

  createMenu(menu: MenuRequest): Observable<Menu> {
    return this.http.post<Menu>(`${environment.apiMapUrl}/menus`, menu);
  }

  editMenu(menu: MenuRequest): Observable<Menu> {
    return this.http.put<Menu>(`${environment.apiMapUrl}/menus/${menu.id}`, menu);
  }
  
}
