import { Component, OnInit } from '@angular/core';
import { Turno } from '../../models/paciente.model';
import { PacienteService } from '../../../service/paciente.service';
import { UsuarioServicesService } from '../../../service/usuario.services.service';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-paciente-citas',
  templateUrl: './paciente-citas.component.html',
  styleUrl: './paciente-citas.component.css'
})
export class PacienteCitasComponent implements OnInit {
  turnos: Turno[] = [];
  cedulaPaciente: number;
  totalTurnos: number;
  mensajeTurnos: string = '';
  medicoInfo: { [key: string]: UsuarioModel } = {};


constructor(private pacienteService: PacienteService,
           private usuarioService: UsuarioServicesService){}

     ngOnInit(): void {
            const uid = localStorage.getItem('userUid');
            if (uid) {
              this.usuarioService.getUsuarioCedula(uid).subscribe(cedula => {
                this.cedulaPaciente = Number(cedula);
        
                if (this.cedulaPaciente) {
                  this.obtenerTurnos();
                }
              });
            } else {
              console.error('No se encontró UID del usuario en el localStorage.');
            }
       }
        
       obtenerTurnos(): void {
        this.pacienteService.getTurnosByCedula(this.cedulaPaciente).subscribe(turnos => {
          this.turnos = turnos;
          this.totalTurnos = turnos.length;
          this.mensajeTurnos = this.totalTurnos === 1 ? 'Tienes 1 turno agendado' : `Tienes ${this.totalTurnos} turnos agendados`;
        }, error => {
          console.error('Error al obtener los turnos:', error);
        });
      }

//METODOS SECUNDARIOS PARA OBTENER INFORMACION DEL MEDICO DEL TURNO PACIENTE//

}
