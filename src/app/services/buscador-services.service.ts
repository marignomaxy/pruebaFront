import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuscadorServicesService {
  private apiUrl =
    'https://backendprueba-production-4ca5.up.railway.app/api/busqueda';

  constructor(private http: HttpClient) {}

  buscar(busquedas: string[]): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, busquedas).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error);
        return of(
          busquedas.map((busqueda) => ({
            error: error.error || 'Error desconocido',
            busqueda,
          }))
        );
      })
    );
  }
}
