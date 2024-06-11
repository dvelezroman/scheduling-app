import { Component } from '@angular/core';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recupera-password',
  templateUrl: './recupera-password.component.html',
  styleUrl: './recupera-password.component.css'
})
export class RecuperaPasswordComponent {
  email: string = '';

  constructor(private usuarioService: UsuarioServicesService,
              private ruta: Router) { }


  enviar() {
    if (this.email) {
      this.usuarioService.recuperarContrasena(this.email).subscribe(
        () => {
          Swal.fire({
          
            icon: 'success',
            title: 'Enviado',
            text: 'Se ha enviado un correo electrónico a su dirección de correo electrónico.',
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false,

          });
          this.ruta.navigateByUrl('/login');
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al enviar el correo de restablecimiento. Por favor, inténtelo nuevamente.',
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campo Vacío',
        text: 'Por favor, ingrese su correo electrónico.',
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false,
      });
    }
    
  }
}


