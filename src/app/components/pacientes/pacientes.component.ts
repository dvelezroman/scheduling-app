
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import  Swal from 'sweetalert2';

import { PacienteModel } from '../models/paciente.model';
import { PacienteService } from '../../service/paciente.service';
import { TwilioService } from '../../service/twilio.service';
import { UsuarioServicesService } from '../../service/usuario.services.service';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  
  pacientes: PacienteModel[] = [];
  pacientesFiltrados: PacienteModel[] = [];

  to: string;
  turno: string;
  usuarioLogin:string;
  idUsuarioActual:string;

  loading:boolean = false;
  auth:boolean = true;
  senal:boolean =true;
  editar: boolean = false;
  puedeEditar:boolean;


constructor(private servicio : PacienteService,
            private usuarioService : UsuarioServicesService,
            private datePipe : DatePipe,
            private twilio : TwilioService
 ){}

 ngOnInit(): void {

      this.usuarioLogin = localStorage.getItem('userName');
      this.idUsuarioActual = localStorage.getItem('userUid');
      
      this.loading = true;

      this.usuarioService.editar$.subscribe(valor => this.editar = valor);
      this.usuarioService.registrador$.subscribe(valor => this.puedeEditar = (valor === this.usuarioLogin));

      this.servicio.cargarPacientes().subscribe( (pacientes:PacienteModel[]) => {
          this.pacientes = pacientes;
          this.pacientesFiltrados = pacientes;
          this.pacientesFiltrados = this.pacientes.filter(paciente => paciente.registrador === this.usuarioLogin);
      
          this.senal = this.pacientesFiltrados.length === 0;
          

          this.loading = false;
   
  }); 
  

}

mostrarPacientesUser():void{
  const pacientesCurrentUser = this.pacientes;
  this.pacientesFiltrados = pacientesCurrentUser.filter(paciente =>{
    paciente.registrador === this.usuarioLogin;


  });
}

usuarioPuedeEditar(paciente: PacienteModel):boolean{

  return paciente.usuarioUid === this.idUsuarioActual ;
  
}

borrar(id:number, paciente:PacienteModel){

   Swal.fire({
    title: 'Estas Seguro?',
    text: `Eliminar a ${paciente.nombres}`,
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true,

   }).then( data =>{
    if(data.value){

      this.pacientesFiltrados.splice(id,1);
      this.servicio.deletePaciente(paciente.id).subscribe();
      if(this.pacientesFiltrados.length === 0){
        this.senal = true;
      }
    };
   });
  }

sendMessage(telefono:string, turno:string, paciente:PacienteModel) {
  this.to = `+593${telefono}`;
  const turnoFormat = this.datePipe.transform(turno, 'EEEE, MMMM d, y', 'default', 'es');
  this.turno = `Esto es un recordatorio de que su cita fue agendada para el día ${turnoFormat}`;

  Swal.fire({
    title: '¿Enviar Mensaje?',
    text: `¿Enviar mensaje a ${paciente.nombres}?`,
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true
  
  }).then(resp =>{
      if(resp.value){
        this.twilio.sendNotification(this.to, this.turno).subscribe(resp => {
          console.log(resp)
          if(resp.success == true){
            Swal.fire({
              title: 'Mensaje Enviado!!',
              text: `Enviado la notificación a ${paciente.nombres}`,
              icon: 'success',
              timer: 2500,
              showCancelButton: false,
              showConfirmButton: false,
          
             });
        
          }
        },
        error => {
          console.error('Error al enviar notificación:', error);
          Swal.fire({
            title: 'Error al enviar',
            text: 'servidor no conectado',
            icon: 'error',
            timer: 1800,
            showCancelButton: false,
            showConfirmButton: false,
          });
        })
      }
  })
  

}


}
