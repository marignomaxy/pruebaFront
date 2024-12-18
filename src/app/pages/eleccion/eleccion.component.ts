import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AutoService } from '../../services/auto.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-eleccion',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './eleccion.component.html',
  styleUrl: './eleccion.component.scss',
})
export class EleccionComponent {
  constructor(public router: Router, private autoService: AutoService) {}

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer: ArrayBuffer = e.target.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = Array.from(data, (byte) => String.fromCharCode(byte)).join(
        ''
      );
      const workbook: XLSX.WorkBook = XLSX.read(arr, { type: 'binary' });
      const firstSheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Procesar los datos y guardarlos en el servicio
      const autos = this.processData(jsonData);
      this.autoService.setAutos(autos); // Guardar los autos en el servicio

      // Navegar al componente de búsqueda
      this.router.navigate(['/busqueda-manual']);
    };
    reader.readAsArrayBuffer(target.files[0]);
  }

  processData(data: any[]): { marca: string; modelo: string; anio: string }[] {
    return data.slice(1).map((row: any) => ({
      marca: row[0] || '',
      anio: row[1] || '',
      modelo: row[2] ? row[2].toString() : '',
      plan: row[3] ? row[3].toString() : '',
      franquicia: row[4] ? row[4].toString() : '',
      patente: row[5] ? row[5].toString() : '',
      motor: row[6] ? row[6].toString() : '',
      chasis: row[7] ? row[7].toString() : '',
    }));
  }

  downloadModel() {
    const link = document.createElement('a');
    link.href = 'Modelo.xlsx'; // Ruta relativa a la carpeta 'public'
    link.download = 'Modelo.xlsx';
    link.click();
  }
}
