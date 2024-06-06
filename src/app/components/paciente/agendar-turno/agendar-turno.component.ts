import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../service/paciente.service';
import { PacienteModel } from '../../models/paciente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

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

  auth:boolean = true;

  
  constructor(private parametro: ActivatedRoute,
              private servicio : PacienteService,
              private pd: DatePipe,
              private fb: FormBuilder,
              private ruta: Router,
               ){
    this.crearFormulario()
  }
  crearFormulario(){
    this.formTurno = this.fb.group({

      fecha: ['', Validators.required],

    })
  }

  ngOnInit(): void {
    let id = this.parametro.snapshot.paramMap.get('pacienteId');

      this.servicio.getPaciente(id).subscribe((data:PacienteModel) =>{
        
        this.paciente = data;
        this.paciente.id = id;
        //console.log(data.id)
    });

    this.fechaMinima = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1);
    this.fechaMinimaString = this.pd.transform(this.fechaMinima, "yyyy-MM-dd");
    this.fechaMaxima = new Date(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate());
    this.fechaMaximaString = this.pd.transform(this.fechaMaxima,"yyyy-MM-dd");
  }



    agendar(){
      if(this.formTurno.invalid){
        //console.log('Agregue una fecha');
        Swal.fire({
          title: "No has seleccionado una fecha",
          text : 'Seleccione un dia entre lunes a viernes',
          icon: "error",
          timer: 2500,
          showConfirmButton: false
        });
        return;
      
      }

      let id = this.parametro.snapshot.paramMap.get('pacienteId');
      if(!this.paciente.id){
        return;
      }

        this.servicio.getPaciente(id).subscribe((data:PacienteModel) =>{
          this.paciente = data;
          this.paciente.id = id;
          this.paciente.turno = this.formTurno.value.fecha
          this.servicio.refreshPaciente(this.paciente).subscribe();
         // console.log(this.paciente);
          //console.log(this.formTurno.value)
    });
      
      Swal.fire({
        title: "Fecha agregada",
        text: `Su cita para la fecha ${this.formTurno.value.fecha} ha sido agendada!!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false
        
      })
      setTimeout(()=>{
        this.ruta.navigate(['pacientes']);
      },2000)
      //setTimeout(()=>{
       // this.ruta.navigate(['pacientes']);
     // },3000)

      return;
    }
    cerrarSesion(){
      localStorage.removeItem('token');
      if(this.auth){
        this.auth = true;
      }else{
        this.auth = false
      }
    
    
    }
  

}
