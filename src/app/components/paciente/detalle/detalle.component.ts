import { Component, OnInit } from '@angular/core';
import { PacienteModel } from '../../models/paciente.model';
import { PacienteService } from '../../../service/paciente.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent implements OnInit {
paciente:any = {};
pacientes:any[]= [];
usaurioRegistroPaciente:string;
constructor(private servicio : PacienteService,
            private parametro : ActivatedRoute){

}

ngOnInit(): void {
  let id = this.parametro.snapshot.paramMap.get('id');
      if(id){

        this.servicio.getPaciente(id).subscribe((data:PacienteModel) =>{
          this.paciente = data;
          this.paciente.id = id;
          //console.log(data)
      });
      }


  
}
}
