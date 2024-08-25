import { Component, OnInit } from '@angular/core';
import { UsuarioServicesService } from '../../service/usuario.services.service';
import { UsuarioModel } from '../models/usuario.model';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { cedulaEcuatorianaValidator } from '../paciente/cedula-ecuador-validador';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {
  usuario: UsuarioModel;
  usuarioForm: FormGroup;
  profesionInput: string = '';
  userRol:string = '';
  selectedFile: File = null;
  imagenSubida: boolean = false;


constructor(private usuarioServicios : UsuarioServicesService,
            private userService : UsuarioServicesService,
            private fb : FormBuilder,
            private ruta : Router){}
  ngOnInit(): void {
    
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      especialidad: [''],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/), cedulaEcuatorianaValidator()]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      direccionConsultorio: [''],
      informacionProfesional: [''],
      fotoPerfil: [null]
    });

        this.usuarioServicios.getUsuarioActual().subscribe(usuario => {
          if (usuario) {
            this.usuario = usuario;

           this.usuarioForm.patchValue({
            nombres: usuario.nombres || '',
            edad: usuario.edad || '',
            especialidad: usuario.especialidad || '',
            cedula: usuario.cedula || '',
            telefono: usuario.telefono || '',
            informacionProfesional: Array.isArray(usuario.informacionProfesional) ? usuario.informacionProfesional : [],
            direccionConsultorio: usuario.direccionConsultorio || ''
           
            });
          }
        }, error => {
          console.error('Error al obtener usuario:', error);
        });
        
        this.userService.getUsuarioActual2().subscribe((usuario: UsuarioModel | null) => {
          if (usuario) {
            this.userRol = usuario.rol;
          }
        });


      }

      onInput(controlName: string): void {
        this.usuarioForm.get(controlName).markAsTouched();
      }
      agregarProfesion(): void {
        if (this.profesionInput.trim()) {
          const profesiones = this.usuarioForm.value.informacionProfesional;
          profesiones.push(this.profesionInput.trim());
          this.usuarioForm.patchValue({ informacionProfesional: profesiones });
          this.profesionInput = '';
        }
      }
    
      eliminarProfesion(index: number): void {
        const profesiones = this.usuarioForm.value.informacionProfesional;
        profesiones.splice(index, 1);
        this.usuarioForm.patchValue({ informacionProfesional: profesiones });
      }


      onFileSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        if (file) {
          this.selectedFile = file;
          this.usuarioForm.get('fotoPerfil').setValue(file); 
        }
      }

      // METODO SUBIR IMAGEN ANTES DE ACTUALIZAR
      subirImagen() {
        if (this.selectedFile) {
          this.usuarioServicios.subirFotoPerfil(this.selectedFile, this.usuario.id).subscribe({
            next: (url: string) => {
              this.usuario.fotoUrl = url; 
              Swal.fire({
                icon: 'success',
                title: 'Imagen subida correctamente',
                showConfirmButton: false,
                timer: 1500
              });
            },
            error: (error) => {
              this.mostrarErrorSwal('Ocurrió un error al subir la imagen. Inténtalo de nuevo.');
              console.error('Error al subir la imagen:', error);
            }
          });
        }
      }
      
      enviar() {
        if (this.usuarioForm.valid) {
          const updatedUsuario = {
            ...this.usuario,
            ...this.usuarioForm.value,
            especialidad: this.usuarioForm.value.especialidad || null,
            telefono: this.usuarioForm.value.telefono || null,
            cedula: this.usuarioForm.value.cedula || null,
            edad: this.usuarioForm.value.edad || null,
            informacionProfesional: this.usuarioForm.value.informacionProfesional || [],
            direccionConsultorio: this.usuarioForm.value.direccionConsultorio || null
            
          };
    
          // Subir imagen y actualizar usuario
          if (this.selectedFile) {
            this.usuarioServicios.subirFotoPerfil(this.selectedFile, this.usuario.id).subscribe({
              next: (url) => {
                updatedUsuario.fotoUrl = url;
                this.actualizarUsuarioDatos(updatedUsuario);
              },
              error: (error) => {
                this.mostrarErrorSwal(error);
              }
            });
          } else {
            this.actualizarUsuarioDatos(updatedUsuario);
          }
        }
      }
    
      actualizarUsuarioDatos(usuario: UsuarioModel) {
        this.usuarioServicios.actualizarUsuario(usuario).subscribe({
          next: () => {
            this.mostrarExitoSwal();
          },
          error: (error) => {
            this.mostrarErrorSwal(error);
          }
        });
      }
    
     
      
      mostrarExitoSwal() {
        Swal.fire({
          icon: 'success',
          title: 'Actualización Exitosa',
          text: 'Los datos del usuario han sido actualizados correctamente',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.ruta.navigate(['/datos-usuario']);
        });
      }
    
      mostrarErrorSwal(error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar los datos del usuario. Inténtalo de nuevo.'
        });
        console.error(error);
      }
      cancelar() {
        this.ruta.navigate(['/datos-usuario']);
      }


      cedulaEcuatorianaValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const cedula = control.value?.toString();
          if (!cedula) return null; 
    
          const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
          const provincia = parseInt(cedula.substring(0, 2), 10);
    
          if (cedula.length !== 10 || provincia < 0 || provincia > 24) {
            return { 'cedulaEcuatoriana': true };
          }
    
          let suma = 0;
          for (let i = 0; i < coeficientes.length; i++) {
            let resultado = parseInt(cedula.charAt(i), 10) * coeficientes[i];
            if (resultado >= 10) {
              resultado -= 9;
            }
            suma += resultado;
          }
          const digitoVerificador = (10 - (suma % 10)) % 10;
    
          if (parseInt(cedula.charAt(9), 10) !== digitoVerificador) {
            return { 'cedulaEcuatoriana': true };
          }
    
          return null;
        };
      }

      limitarLongitud(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.value.length > 2) {
          input.value = input.value.slice(0, 2);
        }
      }
      
  }

