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
import { RecuperaPasswordComponent } from './components/recupera-password/recupera-password.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { GuardUsuario } from './guards/usuario.guard';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { GuardRegistro } from './guards/registro.guard';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { MedicosDatosComponent } from './components/usuario/medicos-datos/medicos-datos.component';
import { PacientesTurnoDiaComponent } from './components/pacientes/pacientes-turno-dia/pacientes-turno-dia.component';
import { PacientesDiagnosticosComponent } from './components/pacientes/pacientes-diagnosticos/pacientes-diagnosticos.component';
import { MisDiagnosticosComponent } from './components/paciente/mis-diagnosticos/mis-diagnosticos.component';
import { PacienteCitasComponent } from './components/paciente/paciente-citas/paciente-citas.component';




const routes: Routes = [
  
  { path: 'inicio', component: InicioNoAuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperaPassword', component: RecuperaPasswordComponent },
  { path: 'registro', component: RegistroComponent, canActivate: [GuardRegistro] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'datos-usuario', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'configuracion-usuario', component: UsuarioComponent,canActivate: [AuthGuard] },
  { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard, GuardUsuario] },
  { path: 'pacientes/:id', component: PacienteComponent, canActivate: [AuthGuard, GuardUsuario] },
  { path: 'pacientes/:paciente/:id', component: DetalleComponent, canActivate: [AuthGuard, GuardUsuario] },
  { path: 'pacientes/:paciente/:id/:pacienteId', component: AgendarTurnoComponent, canActivate: [AuthGuard, GuardUsuario] },
  { path: 'notAuthorized', component: NotAuthorizedComponent },
  { path: 'medicos-datos', component: MedicosDatosComponent },
  { path: 'pacientes-dia', component: PacientesTurnoDiaComponent, canActivate: [AuthGuard] },
  { path: 'pacientes-diagnosticos', component: PacientesDiagnosticosComponent, canActivate: [AuthGuard]},
  { path: 'mis-diagnosticos', component: MisDiagnosticosComponent, canActivate: [AuthGuard]},
  { path: 'paciente-citas', component: PacienteCitasComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
