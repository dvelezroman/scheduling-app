import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PacienteModel } from '../models/paciente.model';
import { PacienteService } from '../../service/paciente.service';
import { UsuarioServicesService } from '../../service/usuario.services.service';


@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
    export class PacienteComponent implements OnInit{
    paciente:PacienteModel = new PacienteModel();
    auth:boolean = true;
    nombres:string; 
    cedula:number; 
    correo:string; 
    telefono:number; 
    direccion:string;
    emailRegistrador:string;
    usuarioId:string;
    localId:string;
    editar:boolean = false;
    cedulaExiste: boolean = false;

    constructor(public servicio : PacienteService,
                private usuarioServicio: UsuarioServicesService, 
                private parametro : ActivatedRoute,
                private ruta: Router)
                {  
                  this.nombres = this.paciente.nombres;
                  this.cedula = this.paciente.cedula;
                  this.correo = this.paciente.correo;
                  this.telefono = this.paciente.telefono;
                  this.direccion = this.paciente.direccion;}

    ngOnInit():void {

      this.usuarioServicio.usuarioLocalId.subscribe (id =>{
        this.usuarioId = id;
      });
      
      this.usuarioServicio.usuarioActual.subscribe (email =>{
        this.emailRegistrador = email;
      });

        let id = this.parametro.snapshot.paramMap.get('id');
        
        if(id !== "nuevo"){
            this.servicio.getPaciente(id).subscribe((data:PacienteModel) =>{
              this.paciente = data;
              this.paciente.id = id;
              this.localId = localStorage.getItem('userName');

              this.editar = this.paciente.registrador === this.localId
              this.usuarioServicio.setEditar(this.editar);
              this.usuarioServicio.setRegistrador(this.paciente.registrador);

            });
          }

    }
    validarCedula(cedula: number) {
      this.cedulaExiste = this.servicio.verificarCedulaUnica(cedula, this.emailRegistrador);
    }
    guardar(form: NgForm) {
      
      if (form.invalid) {
        Object.values(form.controls).forEach(control => control.markAllAsTouched());
        Swal.fire({
          title: 'Error!!',
          text: `No has completado el formulario`,
          icon: 'error',
          timer: 2500,
          showConfirmButton: false
        });
        return;
      }
    
      if (this.paciente.id) { 

        if (this.servicio.verificarCedulaUnica(this.paciente.cedula, this.emailRegistrador, this.paciente.id)) {
          this.cedulaExiste = true;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La cédula ya existe.'
          });
          return;
        }
    
        this.servicio.refreshPaciente(this.paciente).subscribe(() => {
          Swal.fire({
            title: 'Actualizado',
            text: `Agregado los cambios de ${this.paciente.nombres}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          setTimeout(() => {
            this.ruta.navigate(['pacientes']);
          }, 1500);
        });
      } else { 

        if (this.servicio.verificarCedulaUnica(this.paciente.cedula, this.emailRegistrador)) {
          this.cedulaExiste = true;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La cédula ya existe.'
          });
          return;
        }
    
        this.paciente.registrador = this.emailRegistrador;
        this.paciente.usuarioUid = this.usuarioId;
        this.servicio.crearPaciente(this.paciente).subscribe(() => {
          Swal.fire({
            title: 'Agregado',
            text: `${this.paciente.nombres} se ha agregado a la lista`,
            icon: 'success',
            timer: 1800,
            showConfirmButton: false
          });
          setTimeout(() => {
            this.ruta.navigate(['pacientes']);
          }, 1500);
        });
      }
    }    
  
    limpiar(form:NgForm){
      this.paciente.id.delete();
      this.cedulaExiste = false;
      return form.reset();
    }

    
  }
