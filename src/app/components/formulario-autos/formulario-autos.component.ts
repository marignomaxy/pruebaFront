import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-formulario-autos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './formulario-autos.component.html',
  styleUrl: './formulario-autos.component.scss',
})
export class FormularioAutosComponent {
  displayedColumns: string[] = [
    'item',
    'marca',
    'anio',
    'modelo',
    'plan',
    'franquicia',
    'patente',
    'motor',
    'chasis',
  ];
  @Input() autos: {
    item: number;
    marca: string;
    modelo: string;
    anio: string;
    plan: string;
    franquicia: string;
    patente: string;
    motor: string;
    chasis: string;
  }[] = [];
  @Input() cantidadAutos: number = 1;
  @Output() autosActualizados = new EventEmitter<any[]>();
  @Output() nuevaBusqueda = new EventEmitter<void>();

  actualizarCantidadAutos() {
    if (this.cantidadAutos < 1) {
      this.cantidadAutos = 1;
      return;
    }

    const currentAutos = [...this.autos];
    const newAutos = Array.from({ length: this.cantidadAutos }, (v, i) => ({
      item: i + 1,
      marca: currentAutos[i]?.marca || '',
      modelo: currentAutos[i]?.modelo || '',
      anio: currentAutos[i]?.anio || '',
      plan: currentAutos[i]?.plan || '',
      franquicia: currentAutos[i]?.franquicia || '',
      patente: currentAutos[i]?.patente || '',
      motor: currentAutos[i]?.motor || '',
      chasis: currentAutos[i]?.chasis || '',
    }));

    this.autos = newAutos;

    this.autosActualizados.emit(this.autos);
  }

  iniciarNuevaBusqueda() {
    this.nuevaBusqueda.emit();
  }
}
