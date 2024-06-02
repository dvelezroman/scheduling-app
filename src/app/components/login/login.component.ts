import { Component, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { UsuarioModel } from '../models/usuario.model';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PacienteModel } from '../models/paciente.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
mostrar:boolean = false;
usuario:UsuarioModel = new UsuarioModel();
saveUser:boolean = false;

  constructor(private auth : UsuarioServicesService,
              private ruta : Router){

}

  ngOnInit(): void {
    if(localStorage.getItem('name')){
      this.usuario.email = localStorage.getItem('name');

        //this.saveUser = true;
    }
   // console.log(this.saveUser);
  } 
  

  ingresar(form:NgForm){
     if(form.invalid){
      Object.values(form.controls).forEach(control => control.markAllAsTouched())
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'error',
        text: 'Hay errores en el formulario',
        showConfirmButton: false,
        timer: 2000

      });  
       return;
      }
      this.auth.login(this.usuario).subscribe(data =>{
        console.log(data);


        Swal.close()
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Exito',
          timer: 1500,
          showConfirmButton: false
  
        });  
        this.ruta.navigateByUrl('/home');
        
        if(this.saveUser){
          localStorage.setItem('name', this.usuario.email)
        }
      },(err)=>{
        Swal.fire({
          
          icon: 'error',
          title: 'Error al autenticar',
          showConfirmButton: false,
          timer: 2000,
          text: err.error.error.message,
          allowOutsideClick: false,
        });
        this.ruta.navigateByUrl('/login');
       // console.log(err.error.error.message);
      });

  }
  toggleMostrar(){

    this.mostrar = !this.mostrar;

  }

  }

