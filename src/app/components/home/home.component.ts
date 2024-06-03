import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PacienteModel } from '../models/paciente.model';
import { PacienteService } from '../../service/paciente.service';
import { UsuarioServicesService } from '../../service/usuario.services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
hoy: Date = new Date();
cita: Date = new Date();
paciente:PacienteModel[] = [];
numeroPacientes:number;
numeroTurnos:string;
auth:boolean = true;
@Output() valorB = new EventEmitter<boolean>();
constructor(private servicio : PacienteService,
            private usuarioService : UsuarioServicesService
){

}
ngOnInit(): void {
  this.servicio.cargarPacientes().subscribe( data => {
    //console.log(data);
    this.paciente = data;
    //console.log(this.paciente.length);
    this.numeroPacientes = this.paciente.length;
    //console.log(localStorage['userUid']);

})

}
cerrarSesion(){
  
 return this.usuarioService.cerrarCesion()

}
}
