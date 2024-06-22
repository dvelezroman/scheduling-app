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
 
 private router = Inject(Router)
  ngOnInit() {
    if (isLocalStorageAvailable()) {

      if (localStorage.getItem('token')) {
        this.auth = true;
      } else {
        this.auth = false;

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
