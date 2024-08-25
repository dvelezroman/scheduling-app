
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import  Swal from 'sweetalert2';

import { PacienteModel } from '../models/paciente.model';
import { PacienteService } from '../../service/paciente.service';
import { TwilioService } from '../../service/twilio.service';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';


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
  hayPacientes: boolean = false;
  
  imagenesPacientes: { [key: string]: string } = {};

constructor(private servicio : PacienteService,
            private usuarioService : UsuarioServicesService,
            private datePipe : DatePipe,
            private twilio : TwilioService,
            private pd : DatePipe,
            private fb : FormBuilder,
            private afAuth: AngularFireAuth

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
      const mm = String(today.getMonth() + 1).padStart(2, '0');
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
          this.hayPacientes = this.pacientesFiltrados.length > 0;
          this.loading = false;

          this.cargarPacientes();
          this.cargarPacientesConImagen();
   
  }); 
}


cargarPacientes(): void {
  this.servicio.cargarPacientes().subscribe((pacientes: PacienteModel[]) => {
    this.pacientes = pacientes;
    this.pacientesFiltrados = pacientes.filter(paciente => paciente.registrador === this.usuarioLogin);
    this.eliminarFechasPasadas();
    this.senal = this.pacientesFiltrados.length === 0;
    this.hayPacientes = this.pacientesFiltrados.length > 0;
    this.loading = false;
  });
}

cargarPacientesConImagen(): void {
  this.servicio.cargarPacientes2().subscribe((pacientes: PacienteModel[]) => {
    this.imagenesPacientes = {}; 
    pacientes.forEach(paciente => {
      this.imagenesPacientes[paciente.cedula] = paciente.fotoUrl;
    });
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

//BORRAR PARA ELIMINAR PACIENTE SIN SOLICITAR CLAVE DE USUARIO//
  borrar(id:number, paciente:PacienteModel){

   Swal.fire({
    title: 'Estas Seguro?',
    text: `Eliminar a ${paciente.nombres}`,
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true,

   }).then( data =>{
    if(data.value){
      console.log('ID del paciente a eliminar:', paciente.id);
      this.pacientesFiltrados.splice(id,1);
      this.servicio.deletePaciente(paciente.id).subscribe(() => {
        this.cargarPacientes();
        Swal.fire({
          title: 'Eliminado',
          text: `${paciente.nombres} ha sido eliminado`,
          icon: 'success',
          timer: 1600,
          showConfirmButton: false
        });
      });
    }
  });
}

//METODO PARA BORRAR PACIENTE SOLICITANDO CLAVE DE USUARIO//
borrar2(id: number, paciente: PacienteModel) {
  Swal.fire({
    title: 'Introduce tu contraseña',
    input: 'password',
    inputLabel: 'Contraseña',
    inputPlaceholder: 'Introduce tu contraseña',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed && result.value) {
      const enteredPassword = result.value;

      if (enteredPassword === this.usuarioService['userPassword']) {
        
        Swal.fire({
          title: '¿Estás seguro?',
          text: `Eliminar a ${paciente.nombres}`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then(confirmResult => {
          if (confirmResult.isConfirmed) {
            console.log('ID del paciente a eliminar:', paciente.id);
            this.pacientesFiltrados.splice(id, 1);
            this.servicio.deletePaciente(paciente.id).subscribe(() => {
              this.cargarPacientes();
              Swal.fire({
                title: 'Eliminado',
                text: `${paciente.nombres} ha sido eliminado`,
                icon: 'success',
                timer: 1600,
                showConfirmButton: false
              });
            });
          }
        });
      } else {
        
        Swal.fire({
          title: 'Error',
          text: 'Contraseña incorrecta. Inténtalo de nuevo.',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  });
}

  

  sendMessage(telefono: string, turno: string, paciente: PacienteModel) {
    this.to = `+593${telefono}`;
    let defaultMessage = `Hola ${paciente.nombres}, `;
    
    if (turno) {
        const turnoDate = new Date(turno);
        const turnoFormat = this.datePipe.transform(turno, 'EEEE, d', 'default', 'es');
        const mesAnoFormat = this.datePipe.transform(turnoDate, 'MMMM', 'default', 'es');
        const anoFormat = this.datePipe.transform(turnoDate, 'y', 'default', 'es');
        const horaFormat = this.datePipe.transform(turno, 'shortTime', 'default', 'es');
        const horas = turnoDate.getHours();
        const periodo = horas < 12 ? 'de la mañana' : 'de la tarde';
          defaultMessage += `se le recuerda que su turno está pronosticado para el día ${turnoFormat} de ${mesAnoFormat} del ${anoFormat} a las ${horaFormat} ${periodo}.`;
    } else {
        defaultMessage += 'aún no tiene un turno asignado.';
    }
    
    Swal.fire({
        title: 'Enviar Mensaje',
        text: `¿Enviar mensaje a ${paciente.nombres}?`,
        input: 'textarea',
        inputLabel: 'Escriba su mensaje',
        inputValue: defaultMessage,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: (message) => {
            if (!message) {
                Swal.showValidationMessage('El mensaje no puede estar vacío');
            }
            return message;
        }
    }).then(result => {
        if (result.isConfirmed && result.value) {
            const mensaje = result.value;
            this.twilio.sendNotification(this.to, mensaje).subscribe(resp => {
                if (resp.success === true) {
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
                    text: 'Servidor no conectado',
                    icon: 'error',
                    timer: 1800,
                    showCancelButton: false,
                    showConfirmButton: false,
                });
            });
        }
    });
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
