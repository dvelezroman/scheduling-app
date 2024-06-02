import { Component, OnInit } from '@angular/core';
import { PacienteModel } from '../../models/paciente.model';
import { PacienteService } from '../../../service/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioServicesService } from '../../../service/usuario.services.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent implements OnInit {
paciente:any = {};
usaurioRegistroPaciente:string;
constructor(private servicio : PacienteService,
            private UsuarioServicio : UsuarioServicesService,
            private parametro : ActivatedRoute){

}

ngOnInit(): void {
  let id = this.parametro.snapshot.paramMap.get('id');

      this.servicio.getPaciente(id).subscribe((data:PacienteModel) =>{
        this.paciente = data;
        this.paciente.id = id;
        console.log(data)
    });


  
}
}
