
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import  Swal from 'sweetalert2';

import { PacienteModel } from '../models/paciente.model';
import { PacienteService } from '../../service/paciente.service';
import { TwilioService } from '../../service/twilio.service';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  paciente:PacienteModel = new PacienteModel();
  pacientes: PacienteModel[] = [];
  pacientesFiltrados: PacienteModel[] = [];
  pacientesFiltradosPorFecha:PacienteModel[] = [];
  rangoFecha:FormGroup;
  to: string;
  turno: string;
  usuarioLogin:string;
  idUsuarioActual:string;
  fechaMinima:Date;
  fechaMaxima:Date;
  fechaMaximaString:string;
  fechaMinimaString:string;

  loading:boolean = false;
  auth:boolean = true;
  senal:boolean =true;
  editar: boolean = false;
  puedeEditar:boolean;
  mostrarLista: boolean = true;
  showDateFilter: boolean = false;
  mostrarBotonX:boolean = false;   

constructor(private servicio : PacienteService,
            private usuarioService : UsuarioServicesService,
            private datePipe : DatePipe,
            private twilio : TwilioService,
            private pd : DatePipe,
            private fb : FormBuilder
 ){
    this.rangoFecha = this.fb.group({
        inicio: new FormControl(null, Validators.required),
        fin: new FormControl(null, Validators.required)
 });
 
};
 
 ngOnInit(): void {
      //iniciar fecha desde por default
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
      const dd = String(today.getDate()).padStart(2, '0');
      const todayString = `${yyyy}-${mm}-${dd}`;

      this.rangoFecha = this.fb.group({
        inicio: [todayString],
        fin: ['']
      })

      this.fechaMinima = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
      this.fechaMinimaString = this.pd.transform(this.fechaMinima, "yyyy-MM-dd");
      this.fechaMaxima = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+35);
      this.fechaMaximaString = this.pd.transform(this.fechaMaxima,"yyyy-MM-dd");

      this.usuarioLogin = localStorage.getItem('userName');
      this.idUsuarioActual = localStorage.getItem('userUid');
      
      this.loading = true;

      this.usuarioService.editar$.subscribe(valor => this.editar = valor);
      this.usuarioService.registrador$.subscribe(valor => this.puedeEditar = (valor === this.usuarioLogin));

      this.servicio.cargarPacientes().subscribe( (pacientes:PacienteModel[]) => {
          this.pacientes = pacientes;
          this.pacientesFiltrados = pacientes;
          this.pacientesFiltrados = this.pacientes.filter(paciente => paciente.registrador === this.usuarioLogin);
          this.eliminarFechasPasadas();
          this.senal = this.pacientesFiltrados.length === 0;
          

          this.loading = false;
   
  }); 
}

toggleDateFilter(){
  this.showDateFilter = !this.showDateFilter;
  
 }

filtrarPorFecha(){
   const {inicio, fin} = this.rangoFecha.value;
    if(!inicio || !fin){
      Swal.fire({
        title: 'Error!!',  
        text: 'no has agregado fecha',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
        });
      }else{

        const startDate = new Date(inicio);
        const endDate = new Date(fin);
        this.mostrarBotonX = true
        this.pacientesFiltradosPorFecha = this.pacientesFiltrados.filter(paciente =>{
        const fechaTurno = new Date(paciente.turno);
        return fechaTurno >= startDate && fechaTurno <= endDate;

      });
      this.mostrarLista = false;
      if(this.pacientesFiltradosPorFecha.length === 0){
        Swal.fire({
          title: 'Sin Resultados',
          text: 'No hay pacientes para el rango de fechas seleccionado',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false
        });
          
      }
      }
}
cancelarBusqueda() {
  this.mostrarLista = true;
  this.rangoFecha.get('fin').reset();
  this.pacientesFiltradosPorFecha = [];
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

eliminarFechasPasadas():void{
    const hoy = new Date().setHours(0, 0, 0, 0);;
    this.pacientes.forEach( paciente =>{
    if(paciente.turno){
      const fechaTurno = new Date(paciente.turno).setHours(24, 0, 0, 0);
      if(fechaTurno < hoy){
        paciente.turno = null;

        this.servicio.refreshPaciente(paciente).subscribe();
      }
    }
}); 
}
}
