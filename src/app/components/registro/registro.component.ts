import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { UsuarioModel } from '../models/usuario.model';
import { UsuarioServicesService } from '../../service/usuario.services.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioModel;
  passwordStrength: string;
  rol:string;

  mostrar:boolean = false;
  
  constructor(  private auth : UsuarioServicesService,
                private ruta : Router,
                private route: ActivatedRoute ){}

ngOnInit(): void {
    this.usuario = new UsuarioModel();
    this.usuario.email = '';
    this.usuario.nombres = '';
    this.usuario.password = "";

    this.route.queryParams.subscribe(params => {
      this.usuario.rol = params['rol'] || 'paciente';
    });
    //console.log(this.usuario)
}

registrar(form:NgForm){
  if(form.invalid){
    
    Object.values(form.controls).forEach( control => control.markAllAsTouched() );
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Error!',
        text: 'Formulario con errores'
      })
      return; 
  }
  this.auth.registrar(this.usuario).subscribe( data =>{

      Swal.fire({
        icon: 'success',
        title: 'Registro Exitoso',
        text: `Bienvenido ${ this.usuario.nombres}`,
        timer: 1800
      });
            this.ruta.navigate(['/home']);
            localStorage.setItem ('nombres', this.usuario.nombres);
            console.log(this.usuario)
  },(err)=>{
    const errorMessage = err?.error?.error?.message || 'Error desconocido';
    Swal.fire({
                  
      icon: 'error',
      title: 'Error al autenticar',
      text: errorMessage
    })

  });


 }

toggleMostrar(){
  this.mostrar = !this.mostrar;
 }
 




}



