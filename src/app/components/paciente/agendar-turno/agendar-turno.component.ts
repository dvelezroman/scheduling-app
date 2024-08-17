import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../service/paciente.service';
import { PacienteModel, Turno } from '../../models/paciente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { UsuarioServicesService } from '../../../service/usuario.services.service';

registerLocaleData(localeEs);

@Component({
  selector: 'app-agendar-turno',
  templateUrl: './agendar-turno.component.html',
  styleUrl: './agendar-turno.component.css'
})
export class AgendarTurnoComponent implements OnInit {



  paciente:PacienteModel = new PacienteModel();
  formTurno:FormGroup;
  fechaMinima:Date;
  fechaMaxima:Date;
  fechaMaximaString:string;
  fechaMinimaString:string;
  horasOcupadas: string[] = [];
  horasDisponibles: string[] = [];
  auth:boolean = true;

  
  constructor(private parametro: ActivatedRoute,
              private servicio : PacienteService,
              private usuarioService: UsuarioServicesService,
              private pd: DatePipe,
              private fb: FormBuilder,
              private ruta: Router,
               ){
    this.crearFormulario()
  }
  crearFormulario(){
    this.formTurno = this.fb.group({

      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.fechaMinima = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
    this.fechaMinimaString = this.pd.transform(this.fechaMinima, "yyyy-MM-dd");
    this.fechaMaxima = new Date(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate());
    this.fechaMaximaString = this.pd.transform(this.fechaMaxima,"yyyy-MM-dd");

    let id = this.parametro.snapshot.paramMap.get('pacienteId');

      this.servicio.getPaciente(id).subscribe((data:PacienteModel) =>{
        
        this.paciente = data;
        this.paciente.id = id;

        if (data.turno) {
          const turnoDate = new Date(data.turno);
          turnoDate.setHours(turnoDate.getHours() - 5);
          this.formTurno.patchValue({
            fecha: turnoDate.toISOString().split('T')[0],
            hora: turnoDate.toTimeString().substring(0, 5)
          });
        }
        this.obtenerHorasOcupadas(this.formTurno.get('fecha').value);
      });
  
      this.formTurno.get('fecha').valueChanges.subscribe(fecha => {
        this.obtenerHorasOcupadas(fecha);
      });

      //METODO PARA LAS FECHAS RESERVADAS//

      this.formTurno.get('fecha').valueChanges.subscribe(fecha => {
        this.servicio.getHorasOcupadas(fecha, this.paciente.registrador).subscribe(horasOcupadas => {
          this.horasOcupadas = horasOcupadas;
          this.actualizarHorasDisponibles();
          
          if (this.horasDisponibles.length > 0 && !this.horasOcupadas.includes(this.formTurno.get('hora').value)) {
            this.formTurno.patchValue({ hora: this.horasDisponibles[0] });
          }
        });
      });
     
  }

//////////////////////////////////////////////////////////////////

    //  METODO PARA NO MOSTRAR LAS HORAS RESERVADAS //

    generarHorasDisponibles(): string[] {
      const horas = [];
      for (let h = 9; h <= 18; h++) {
        for (let m = 0; m < 60; m += 30) {
          const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          horas.push(hora);
        }
      }
      return horas;
    }

    
    obtenerHorasOcupadas(fecha: string) {
      if (!fecha) return;
      this.servicio.getHorasOcupadas(fecha, this.paciente.registrador)
      .subscribe(horasOcupadas => {
        this.horasOcupadas = horasOcupadas;
        this.actualizarHorasDisponibles();
      });
    }
  
    actualizarHorasDisponibles(): void {
      this.horasDisponibles = this.generarHorasDisponibles()
      .filter(hora => !this.horasOcupadas.includes(hora));
    }
////////////////////////////////////////////////////////////////////////////

agendar() {
  if (this.formTurno.invalid) {
    Swal.fire({
      title: 'No has seleccionado una fecha',
      text: 'Seleccione un día entre lunes a viernes',
      icon: 'error',
      timer: 2500,
      showConfirmButton: false
    });
    return;
  }

  const id = this.parametro.snapshot.paramMap.get('pacienteId');
  if (!this.paciente.id) {
    return;
  }

  this.servicio.getPaciente(id).subscribe((data: PacienteModel) => {
    this.paciente = data;
    this.paciente.id = id;
    this.paciente.turno = `${this.formTurno.value.fecha}T${this.formTurno.value.hora}:00`;

    
    this.usuarioService.getUsuarioActual().subscribe(medico => {
      const nuevoTurno: Turno = {
        fechaHora: this.paciente.turno,
        cedulaPaciente: this.paciente.cedula,
        nombreMedico: medico.nombres,
        emailMedico: medico.email 
      };

      this.paciente.turno = nuevoTurno.fechaHora;
      if (this.paciente.turnoParaMostrar) {
        this.paciente.turnoParaMostrar = this.paciente.turnoParaMostrar.filter(t => t.cedulaPaciente !== this.paciente.cedula);
      } else {
        this.paciente.turnoParaMostrar = [];
      }
      this.paciente.turnoParaMostrar.push(nuevoTurno);
      this.servicio.refreshPaciente(this.paciente).subscribe();

      Swal.fire({
        title: 'Fecha agregada',
        text: `Su cita para la fecha ${this.formTurno.value.fecha} a las ${this.formTurno.value.hora} ha sido agendada!!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        this.ruta.navigate(['pacientes']);
      }, 2000);
    });
  });
}

//////////////////////////////////////////////////////////////////
    cerrarSesion(){
      localStorage.removeItem('token');
      if(this.auth){
        this.auth = true;
      }else{
        this.auth = false
      }
    
    
    }
  

}
