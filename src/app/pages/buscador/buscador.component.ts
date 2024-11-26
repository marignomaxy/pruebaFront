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
import { FormularioAutosComponent } from '../../components/formulario-autos/formulario-autos.component';
import { ResultadoAutosComponent } from '../../components/resultado-autos/resultado-autos.component';

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
    FormularioAutosComponent,
    ResultadoAutosComponent,
  ],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss'],
})
export class BuscadorComponent {
  autos: {
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
  cantidadAutos: number = 1;
  resultados: any[] = [];
  datosRecibidos: boolean = false;
  datosAdicionales: any[] = [];
  errorMessage: string = '';

  constructor(
    private buscadorService: BuscadorServicesService,
    private autoService: AutoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.autos = this.autoService.getAutos();
    this.cantidadAutos = this.autos.length || 1;

    if (this.autos.length === 0) {
      this.autos = Array.from({ length: this.cantidadAutos }, () => ({
        item: 1,
        marca: '',
        anio: '',
        modelo: '',
        plan: '',
        franquicia: '',
        patente: '',
        motor: '',
        chasis: '',
      }));
    }
  }

  nuevaBusqueda() {
    const busquedas = this.autos.map(
      (auto) => `${auto.marca} ${auto.modelo} ${auto.anio}`
    );

    this.datosAdicionales = this.autos.map((auto) => ({
      plan: auto.plan,
      franquicia: auto.franquicia,
      patente: auto.patente,
      motor: auto.motor,
      chasis: auto.chasis,
    }));

    this.buscadorService.buscar(busquedas).subscribe(
      (response) => {
        console.log(response);
        this.resultados = response.map((resultado, index) => ({
          ...resultado.auto,
          ...this.datosAdicionales[index],
        }));
        this.datosRecibidos = true;
      },
      (error) => {
        this.errorMessage = error.message || 'Error desconocido';
        this.resultados = [];
      }
    );
  }

  actualizarResultados(resultados: any[]) {
    this.resultados = resultados;
    console.log(
      'Resultados actualizados en el componente padre:',
      this.resultados
    );
  }

  private guardarResultadosEnLocalStorage() {
    const resultadosSinErrores = this.resultados.filter(
      (resultado) => !resultado.error
    );
    localStorage.setItem('resultados', JSON.stringify(resultadosSinErrores));
  }

  reintentarErrores() {
    this.guardarResultadosEnLocalStorage();

    const autosConErrores = this.resultados
      .filter((resultado) => resultado.error)
      .map((resultado) => ({
        ...resultado,
        busqueda: resultado.busqueda,
        item: resultado.item,
      }));

    this.autos = autosConErrores;

    this.datosRecibidos = false;
  }

  exportarResultados() {
    console.log('Exportar resultados' + this.resultados);
    const data = this.resultados.map((resultado) => ({
      cd_MARCA: resultado.cd_MARCA || '',
      anio: resultado.anio || '',
      cd_MODELO: resultado.cd_MODELO || '',
      cd_TIPODEVEHICULO: resultado.cd_TIPODEVEHICULO || '',
      plan: resultado.plan || '',
      franquicia: resultado.franquicia || '',
      patente: resultado.patente || '',
      motor: resultado.motor || '',
      chasis: resultado.chasis || '',
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

    this.saveAsExcelFile(excelBuffer, 'resultados_busqueda');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `flotamars_${new Date().getTime()}.xlsx`);
  }

  limpiar() {
    this.autos = Array.from({ length: this.cantidadAutos }, () => ({
      item: 1,
      marca: '',
      anio: '',
      modelo: '',
      plan: '',
      franquicia: '',
      patente: '',
      motor: '',
      chasis: '',
    }));
    this.resultados = [];
    this.datosRecibidos = false;
    this.router.navigate(['/']);
  }
}
