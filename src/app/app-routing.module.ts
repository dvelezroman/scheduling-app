import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { PacienteComponent } from './components/paciente/paciente.component';
import { DetalleComponent } from './components/paciente/detalle/detalle.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AgendarTurnoComponent } from './components/paciente/agendar-turno/agendar-turno.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'pacientes', component: PacientesComponent},
  { path: 'pacientes/:id', component: PacienteComponent},
  { path: 'pacientes/:paciente/:id', component: DetalleComponent},
  { path: 'pacientes/:paciente/:id/:pacienteId', component: AgendarTurnoComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'registro'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
