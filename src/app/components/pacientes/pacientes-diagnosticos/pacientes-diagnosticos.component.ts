import { Component, OnInit } from '@angular/core';
import { PacienteModel } from '../../models/paciente.model';
import { PacienteService } from '../../../service/paciente.service';


@Component({
  selector: 'app-pacientes-diagnosticos',
  templateUrl: './pacientes-diagnosticos.component.html',
  styleUrl: './pacientes-diagnosticos.component.css'
})
export class PacientesDiagnosticosComponent implements OnInit {
  pacientes: PacienteModel[] = [];
  diagnosticoSeleccionado: { [key: string]: any } = {};
  pacienteCedulaSeleccionado: number | null = null;
  selectedDiagnostico: { [key: number]: string } = {};

  constructor(private pacienteService: PacienteService){}
ngOnInit(): void {
    this.pacienteService.cargarPacientesConDiagnosticos().subscribe(pacientes =>{
      this.pacientes = pacientes;

    });
  }
  mostrarDiagnostico(event: Event, pacienteCedula: number): void {
    const fechaSeleccionada = new Date((event.target as HTMLSelectElement).value);
    const paciente = this.pacientes.find(p => p.cedula === pacienteCedula);
    if (paciente) {
      const diagnostico = paciente.diagnostico.find(d => new Date(d.fecha).getTime() === fechaSeleccionada.getTime());
      if (diagnostico) {
        this.diagnosticoSeleccionado[pacienteCedula] = diagnostico.texto;
        this.pacienteCedulaSeleccionado = pacienteCedula;
        this.selectedDiagnostico[pacienteCedula] = fechaSeleccionada.toISOString(); // Guardar la fecha seleccionada en el objeto
      } else {
        this.diagnosticoSeleccionado[pacienteCedula] = '';
        this.pacienteCedulaSeleccionado = null;
      }
    }
  }
  
  cerrarDiagnostico(pacienteCedula: number): void {
    this.diagnosticoSeleccionado[pacienteCedula] = '';
    this.selectedDiagnostico[pacienteCedula] = 'default'; 
    if (this.pacienteCedulaSeleccionado === pacienteCedula) {
      this.pacienteCedulaSeleccionado = null;
    }
  }
  ajustarAltura(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
