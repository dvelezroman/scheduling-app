import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { PacienteComponent } from './components/paciente/paciente.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { DetalleComponent } from './components/paciente/detalle/detalle.component';
import { LoadingComponent } from './components/loading/loading.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { AgendarTurnoComponent } from './components/paciente/agendar-turno/agendar-turno.component';
import { DatePipe} from '@angular/common';
import { InicioNoAuthComponent } from './components/home/inicio-no-auth/inicio-no-auth.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './components/search/search.component';
import { ScrollRevealDirective } from './directiva/scroll-reveal.directive';
import { RecuperaPasswordComponent } from './components/recupera-password/recupera-password.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { CedulaEcuatorianaValidatorDirective } from './components/paciente/cedula-ecuador-validador';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { RoleTransformPipe } from './pipes/role-transform.pipe';
import { environment } from '../../environments/environment';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { MedicosDatosComponent } from './components/usuario/medicos-datos/medicos-datos.component';





@NgModule({
  declarations: [
    
    AppComponent,
    NavbarComponent,
    PacientesComponent,
    PacienteComponent,
    HomeComponent,
    DetalleComponent,
    LoadingComponent,
    RegistroComponent,
    LoginComponent,
    AgendarTurnoComponent,
    InicioNoAuthComponent,
    SearchComponent,
    ScrollRevealDirective,
    RecuperaPasswordComponent,
    CedulaEcuatorianaValidatorDirective,
    UsuarioComponent,
    PerfilComponent,
    RoleTransformPipe,
    NotAuthorizedComponent,
    MedicosDatosComponent,

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,


  ],
  providers: [
    provideClientHydration(),
    DatePipe,
    provideAnimationsAsync(),
    provideHttpClient(withFetch())


  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
