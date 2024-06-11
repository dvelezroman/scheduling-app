
import { Component, OnInit } from '@angular/core';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import { UsuarioModel } from '../models/usuario.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

valorAutenticado: boolean = false;
isLoggedIn: boolean = false;
userName: string = '';
userNombre: string = '';
usuario: UsuarioModel;
showDateFilter: boolean = false;

  constructor(public userService:UsuarioServicesService,
              private ruta :Router
  ){

  }
ngOnInit() {
const autenticado = this.userService.autenticado();
this.valorAutenticado = autenticado;

this.userService.isLoggedIn.subscribe(resp =>{
  this.isLoggedIn = resp;
});

this.userService.usuarioActual.subscribe(resp =>{
  this.userName = resp;

  this.userName = localStorage.getItem('userName');

})
this.userService.nombreActual.subscribe(resp =>{
  this.userNombre = resp;
  this.userNombre = localStorage.getItem('nombres');
})

}
  
cerrarSesion() {
  Swal.fire({
    title: '¿Estás seguro?',

    icon: 'warning',
    showCancelButton: true,


    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.userService.cerrarCesion();

        this.ruta.navigate(['/inicio']);

    }
  });
}

toggleDateFilter(){
  this.showDateFilter = !this.showDateFilter;
 }


}











