import { Component, OnInit } from '@angular/core';
import { UsuarioServicesService } from '../../service/usuario.services.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {
autenticado:boolean = false;

constructor(private usuarioService: UsuarioServicesService){}

ngOnInit(): void {

}
loading():void{

}
}
