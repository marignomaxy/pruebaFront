import { Routes } from '@angular/router';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { EleccionComponent } from './pages/eleccion/eleccion.component';

export const routes: Routes = [
  { path: 'busqueda-manual', component: BuscadorComponent },
  { path: '', component: EleccionComponent },
];
