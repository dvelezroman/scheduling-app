import { Component, EventEmitter, NgZone, OnInit, Output, Renderer2 } from '@angular/core';
import { Diagnostico, PacienteModel } from '../models/paciente.model';
import { PacienteService } from '../../service/paciente.service';
import { UsuarioModel } from '../models/usuario.model';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

usuario: UsuarioModel;
pacientesFiltrados:PacienteModel[] = [];
pacientes:PacienteModel[] = [];
usuarioLogin:string;
userRol: string = '';
cedulaPaciente: number;
pacientesConTurnoHoy: number = 0;
totalDiagnosticos: number = 0;
mostrarMensajeTurno: boolean = false;

auth:boolean = true;




constructor(private servicio : PacienteService,
            private ngZone: NgZone,
            private userService : UsuarioServicesService
){

}
ngOnInit(): void {


  this.usuarioLogin = localStorage.getItem('userName');


  this.servicio.cargarPacientes().subscribe( (pacientes:PacienteModel[]) => {
    this.pacientes = pacientes;
    this.pacientesFiltrados = pacientes;
    this.pacientesFiltrados = this.pacientes.filter(paciente => paciente.registrador === this.usuarioLogin);
    //console.log(this.pacientesFiltrados)

    this.contarPacientesConTurnoHoy();
  });
  this.userService.getUsuarioActual2().subscribe((usuario: UsuarioModel | null) => {
    if (usuario) {
      this.userRol = usuario.rol;
      this.cedulaPaciente = usuario.cedula;
       this.usuario = usuario;



    }
  });

}



contarPacientesConTurnoHoy() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  this.pacientesConTurnoHoy = this.pacientesFiltrados.filter(paciente => {
    if (paciente.turno) {
      const turnoDate = new Date(paciente.turno);
      const turnoDateStr = turnoDate.toISOString().split('T')[0];
      return turnoDateStr === todayStr;
    }
    return false;
  }).length;

  if (this.pacientesConTurnoHoy > 0) {
    this.mostrarMensajeTurno = true;
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.mostrarMensajeTurno = false;
        });
      }, 5000);
    });
  }
}

     


}
