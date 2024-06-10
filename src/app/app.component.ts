import { Component, HostListener, OnInit} from '@angular/core';
import { UsuarioServicesService } from './service/usuario.services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

    constructor(private servicio: UsuarioServicesService){}

    ngOnInit(): void {}

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: Event) {
      this.servicio.cerrarCesion();
    }

  }
