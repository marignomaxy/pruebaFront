import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuscadorServicesService {
  private apiUrl =
    'https://backendprueba-production-4ca5.up.railway.app/api/busqueda';

  constructor(private http: HttpClient) {}

  buscar(busquedas: string[]): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, busquedas);
  }
}
