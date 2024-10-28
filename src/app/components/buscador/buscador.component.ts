import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BuscadorServicesService } from '../../services/buscador-services.service';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss'],
})
export class BuscadorComponent {
  cantidadAutos: number = 1;
  autos: { marca: string; modelo: string; anio: string }[] = [
    { marca: '', modelo: '', anio: '' },
  ];
  patente: string[] = [];
  motor: string[] = [];
  chasis: string[] = [];
  resultados: any[] = [];
  mostrarCamposAdicionales: boolean = false;
  datosRecibidos: boolean = false;

  constructor(private buscadorService: BuscadorServicesService) {}

  actualizarCantidadAutos() {
    this.autos = Array.from({ length: this.cantidadAutos }, () => ({
      marca: '',
      modelo: '',
      anio: '',
    }));
    this.patente = Array(this.cantidadAutos).fill('');
    this.motor = Array(this.cantidadAutos).fill('');
    this.chasis = Array(this.cantidadAutos).fill('');
  }

  buscar() {
    const busquedas = this.autos.map(
      (auto) => `${auto.marca} ${auto.modelo} ${auto.anio}`
    );
    this.buscadorService.buscar(busquedas).subscribe(
      (response) => {
        this.resultados = response;
        console.log('Resultados:', this.resultados);
        this.datosRecibidos = true;
        this.mostrarCamposAdicionales = true;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  crear() {
    this.resultados.forEach((resultado, index) => {
      const itemInfo = {
        item: `Item ${index + 1}`,
        datosRecibidos: resultado,
        patente: this.patente[index],
        motor: this.motor[index],
        chasis: this.chasis[index],
      };
      console.log(itemInfo);
    });
  }

  nueva() {
    this.resultados = [];
    this.datosRecibidos = false;
    this.mostrarCamposAdicionales = false;
  }
}
