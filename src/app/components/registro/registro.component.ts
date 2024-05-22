import { Component, OnInit } from '@angular/core';


import { UsuarioModel } from '../models/usuario.model';
import { NgForm } from '@angular/forms';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import { ValidadoresService } from '../../service/validadores.service';

//import { AuthService } from '../../service/autenticacion';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioModel;
  mostrar:boolean = false;
  

  
  constructor(private auth : UsuarioServicesService,
              private ruta : Router){}

ngOnInit(): void {
    this.usuario = new UsuarioModel();
    this.usuario.email = 'greverom_@gmail.com';
    this.usuario.nombres = 'Gregorio Velez';
    this.usuario.password = "123456";

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
  console.log(data);
  Swal.close();
        this.ruta.navigate(['/home']);
        
  },(err)=>{
    Swal.fire({
                  
      icon: 'error',
      title: 'Error al autenticar',
      text: err.error.error.message
    })
    console.log(err.error.error.message);
  });



 }

toggleMostrar(){
  this.mostrar = !this.mostrar;
 }

}



