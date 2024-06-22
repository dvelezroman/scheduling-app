import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../service/paciente.service';
import { Diagnostico } from '../../models/paciente.model';
import { UsuarioServicesService } from '../../../service/usuario.services.service';

@Component({
  selector: 'app-mis-diagnosticos',
  templateUrl: './mis-diagnosticos.component.html',
  styleUrl: './mis-diagnosticos.component.css'
})
export class MisDiagnosticosComponent implements OnInit {
  diagnosticos: Diagnostico[] = [];
  cedulaPaciente: number;
  diagnosticoSeleccionado: Diagnostico | null = null;
  
  constructor(private pacienteService: PacienteService,
              private usuarioService: UsuarioServicesService
  ) { }

  ngOnInit(): void {

    const uid = localStorage.getItem('userUid');
    if (uid) {
      this.usuarioService.getUsuarioCedula(uid).subscribe(cedula => {
        this.cedulaPaciente = Number(cedula);  // Asegúrate de convertir a número
        console.log('Cédula del paciente:', this.cedulaPaciente);
        if (this.cedulaPaciente) {
          this.obtenerDiagnosticos();
        }
      });
    } else {
      console.error('No se encontró UID del usuario en el localStorage.');
    }
  }

  obtenerDiagnosticos(): void {
    this.pacienteService.getDiagnosticosByCedula(this.cedulaPaciente).subscribe(diagnosticos => {
      this.diagnosticos = diagnosticos;
      console.log('Diagnósticos obtenidos:', this.diagnosticos);
    }, error => {
      console.error('Error al obtener los diagnósticos:', error);
    });
  }

  mostrarDiagnostico(event: Event): void {
    const fechaSeleccionada = new Date((event.target as HTMLSelectElement).value);
    this.diagnosticoSeleccionado = this.diagnosticos.find(d => new Date(d.fecha).getTime() === fechaSeleccionada.getTime()) || null;
  }

  cerrarDiagnostico(): void {
    this.diagnosticoSeleccionado = null;
    const selectElement = document.getElementById('diagnosticoSelect') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = 'default';
    }
  }
}

