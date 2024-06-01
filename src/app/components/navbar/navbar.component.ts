
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import { UsuarioModel } from '../models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

valorAutenticado: boolean = false;
isLoggedIn: boolean = false;
userName: string = '';
usuario: UsuarioModel;

  constructor(public userService:UsuarioServicesService){

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





}
  
  
}











