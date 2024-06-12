import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PacienteModel } from '../models/paciente.model';
import { PacienteService } from '../../service/paciente.service';
import { UsuarioServicesService } from '../../service/usuario.services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


pacientesFiltrados:PacienteModel[] = [];
pacientes:PacienteModel[] = [];
usuarioLogin:string;
numeroPacientes:number;

auth:boolean = true;
@Output() valorB = new EventEmitter<boolean>();
constructor(private servicio : PacienteService,
            private usuarioService : UsuarioServicesService
){

}
ngOnInit(): void {
  this.usuarioLogin = localStorage.getItem('userName');


  this.servicio.cargarPacientes().subscribe( (pacientes:PacienteModel[]) => {
    this.pacientes = pacientes;
    this.pacientesFiltrados = pacientes;
    this.pacientesFiltrados = this.pacientes.filter(paciente => paciente.registrador === this.usuarioLogin);
    //console.log(this.pacientesFiltrados)
    this.numeroPacientes = this.pacientesFiltrados.length
  });

}
}

