import { Component, Inject, OnInit } from '@angular/core';
import { UsuarioServicesService } from '../../../service/usuario.services.service';
import { Router } from '@angular/router';
import { isLocalStorageAvailable } from '../../../localStorageUtils';

@Component({
  selector: 'app-inicio-no-auth',
  templateUrl: './inicio-no-auth.component.html',
  styleUrl: './inicio-no-auth.component.css'
})
export class InicioNoAuthComponent implements OnInit {
 auth:boolean = false;
 isDropdownOpen: boolean = false;
 
 private servicio = Inject(UsuarioServicesService)
 private router = Inject(Router)
  ngOnInit() {
    if (isLocalStorageAvailable()) {
      console.log(this.servicio.autenticado());
      if (localStorage.getItem('token')) {
        this.auth = true;
      } else {
        this.auth = false;
        console.log(this.auth);
      }
    } 
  }
  registrar(rol: string) {
    this.router.navigate(['/registro'], { queryParams: { rol } });
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
