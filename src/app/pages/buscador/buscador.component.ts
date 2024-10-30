import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BuscadorServicesService } from '../../services/buscador-services.service';
import { AutoService } from '../../services/auto.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatTableModule,
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
  cargaDesdeServicio: boolean = false;
  mostrarCamposEntrada: boolean = true;
  displayedColumnsAutos: string[] = ['item', 'marca', 'modelo', 'anio'];
  displayedColumnsResultados: string[] = [
    'item',
    'de_MARCA',
    'de_MODELO',
    'anio',
    'dr_TIPODEVEHICULO',
    'cd_MARCA',
    'cd_MODELO',
    'cd_TIPODEVEHICULO',
    'plan',
    'franquicia',
    'patente',
    'motor',
    'chasis',
    'mensajeError',
  ];

  constructor(
    private buscadorService: BuscadorServicesService,
    private autoService: AutoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener autos del servicio
    this.autos = this.autoService.getAutos();
    this.cantidadAutos = this.autos.length || 1;

    console.log('Autos cargados desde el servicio:', this.autos);

    if (this.autos.length > 0) {
      this.cargaDesdeServicio = true;
      this.datosRecibidos = false; // Para permitir una nueva búsqueda
    } else {
      this.autos = Array.from({ length: this.cantidadAutos }, () => ({
        marca: '',
        modelo: '',
        anio: '',
      }));
      this.datosRecibidos = false;
      this.cargaDesdeServicio = false;
    }
  }

  actualizarCantidadAutos() {
    if (this.cantidadAutos < 1) {
      this.cantidadAutos = 1; // Restablecer a 1 si se introduce un número menor que 1
      return;
    }

    const currentAutos = [...this.autos]; // Clonar el array actual de autos
    const newAutos = Array.from({ length: this.cantidadAutos }, (v, i) => ({
      marca: currentAutos[i]?.marca || '', // Mantener la marca si existe
      modelo: currentAutos[i]?.modelo || '', // Mantener el modelo si existe
      anio: currentAutos[i]?.anio || '', // Mantener el año si existe
    }));

    this.autos = newAutos; // Actualizar el array de autos
  }

  buscar() {
    if (!this.datosRecibidos) {
      // Solo ejecuta si datosRecibidos es falso
      const busquedas = this.autos.map(
        (auto) => `${auto.marca} ${auto.modelo} ${auto.anio}`
      );

      this.buscadorService.buscar(busquedas).subscribe(
        (response) => {
          this.resultados = response;
          console.log('Resultados de la búsqueda:', this.resultados);
          this.datosRecibidos = true; // Cambia a true después de la búsqueda exitosa
          this.mostrarCamposEntrada = false;
        },
        (error) => {
          console.error('Error en la búsqueda:', error);
        }
      );
    }
  }

  crear() {
    const data = this.resultados.map((resultado, index) => ({
      MARCA: resultado.auto?.de_MARCA || '',
      ANIO: resultado.auto?.anio || '',
      MODELO: resultado.auto?.de_MODELO || '',
      SUMA_ASEGURADA: '', // Campo vacío
      TP_VEHICULO: resultado.auto?.dr_TIPODEVEHICULO || '',
      PLAN: resultado.plan || '', // Campo de entrada
      FRANQUICIA: resultado.franquicia || '', // Campo de entrada
      PATENTE: resultado.patente || '', // Campo de entrada
      MOTOR: resultado.motor || '', // Campo de entrada
      CHASIS: resultado.chasis || '', // Campo de entrada
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { Datos: worksheet },
      SheetNames: ['Datos'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, 'datos_vehiculos');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  nueva() {
    this.autoService.clearAutos();
    this.router.navigate(['/']);
  }
}
