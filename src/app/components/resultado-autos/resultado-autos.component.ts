import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-resultado-autos',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './resultado-autos.component.html',
  styleUrl: './resultado-autos.component.scss',
})
export class ResultadoAutosComponent {
  @Input() resultados: any[] = [];
  @Output() exportarResultados = new EventEmitter<void>();
  @Output() reintentarErrores = new EventEmitter<void>();
  @Output() resultadosActualizados = new EventEmitter<any[]>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resultados']) {
      this.acoplarResultadosConLocalStorage();
    }
  }

  displayedColumns: string[] = [
    'item',
    'cd_MARCA',
    'anio',
    'cd_MODELO',
    'cd_TIPODEVEHICULO',
    'dr_TIPODEVEHICULO',
    'plan',
    'franquicia',
    'patente',
    'motor',
    'chasis',
    'error',
  ];

  exportar() {
    this.exportarResultados.emit();
  }

  reintentar() {
    this.reintentarErrores.emit();
  }

  hayErrores(): boolean {
    return this.resultados.some((resultado) => resultado.error);
  }

  private recuperarResultadosDeLocalStorage() {
    const resultadosGuardados = localStorage.getItem('resultados');
    if (resultadosGuardados) {
      const resultadosParseados = JSON.parse(resultadosGuardados);
      return resultadosParseados;
    }
  }

  // Método para acoplar resultados y emitir los resultados actualizados
  private acoplarResultadosConLocalStorage() {
    const resultadosGuardados = this.recuperarResultadosDeLocalStorage();
    console.log('Resultados guardados:', resultadosGuardados);
    console.log('Resultados actuales:', this.resultados);

    if (resultadosGuardados) {
      const resultadosMapeados = this.resultados.map((resultado) => {
        const resultadoGuardado = resultadosGuardados.find(
          (r: { patente: string }) => r.patente === resultado.patente
        );
        console.log('Resultado actual:', resultado);
        console.log('Resultado guardado:', resultadoGuardado);
        return resultadoGuardado
          ? { ...resultadoGuardado, ...resultado }
          : resultado;
      });

      // Añadir los resultados guardados que no están en los resultados actuales
      const resultadosNoMapeados = resultadosGuardados.filter(
        (resultadoGuardado: { patente: string }) =>
          !this.resultados.some(
            (resultado: { patente: string }) =>
              resultado.patente === resultadoGuardado.patente
          )
      );

      this.resultados = [...resultadosMapeados, ...resultadosNoMapeados];
      console.log('Resultados después de acoplar:', this.resultados);
      this.resultadosActualizados.emit(this.resultados);
    }

    localStorage.removeItem('resultados');
  }
}
