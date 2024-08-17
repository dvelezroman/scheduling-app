import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UsuarioServicesService } from '../service/usuario.services.service';

@Injectable({
  providedIn: 'root'
})
export class GuardRegistro implements CanActivate {
  constructor(private authService: UsuarioServicesService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getUsuarioActual2().pipe(
      take(1),
      map(usuario => {
        if (usuario && usuario.rol === 'administrador') {
            return true;
          } else if (usuario && usuario.rol !== 'administrador') {
            return this.router.createUrlTree(['/notAuthorized']); 
          } else {
            return this.router.createUrlTree(['/notAuthorized']); 
          }
      })
    );
  }
}
