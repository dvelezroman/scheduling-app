import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { PacienteComponent } from './components/paciente/paciente.component';
import { DetalleComponent } from './components/paciente/detalle/detalle.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AgendarTurnoComponent } from './components/paciente/agendar-turno/agendar-turno.component';
import { AuthGuard } from './guards/authentic.guard';
import { InicioNoAuthComponent } from './components/home/inicio-no-auth/inicio-no-auth.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'inicio', component: InicioNoAuthComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard]},
  { path: 'pacientes/:id', component: PacienteComponent, canActivate: [AuthGuard]},
  { path: 'pacientes/:paciente/:id', component: DetalleComponent, canActivate: [AuthGuard]},
  { path: 'pacientes/:paciente/:id/:pacienteId', component: AgendarTurnoComponent, canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
