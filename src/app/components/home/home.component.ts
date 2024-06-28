import { Component, EventEmitter, NgZone, OnInit, Output, Renderer2 } from '@angular/core';
import { PacienteModel } from '../models/paciente.model';
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

    }
  });
  //this.servicio.totalDiagnosticos$.subscribe(total => {
    //this.totalDiagnosticos = total;
    //console.log(this.totalDiagnosticos)
  //});
}
contarPacientesConTurnoHoy() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  //console.log('Fecha de hoy:', todayStr);

  this.pacientesConTurnoHoy = this.pacientesFiltrados.filter(paciente => {
    if (paciente.turno) {
      const turnoDate = new Date(paciente.turno);
      const turnoDateStr = turnoDate.toISOString().split('T')[0];
      //console.log(`Turno del paciente ${paciente.nombres}:`, turnoDateStr);
      return turnoDateStr === todayStr;
    }
    return false;
  }).length;
  //console.log('Pacientes con turno hoy:', this.pacientesConTurnoHoy);

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


     //METODO PARA CANCELAR O CAMBIAR CITAS DEL PACIENTE//
     
     solicitarCambioOTurno(): void {
      Swal.fire({
        title: 'Solicitud',
        text: '¿Qué deseas solicitar?',
        icon: 'question',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Solicitar Cambio de Turno',
        denyButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.solicitarCambio();
        } else {
         return;
        }
      });
    }

  
    solicitarCambio(): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas solicitar el cambio de tu turno?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, solicitar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicio.solicitarCambio(this.cedulaPaciente).subscribe(response => {
            Swal.fire('Solicitud Enviada', 'Tu solicitud de cambio ha sido enviada.', 'success');
          }, error => {
            Swal.fire('Error', 'Ocurrió un error al enviar tu solicitud. Inténtalo nuevamente.', 'error');
          });
        }
      });
    }

}
