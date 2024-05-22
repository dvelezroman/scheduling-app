import { CanActivate, CanActivateFn, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { UsuarioServicesService } from '../service/usuario.services.service';

@Injectable({
providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private auth : UsuarioServicesService,
             private ruta : Router){}

  canActivate():boolean{
    if(this.auth.autenticado()){
      
      return true;
    }else{
      this.ruta.navigate(['/registro']);
      return false;
    }
  }
}
