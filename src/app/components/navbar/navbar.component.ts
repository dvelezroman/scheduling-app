
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuarioServicesService } from '../../service/usuario.services.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

valorAutenticado: boolean = false;

  constructor(public userService:UsuarioServicesService){

  }
ngOnInit() {
const autenticado = this.userService.autenticado();
this.valorAutenticado = autenticado;
}
  
  
}











