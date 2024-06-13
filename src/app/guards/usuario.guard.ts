import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { UsuarioServicesService } from '../service/usuario.services.service';


@Injectable({
  providedIn: 'root'
})
export class GuardUsuario implements CanActivate {
  constructor(private authService: UsuarioServicesService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getUsuarioActual2().pipe(
      take(1),
      map(usuario => {
        if ( usuario && usuario.rol === 'médico') {
          return true;
        } else {
         
          return this.router.createUrlTree(['/not-authorized']);
        }
      })
    );
  }
}
