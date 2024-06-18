

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { PacienteModel } from '../components/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  url = 'https://pacientes-app1-default-rtdb.firebaseio.com';
  firebaseUrl = 'https://pacientes-app1-default-rtdb.firebaseio.com';
  tokenGoyo = 'XvpYiDOFfrTy4fpTQ6oy9AeqDad2';

  private pacientesFiltrados: PacienteModel[] = [];
  
  constructor(private http : HttpClient,
              private db : AngularFireDatabase
  ) { }
  
  getPacientesFiltrados(): PacienteModel[] {
    return this.pacientesFiltrados;
  }

 crearPaciente(paciente:PacienteModel){

    return this.http.post(`${this.url}/pacientes.json`, paciente)
     .pipe(
      map((data:any) => {
        paciente.id = data.name
        console.log(paciente)
        return paciente;
        })
      );
    }


    cargarPacientes(): Observable<PacienteModel[]> {
      return this.http.get(`${this.url}/pacientes.json`).pipe(
        map(this.crearArreglo),
        map((pacientes: PacienteModel[]) => {
          const usuarioLogin = localStorage.getItem('userName');
          this.pacientesFiltrados = pacientes.filter(paciente => paciente.registrador === usuarioLogin);

          return this.pacientesFiltrados;
        })
      );
    }

    cargarPacientesFiltrados(usuarioLogin: string): Observable<PacienteModel[]> {
      return this.cargarPacientes().pipe(
        map(pacientes => pacientes.filter(paciente => paciente.registrador === usuarioLogin))
      );
    }
    
 private crearArreglo (pacienteObj:Object): PacienteModel[]{
      if(pacienteObj === null){
          return [];
      }
          const pacientes: PacienteModel[] = [];

          Object.keys(pacienteObj).forEach(key => {
            const paciente: PacienteModel = pacienteObj[key];
            paciente.id = key;
            pacientes.push(paciente);
          });
      return pacientes;
  }

 getPaciente(id:string){
    return this.http.get(`${this.url}/pacientes/${id}.json`)
  }

  getMedicoId(): string {
    return localStorage.getItem('userUid'); 
  }
  

 refreshPaciente(paciente:PacienteModel):Observable<PacienteModel>{
    
    const PacienteT = {
      ...paciente
    };
      delete PacienteT.id;
        return this.http.put<PacienteModel>(`${this.url}/pacientes/${paciente.id}.json`, PacienteT);
  }

  deletePaciente(id: string): Observable<any> {
    return this.http.delete(`${this.url}/pacientes/${id}.json`).pipe(
      map(() => {
        this.pacientesFiltrados = this.pacientesFiltrados.filter(paciente => paciente.id !== id);
      })
    );
  }

  buscarPacientes(nombre: string): Observable<PacienteModel[]> {
    return this.cargarPacientes()
    .pipe(
      map(pacientes => pacientes.filter(paciente => paciente.nombres.toLowerCase().includes(nombre.toLowerCase())))
    );
  }

  verificarCedulaUnica(cedula: number, registrador: string, pacienteId?: string): boolean {
    return this.pacientesFiltrados.some(paciente => 
      paciente.cedula === cedula && paciente.registrador === registrador && paciente.id !== pacienteId
    );
  }



}
