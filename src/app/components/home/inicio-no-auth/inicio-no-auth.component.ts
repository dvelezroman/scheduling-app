import { Component, Inject, OnInit } from '@angular/core';
import { UsuarioServicesService } from '../../../service/usuario.services.service';

@Component({
  selector: 'app-inicio-no-auth',
  templateUrl: './inicio-no-auth.component.html',
  styleUrl: './inicio-no-auth.component.css'
})
export class InicioNoAuthComponent implements OnInit {
 auth:boolean = false;
 private servicio = Inject(UsuarioServicesService)

  ngOnInit() {
    console.log(this.servicio.autenticado())
    if(localStorage.getItem('token')){
      this.auth = true;

    }else{
      this.auth = false;
      console.log(this.auth)
    }
    return this.auth;
  }
}
