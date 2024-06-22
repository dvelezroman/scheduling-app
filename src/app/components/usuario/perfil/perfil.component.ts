import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioServicesService } from '../../../service/usuario.services.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
usuario:UsuarioModel;

constructor(private usuarioService : UsuarioServicesService){}

ngOnInit(): void {
  this.usuarioService.getUsuarioActual().subscribe(usuario => {
    this.usuario = usuario;
    console.log(usuario)
  });
}

}
