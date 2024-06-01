import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import  Swal from 'sweetalert2';

import { PacienteModel } from '../models/paciente.model';
import { PacienteService } from '../../service/paciente.service';
import { TwilioService } from '../../service/twilio.service';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
loading:boolean = false;
auth:boolean = true;
senal:boolean =true;
to: string;
turno: string;
pacientes: PacienteModel[] = [];
constructor(private servicio : PacienteService,
            private datePipe : DatePipe,
            private twilio : TwilioService
 ){}

 ngOnInit(): void {
  this.loading = true;
  this.servicio.cargarPacientes().subscribe( data => {
    //console.log(data);
    if(data.length === 0){
      this.loading = false;
      this.senal = true;
    }else{
      this.pacientes = data;
      this.senal = false;
      this.loading = false;
    }
  })
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

      this.pacientes.splice(id,1);
      this.servicio.deletePaciente(paciente.id).subscribe();
      if(this.pacientes.length === 0){
        this.senal = true;
      }
    };
   });

}
cerrarSesion(){
  localStorage.removeItem('token');
  if(this.auth){
    this.auth = true;
  }else{
    this.auth = false
  }


}
sendMessage(telefono:string, turno:string, paciente:PacienteModel) {
  this.to = `+593${telefono}`;
  const turnoFormat = this.datePipe.transform(turno, 'EEEE, MMMM d, y', 'default', 'es');
  this.turno = `Esto es un recordatorio de que su cita fue agendada para el día ${turnoFormat}`;
  
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
  
     })

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


}
