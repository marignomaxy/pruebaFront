import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AutoService {
  private autos: any[] = [];

  setAutos(autos: any[]) {
    this.autos = autos;
  }

  getAutos() {
    return this.autos;
  }

  clearAutos() {
    this.autos = [];
  }
}
