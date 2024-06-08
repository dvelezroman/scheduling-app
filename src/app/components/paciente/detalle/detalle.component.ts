
import { Component, OnInit } from '@angular/core';
import { Diagnostico, PacienteModel } from '../../models/paciente.model';
import { PacienteService } from '../../../service/paciente.service';
import { ActivatedRoute } from '@angular/router';


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
acordeonOpen: boolean[] = [];

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
          this.acordeonOpen = (this.paciente.diagnostico ?? []).map(() => false);
          //console.log(data)
          if (!this.paciente.diagnostico) {
            this.paciente.diagnostico = [];
            
          }
      });
      }

}

agregarDiagnostico(): void {
  this.diagnosticoEnProceso = true;
}

guardarDiagnostico(): void {
  if (this.nuevoDiagnostico.texto.trim() !== '') {
    this.paciente.diagnostico.unshift({ ...this.nuevoDiagnostico });
    this.nuevoDiagnostico = { fecha: new Date(), texto: '' };
    this.diagnosticoEnProceso = false;
    this.actualizarPaciente();
  }
}

actualizarPaciente(): void {
  this.servicio.refreshPaciente(this.paciente).subscribe(paciente => {
    console.log(paciente);
  });
}
eliminar(index:number){
this.paciente.diagnostico.splice(index,1);
this.servicio.deletePaciente(this.paciente).subscribe();
this.servicio.refreshPaciente(this.paciente).subscribe(data=>{
  console.log(data)
})

}
toggleAccordion(index: number): void {
  this.acordeonOpen[index] = !this.acordeonOpen[index];
}
}
