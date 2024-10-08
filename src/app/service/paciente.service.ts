

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { Diagnostico, PacienteModel, Turno } from '../components/models/paciente.model';
import { UsuarioServicesService } from './usuario.services.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  url = 'https://pacientes-app1-default-rtdb.firebaseio.com';
  firebaseUrl = 'https://pacientes-app1-default-rtdb.firebaseio.com';
  tokenGoyo = 'XvpYiDOFfrTy4fpTQ6oy9AeqDad2';

  private totalDiagnosticosSubject = new BehaviorSubject<number>(0);
  totalDiagnosticos$ = this.totalDiagnosticosSubject.asObservable();

  private pacientesFiltrados: PacienteModel[] = [];
  
  constructor(private http : HttpClient,
              private db : AngularFireDatabase,
              private usuarioService: UsuarioServicesService
                ) { }
  
 
/////////////////////////////////////////////////////////////////////////////
        //METODO PARA CREAR PACIENTES//

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

/////////////////////////////////////////////////////////////////////////////
             //METODO PARA CARGAR PACIENTES//

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



    cargarPacientes2(): Observable<PacienteModel[]> {
      return this.usuarioService.getUsuarios().pipe(
        switchMap(usuarios => {
          const usuariosPacientes = usuarios.filter(u => u.rol === 'paciente');
    
          return this.http.get<{ [key: string]: PacienteModel }>(`${this.url}/pacientes.json`).pipe(
            map(pacientesObj => {
              const pacientes: PacienteModel[] = Object.keys(pacientesObj || {}).map(key => {
                const paciente = pacientesObj[key];
    
                const usuario = usuariosPacientes.find(u => {
                  return String(u.cedula).trim() === String(paciente.cedula).trim();
                });
                
                if (usuario) {
                  paciente.fotoUrl = usuario.fotoUrl; 
                } else {
                  paciente.fotoUrl = 'assets/fondo foto paciente.png'; 
                }
    
                return paciente;
              });
    
              return pacientes;
            })
          );
        })
      );
    }
    

    
 ////////////////////////////////////////////////////////////////////////////////////
        //METODO PARA CARGAR PACIENTE QUE TENGAN DIAGNOSTICOS REALIZADOS//

    cargarPacientesConDiagnosticos(): Observable<PacienteModel[]> {
      return this.http.get<{ [key: string]: PacienteModel }>(`${this.url}/pacientes.json`).pipe(
        map(this.crearArreglo),
        map((pacientes: PacienteModel[]) => {
          const usuarioLogin = localStorage.getItem('userName');
          return pacientes.filter(paciente => 
            paciente.registrador === usuarioLogin && paciente.diagnostico && paciente.diagnostico.length > 0
          );
        })
      );
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
              //METODO PARA CONVERTIR EN ARREGLO LOS DATOS CARGADOS POR FIREBASE//

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
  /////////////////////////////////////////////////////////////////////////////////////////////////////
            //METODO PARA CARGAR LOS PACIENTES DE CADA USUARIO MEDICO//

    cargarPacientesFiltrados(usuarioLogin: string): Observable<PacienteModel[]> {
        return this.cargarPacientes().pipe(
          map(pacientes => pacientes.filter(paciente => paciente.registrador === usuarioLogin))
        );
      }


      
      getPaciente(id:string){
        return this.http.get(`${this.url}/pacientes/${id}.json`)
      }
      getPacientesFiltrados(): PacienteModel[] {
         return this.pacientesFiltrados;
       }


      getMedicoId(): string {
        return localStorage.getItem('userUid'); 
      }
  
//////////////////////////////////////////////////////////////////////////////
          //METODO PARA ACTUALIZAR LA LISTA DE PACIENTES EN FIREBASE//

  refreshPaciente(paciente:PacienteModel):Observable<PacienteModel>{
    
    const PacienteT = {
      ...paciente
    };
      delete PacienteT.id;
        return this.http.put<PacienteModel>(`${this.url}/pacientes/${paciente.id}.json`, PacienteT);
  }

  //////////////////////////////////////////////////////////////////////////////
          //METODO PARA BORRAR UN PACIENTE EN FIREBASE//

  deletePaciente(id: string): Observable<any> {
    console.log(`Deleting paciente with id: ${id}`); 
    return this.http.delete(`${this.url}/pacientes/${id}.json`).pipe(
      map(() => {
        this.pacientesFiltrados = this.pacientesFiltrados.filter(paciente => paciente.id !== id);
      })
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
          //METODO PARA BUSCAR UN PACIENTE DE LA LISTA DE UN USUARIO EN FIREBASE//

  buscarPacientes(nombre: string): Observable<PacienteModel[]> {
    return this.cargarPacientes()
    .pipe(
      map(pacientes => pacientes.filter(paciente => paciente.nombres.toLowerCase().includes(nombre.toLowerCase())))
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////
                  //METODO PARA VALIDAR CEDULA SI EXISTE O NO//
  verificarCedulaUnica(cedula: number, registrador: string, pacienteId?: string): boolean {
    return this.pacientesFiltrados.some(paciente => 
      paciente.cedula === cedula && paciente.registrador === registrador && paciente.id !== pacienteId
    );
  }


 

  getHorasOcupadas(fecha: string, registrador: string): Observable<string[]> {
    return this.db.list<PacienteModel>('/pacientes', ref => 
      ref.orderByChild('turno').startAt(fecha).endAt(fecha + "\uf8ff"))
      .valueChanges()
      .pipe(
        map(pacientes => pacientes
          .filter(paciente => paciente.registrador === registrador)
          .map(paciente => {
            const turnoDate = new Date(paciente.turno);
            turnoDate.setHours(turnoDate.getHours() - 5); 
            return turnoDate.toISOString().split('T')[1].substring(0, 5);
          })
        )
      );
  }

  getPacientesConTurnosDelDia(registrador: string): Observable<PacienteModel[]> {
    const hoy = new Date().toISOString().split('T')[0];
    return this.db.list<PacienteModel>('/pacientes', ref => ref.orderByChild('turno').startAt(hoy).endAt(hoy + "\uf8ff"))
      .valueChanges()
      .pipe(
        map(pacientes => pacientes.filter(paciente => paciente.turno && paciente.turno.startsWith(hoy) && paciente.registrador === registrador))
      );
  }

  getStoredUserUid(): string {
    return localStorage.getItem('userUid') || '';
  }

  getDiagnosticos(): Observable<PacienteModel[]> {
    const userId = this.getStoredUserUid();
    return this.db.list<PacienteModel>('/pacientes', ref => ref.orderByChild('usuarioUid').equalTo(userId))
      .valueChanges()
      .pipe(
        map(pacientes => pacientes.map(paciente => {
          if (paciente.diagnostico) {
            paciente.diagnostico.forEach(diag => {
              const turnoDate = new Date(diag.fecha); 
              turnoDate.setMinutes(turnoDate.getMinutes());
              diag.fecha = turnoDate;
            });
          } else {
            paciente.diagnostico = []; 
          }
          return paciente;
        }))
      );

    }

    getDiagnosticosByCedula(cedulaPaciente: number): Observable<Diagnostico[]> {
      return this.db.list<PacienteModel>('/pacientes').valueChanges().pipe(
        map((pacientes: PacienteModel[]) => {
          let diagnosticos: Diagnostico[] = [];
          pacientes.forEach(paciente => {
            if (paciente.cedula === cedulaPaciente) {
              if (paciente.diagnostico) {

                if (Array.isArray(paciente.diagnostico)) {

                  diagnosticos = diagnosticos.concat(paciente.diagnostico);
                } else if (typeof paciente.diagnostico === 'object') {

                  diagnosticos = diagnosticos.concat(Object.values(paciente.diagnostico));
                }
              }
            }
          });
    

          diagnosticos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          return diagnosticos;
        })
      );
    }
    



    getTurnosByCedula(cedulaPaciente: number): Observable<Turno[]> {
      return this.db.list<PacienteModel>('/pacientes').valueChanges().pipe(
        map((pacientes: PacienteModel[]) => {
          let turnos: Turno[] = [];
          pacientes.forEach(paciente => {
            if (paciente.turnoParaMostrar) {
              turnos = turnos.concat(paciente.turnoParaMostrar.filter(t => t.cedulaPaciente === cedulaPaciente));
            }
          });
  
          turnos.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
  
          return turnos;
        })
      );
    }

    getPacienteByCedula(cedula: number): Observable<PacienteModel> {
      return this.db.list<PacienteModel>('/pacientes', ref => ref.orderByChild('cedula').equalTo(cedula))
        .valueChanges()
        .pipe(
          map(pacientes => pacientes[0])
        );
    }




  }
    





