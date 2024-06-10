
import { Component, OnInit } from '@angular/core';
import { Diagnostico, PacienteModel } from '../../models/paciente.model';
import { PacienteService } from '../../../service/paciente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


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

diagnosticoEnProceso: boolean = false;

diagnosticoSeleccionado: { fecha: Date, texto: string } | null = null;
diagnosticoSeleccionadoIndex: number | null = -1;

constructor(private servicio : PacienteService,
            private parametro : ActivatedRoute){

}
seleccionarElemento(elemento:any){
  this.seleccionado = elemento;
}
ngOnInit(): void {
  

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

agregarDiagnostico(): void {
  this.diagnosticoEnProceso = true;
  this.diagnosticoSeleccionado = null;
}

cancelarDiagnostico(): void {
  this.nuevoDiagnostico = { fecha: new Date(), texto: '' };
  this.diagnosticoEnProceso = false;
}

guardarDiagnostico(): void {
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
    this.servicio.deletePaciente(this.paciente).subscribe();
    this.servicio.refreshPaciente(this.paciente).subscribe();
    this.diagnosticoSeleccionado = null;
    this.diagnosticoSeleccionadoIndex = -1;

    };
   });
  

}
mostrarDiagnosticoCompleto(): void {
  if (this.diagnosticoSeleccionadoIndex !== null) {
    this.diagnosticoSeleccionado = this.paciente.diagnostico[this.diagnosticoSeleccionadoIndex];
  }
}


}
