import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuscadorServicesService {
  private apiUrl = 'http://localhost:8080/api/busqueda';

  constructor(private http: HttpClient) {}

  buscar(busquedas: string[]): Observable<any[]> {
    console.log('Buscando:', busquedas);
    return this.http.post<any[]>(this.apiUrl, busquedas);
  }
}
