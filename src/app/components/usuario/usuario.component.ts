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


constructor(private usuarioServicios : UsuarioServicesService,
            private fb : FormBuilder,
            private ruta : Router){}
  ngOnInit(): void {
    
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      especialidad: [''],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/), cedulaEcuatorianaValidator()]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      direccionConsultorio: [''],
      informacionProfesional: ['']
    });

        this.usuarioServicios.getUsuarioActual().subscribe(usuario => {
          if (usuario) {
            this.usuario = usuario;
           // console.log(this.usuario)
           this.usuarioForm.patchValue({
            nombres: usuario.nombres || '',
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
      enviar() {
        if (this.usuarioForm.valid) {
          const updatedUsuario = {
            ...this.usuario,
            ...this.usuarioForm.value,
            especialidad: this.usuarioForm.value.especialidad || null,
            telefono: this.usuarioForm.value.telefono || null,
            cedula: this.usuarioForm.value.cedula || null,
            informacionProfesional: this.usuarioForm.value.informacionProfesional || [],
            direccionConsultorio: this.usuarioForm.value.direccionConsultorio || null
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
      
  }

