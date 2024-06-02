import { Component, OnInit } from '@angular/core';
import { PacienteModel } from '../models/paciente.model';
import { NgForm } from '@angular/forms';
import { PacienteService } from '../../service/paciente.service';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { UsuarioServicesService } from '../../service/usuario.services.service';


@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent implements OnInit{
paciente:PacienteModel = new PacienteModel();
auth:boolean = true;
nombres:string; 
cedula:number; 
correo:string; 
telefono:number; 
direccion:string;
emailRegistrador:string;
usuarioId:string;
disabled:boolean = true;
constructor(private servicio : PacienteService,
            private usuarioServicio: UsuarioServicesService, 
            private parametro : ActivatedRoute,
            private ruta: Router){
              this.nombres = this.paciente.nombres;
              this.cedula = this.paciente.cedula;
              this.correo = this.paciente.correo;
              this.telefono = this.paciente.telefono;
              this.direccion = this.paciente.direccion;
             
            }

ngOnInit(): void {
    let id = this.parametro.snapshot.paramMap.get('id');
    if(id !== "nuevo"){
        this.servicio.getPaciente(id).subscribe((data:PacienteModel) =>{
          this.paciente = data;
          this.paciente.id = id;
      });
    }
    this.usuarioServicio.usuarioActual.subscribe (email =>{
      this.emailRegistrador = email;
    });
    this.usuarioServicio.usuarioLocalId.subscribe (id =>{
      this.usuarioId = id;
    });
    
    if( this.paciente.usuarioUid !== this.usuarioId ){
       this.disabled = false;
     }else{
        this.disabled = true;
     }

}




guardar( form: NgForm ){
  if(form.invalid){
    Object.values(form.controls).forEach( control => control.markAllAsTouched() );

    Swal.fire({
      title: 'Error!!',  
      text: `no has completado el formulario`,
      icon: 'error',
      timer: 2500,
      showConfirmButton: false
      })
    return;
  }

   this.paciente.registrador = this.emailRegistrador;
   this.paciente.usuarioUid = this.usuarioId;

   if(this.paciente.id){
    
     this.servicio.refreshPaciente(this.paciente)
     .subscribe( () => {
    
      Swal.fire({
      title: 'Actualizado',  
      text: `Agregado los cambios de ${this.paciente.nombres}`,
      icon: 'success',
      timer: 2500,
      showConfirmButton: false
      })
      setTimeout(()=>{
        this.ruta.navigate(['pacientes']);
      },1500)
 });
  }else{
    
      this.servicio.crearPaciente(this.paciente)
      .subscribe( () => {
        
        Swal.fire({
        title: 'Guardado!!',  
        text: `${this.paciente.nombres} se ha agregado `,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
        })
        setTimeout(()=>{
          this.ruta.navigate(['pacientes']);
        },1500)
   });
  }
   

}

limpiar(form:NgForm){
  this.paciente.id.delete
  return form.reset();
}
cerrarSesion(){
  localStorage.removeItem('token');
  if(this.auth){
    this.auth = true;
  }else{
    this.auth = false
  }


}




}
