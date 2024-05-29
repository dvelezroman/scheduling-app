import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { PacienteComponent } from './components/paciente/paciente.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DetalleComponent } from './components/paciente/detalle/detalle.component';
import { LoadingComponent } from './components/loading/loading.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { AgendarTurnoComponent } from './components/paciente/agendar-turno/agendar-turno.component';
import { DatePipe } from '@angular/common';




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
    AgendarTurnoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule

   
  ],
  providers: [
    provideClientHydration(),
    DatePipe,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
