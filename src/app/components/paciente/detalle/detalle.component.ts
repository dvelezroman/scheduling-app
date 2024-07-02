
import { Component, OnInit } from '@angular/core';
import { Diagnostico, PacienteModel } from '../../models/paciente.model';
import { PacienteService } from '../../../service/paciente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioServicesService } from '../../../service/usuario.services.service';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent implements OnInit {
paciente:any = {};
seleccionado:{};
nuevoDiagnostico: Diagnostico = { fecha: new Date(), texto: '' };
pacientes:any[]= [];
elementos: Diagnostico[];
usaurioRegistroPaciente:string;
usuarioActual: UsuarioModel;
diagnosticoEnProceso: boolean = false;

diagnosticoSeleccionado: { fecha: Date, texto: string } | null = null;
diagnosticoSeleccionadoIndex: number | null = -1;

constructor(private servicio : PacienteService,
            private parametro : ActivatedRoute,
            private usuarioServicio:UsuarioServicesService){

}
seleccionarElemento(elemento:any){
  this.seleccionado = elemento;
}
ngOnInit(): void {
  
  this.usuarioServicio.getUsuarioActual().subscribe(usuario => {
    this.usuarioActual = usuario;
    //console.log(usuario)
  });
  let id = this.parametro.snapshot.paramMap.get('id');
      if(id){

        this.servicio.getPaciente(id).subscribe((data:PacienteModel) =>{
          this.paciente = data;
          this.paciente.id = id;

          if (this.paciente.diagnostico && this.paciente.diagnostico.length > 0) {
            this.diagnosticoSeleccionadoIndex = -1;
            this.mostrarDiagnosticoCompleto();
          }
          //console.log(data)
          if (!this.paciente.diagnostico) {
            this.paciente.diagnostico = [];
            
            
          }
      });
      
      }

}
cancelarCita(paciente:PacienteModel) {

  Swal.fire({

    text: "¿Cancelar la cita?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'

  }).then((result) => {
    
    if (result.isConfirmed) {
      const turnoActual = paciente.turno;
      paciente.turno = null;

      if (paciente.turnoParaMostrar) {
        paciente.turnoParaMostrar = paciente.turnoParaMostrar.filter(t => t.fechaHora !== turnoActual);
      }
      
      this.servicio.refreshPaciente(paciente).subscribe();
       
      Swal.fire({
       title: 'Cancelado!',
       text: 'Tu cita ha sido cancelada.',
       icon: 'success',
       timer: 1500,
       showConfirmButton: false
     });
    } else {
      return;

    }

  });
}

agregarDiagnostico(): void {
  this.diagnosticoEnProceso = true;
  this.diagnosticoSeleccionado = null;
}

cancelarDiagnostico(): void {
  this.nuevoDiagnostico = { fecha: new Date(), texto: '' };
  this.diagnosticoEnProceso = false;
}

guardarDiagnostico1(): void {
  if (this.nuevoDiagnostico.texto.trim() == '') {
    Swal.fire({
  
      text: 'no hay información que se pueda guardar',
      icon: 'info',
      timer: 1800,
      showConfirmButton: false
      });
    
  }else{
    
    this.paciente.diagnostico.unshift({ ...this.nuevoDiagnostico });
    this.nuevoDiagnostico = { fecha: new Date(), texto: '' };
    this.diagnosticoEnProceso = false;
    this.actualizarPaciente();
    this.diagnosticoSeleccionadoIndex = -1;
    Swal.fire({
      title: 'Agregado',
      text: 'Diagnóstico agregado al paciente',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
      });
  }
}
guardarDiagnostico(): void {
  if (this.nuevoDiagnostico.texto.trim() === '') {
    Swal.fire({
      text: 'No hay información que se pueda guardar',
      icon: 'info',
      timer: 1800,
      showConfirmButton: false
    });
  } else {
    const nuevoDiagnosticoConCedula: Diagnostico = {
      ...this.nuevoDiagnostico,
      cedulaPaciente: this.paciente.cedula,
      realizadoPor: this.usuarioActual.nombres
    };
    this.paciente.diagnostico.unshift(nuevoDiagnosticoConCedula);
    this.nuevoDiagnostico = { fecha: new Date(), texto: '', cedulaPaciente: null, realizadoPor: '' };
    this.diagnosticoEnProceso = false;
    this.actualizarPaciente();
    this.diagnosticoSeleccionadoIndex = -1;
    Swal.fire({
      title: 'Agregado',
      text: 'Diagnóstico agregado al paciente',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }
}


actualizarPaciente(): void {
  this.servicio.refreshPaciente(this.paciente).subscribe();
}

eliminarDiagnostico(){
  Swal.fire({
    title: '¿Eliminar?',
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true,

   }).then( data =>{
    if(data.value){
    this.paciente.diagnostico.splice(this.diagnosticoSeleccionadoIndex,1);
    this.servicio.refreshPaciente(this.paciente).subscribe(() => {
      this.diagnosticoSeleccionado = null;
      this.diagnosticoSeleccionadoIndex = -1;
      Swal.fire({
        title: 'Eliminado',
        text: 'Diagnóstico eliminado',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    });
  }
});
}
mostrarDiagnosticoCompleto(): void {
  if (this.diagnosticoSeleccionadoIndex !== null) {
    this.diagnosticoSeleccionado = this.paciente.diagnostico[this.diagnosticoSeleccionadoIndex];
  }
}


}
