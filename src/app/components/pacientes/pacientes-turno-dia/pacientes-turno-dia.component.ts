import { Component, OnInit } from '@angular/core';
import { PacienteModel } from '../../models/paciente.model';
import { PacienteService } from '../../../service/paciente.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { TwilioService } from '../../../service/twilio.service';

@Component({
  selector: 'app-pacientes-turno-dia',
  templateUrl: './pacientes-turno-dia.component.html',
  styleUrl: './pacientes-turno-dia.component.css'
})
export class PacientesTurnoDiaComponent implements OnInit {

  pacienteTurnoDia: PacienteModel[] = [];
  hayPacientesHoy: boolean = false;
  to: string;
  usuarioLogin: string;

constructor(private servicio: PacienteService,
            private datePipe : DatePipe,
            private twilio :TwilioService)
           
            {this.usuarioLogin = localStorage.getItem('userName');}

  ngOnInit(): void {

    this.servicio.getPacientesConTurnosDelDia(this.usuarioLogin).subscribe(pacientes => {
      this.pacienteTurnoDia = pacientes;
      this.hayPacientesHoy = this.pacienteTurnoDia.length > 0;
    });
    
  }

  sendMessage(telefono: string, turno: string, paciente: PacienteModel) {
    this.to = `+593${telefono}`;
    let defaultMessage = `Hola ${paciente.nombres}, `;
    
    if (turno) {
        const turnoDate = new Date(turno);
        const turnoFormat = this.datePipe.transform(turno, 'EEEE, d', 'default', 'es');
        const mesAnoFormat = this.datePipe.transform(turnoDate, 'MMMM', 'default', 'es');
        const anoFormat = this.datePipe.transform(turnoDate, 'y', 'default', 'es');
        const horaFormat = this.datePipe.transform(turno, 'shortTime', 'default', 'es');
        const horas = turnoDate.getHours();
        const periodo = horas < 12 ? 'de la mañana' : 'de la tarde';
          defaultMessage += `se le recuerda que su turno está pronosticado para el día ${turnoFormat} de ${mesAnoFormat} del ${anoFormat} a las ${horaFormat} ${periodo}.`;
    } else {
        defaultMessage += 'aún no tiene un turno asignado.';
    }
    
    Swal.fire({
        title: 'Enviar Mensaje',
        text: `¿Enviar mensaje a ${paciente.nombres}?`,
        input: 'textarea',
        inputLabel: 'Escriba su mensaje',
        inputValue: defaultMessage,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: (message) => {
            if (!message) {
                Swal.showValidationMessage('El mensaje no puede estar vacío');
            }
            return message;
        }
    }).then(result => {
        if (result.isConfirmed && result.value) {
            const mensaje = result.value;
            this.twilio.sendNotification(this.to, mensaje).subscribe(resp => {
                if (resp.success === true) {
                    Swal.fire({
                        title: 'Mensaje Enviado!!',
                        text: `Enviado la notificación a ${paciente.nombres}`,
                        icon: 'success',
                        timer: 2500,
                        showCancelButton: false,
                        showConfirmButton: false,
                    });
                }
            },
            error => {
                console.error('Error al enviar notificación:', error);
                Swal.fire({
                    title: 'Error al enviar',
                    text: 'Servidor no conectado',
                    icon: 'error',
                    timer: 1800,
                    showCancelButton: false,
                    showConfirmButton: false,
                });
            });
        }
    });
}
}
