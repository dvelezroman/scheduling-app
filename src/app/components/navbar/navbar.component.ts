
import { Component, OnInit } from '@angular/core';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import { UsuarioModel } from '../models/usuario.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { isLocalStorageAvailable } from '../../localStorageUtils';



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
nombresUsuario:string;
userRol: string = '';
showDateFilter: boolean = false;
isDropdownOpen: boolean = false;

  constructor(public userService:UsuarioServicesService,
              private ruta :Router
  ){

  }

  
ngOnInit() {

  this.userService.getUsuarioActual2().subscribe((usuario: UsuarioModel | null) => {
    if (usuario) {
      this.nombresUsuario = usuario.nombres;
      this.isLoggedIn = true;
      this.userRol = usuario.rol;
    } else {
      this.nombresUsuario = '';
      this.userRol = '';
      this.isLoggedIn = false;
    }
  }, error => {
    console.error('Error al obtener el usuario:', error);
  });

  
const autenticado = this.userService.autenticado();
this.valorAutenticado = autenticado;

this.userService.isLoggedIn.subscribe(resp =>{
  this.isLoggedIn = resp;
});

if (isLocalStorageAvailable()) {
  this.userService.usuarioActual.subscribe(resp => {
    this.userName = resp;
    this.userName = localStorage.getItem('userName');
  });
  this.userService.nombreActual.subscribe(resp => {
    this.userNombre = resp;
    this.userNombre = localStorage.getItem('nombres');
  });
}

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
 registrar(rol: string) {
  this.ruta.navigate(['/registro'], { queryParams: { rol } });
}
toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

}











