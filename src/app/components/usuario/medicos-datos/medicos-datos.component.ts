import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioServicesService } from '../../../service/usuario.services.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-medicos-datos',
  templateUrl: './medicos-datos.component.html',
  styleUrl: './medicos-datos.component.css'
})
export class MedicosDatosComponent implements OnInit {
  cantidadMedicos: number = 0;
  medicos: UsuarioModel[] = [];

  constructor(private usuarioServicios: UsuarioServicesService,
              private location: Location) {}

  ngOnInit(): void {

    this.usuarioServicios.obtenerMedicos().subscribe(medicos => {
      this.medicos = medicos;
      this.cantidadMedicos = medicos.length;
    }, error => {
      console.error('Error al obtener médicos:', error);
    });
  }

  volverInicio() {
    this.location.back();
  }
}
