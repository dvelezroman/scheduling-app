import { Component, HostListener, OnInit} from '@angular/core';
import { UsuarioServicesService } from './service/usuario.services.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

    constructor(private servicio: UsuarioServicesService,
                private router: Router
    ){}

    ngOnInit(): void {
      

      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          if (event.url === '/login' && this.isLoggedIn()) {
            window.history.pushState(null, '', window.location.href);
          }
        }
      });
    }
    isLoggedIn(): boolean {

      return !!localStorage.getItem('token'); 
    }
    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: Event) {
      this.servicio.cerrarCesion();
   }
   
  }
