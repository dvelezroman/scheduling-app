import { Component, OnInit } from '@angular/core';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import { UsuarioModel } from '../models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {
  usuario: UsuarioModel;
  usuarioForm: FormGroup;
constructor(private usuarioServicios : UsuarioServicesService,
            private fb : FormBuilder,
            private ruta : Router){}
  ngOnInit(): void {
    
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      especialidad: [''],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });

        this.usuarioServicios.getUsuarioActual().subscribe(usuario => {
          if (usuario) {
            this.usuario = usuario;
           // console.log(this.usuario)
           this.usuarioForm.patchValue({
            nombres: usuario.nombres || '',
            especialidad: usuario.especialidad || '',
            telefono: usuario.telefono || ''
            });
          }
        }, error => {
          console.error('Error al obtener usuario:', error);
        });

      }
      enviar() {
        if (this.usuarioForm.valid) {
          const updatedUsuario = {
            ...this.usuario,
            ...this.usuarioForm.value,
            especialidad: this.usuarioForm.value.especialidad || null,
            telefono: this.usuarioForm.value.telefono || null
          };
    
          this.usuarioServicios.actualizarUsuario(updatedUsuario).subscribe(() => {
            //console.log(this.usuario)
            Swal.fire({
              icon: 'success',
              title: 'Actualización Exitosa',
              text: 'Los datos del usuario han sido actualizado correctamente',
              timer: 1800,
              showConfirmButton: false
              
            }).then(()=>{
              this.ruta.navigate(['/datos-usuario']);

            });
          }, error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al actualizar los datos del usuario. Inténtalo de nuevo.'
            });
            //console.error(error);
          });
        }
      }
      cancelar() {
        this.ruta.navigate(['/datos-usuario']);
      }
  }

