import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UsuarioModel } from '../components/models/usuario.model';

import { BehaviorSubject, Observable, catchError, 
         finalize, 
         from, map, of, switchMap, take, tap, throwError } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PacienteService } from './paciente.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})

export class UsuarioServicesService implements OnInit {
  
  apykey2 = environment.firebaseConfig.apiKey;
    url = 'https://identitytoolkit.googleapis.com/v1/accounts';
    crearUsuario = ':signUp?key=';
    iniciarSesion = ':signInWithPassword?key=[API_KEY]';
    userToken:string;
    private userPassword: string | null = null;
    valorBoolean:boolean = false;

    private nombreUsuario = new BehaviorSubject<string>(this.getStoredName());
    private emailUsuario = new BehaviorSubject<string>(this.getStoredUserName());
    private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    private usuarioId = new BehaviorSubject<string>(this.getStoredUserUid());
    private editarSubject = new BehaviorSubject<boolean>(false);
    private registradorSubject = new BehaviorSubject<string>(null);
    private usuarioActual2 = new BehaviorSubject<UsuarioModel>(null);

    editar$ = this.editarSubject.asObservable();
    registrador$ = this.registradorSubject.asObservable();
    usuarioActual$2: Observable<UsuarioModel> = this.usuarioActual2.asObservable();


    setRegistrador(value: string) {
      this.registradorSubject.next(value);
      }
    setEditar(value: boolean) {
      this.editarSubject.next(value);
      }

      get usuarioActual(){
        return this.emailUsuario.asObservable();}
        get nombreActual(){
          return this.nombreUsuario.asObservable();}
      get usuarioLocalId(){
        return this.usuarioId.asObservable();}
      get isLoggedIn(){
        return this.loggedIn.asObservable();}

     
    constructor(private http :HttpClient,
                private db : AngularFireDatabase,
                private afAuth : AngularFireAuth,
                private router : Router,
                private storage: AngularFireStorage) {
                
                            this.cargarUsuarioActual2();  }


    ngOnInit(): void {}

    getUsuarioActual2(): Observable<UsuarioModel> {
      return this.usuarioActual2.asObservable(); 
    }
    private cargarUsuarioActual2() {
      const uid = this.getStoredUserUid();
      if (uid) {
        this.db.object<UsuarioModel>(`/usuarios/${uid}`).valueChanges().subscribe(usuario => {
          this.usuarioActual2.next(usuario);
        });
      }
    }



///////////////////////////////////////////////////////////////////////
 //METODO PARA REGISTRAR USUARIO SIN QUE INICIE SESION AUTOMATICAMENTE //
 registrar1(usuario: UsuarioModel): Observable<any> {
  const authData = {
    email: usuario.email,
    password: usuario.password,
    returnSecureToken: true
  };

  return this.http.post(`${this.url}:signUp?key=${this.apykey2}`, authData).pipe(
    switchMap(resp => {
      const uid = resp['localId'];
      usuario.id = uid;
      return from(
        this.db.object(`/usuarios/${uid}`).set({
          id: uid,
          nombres: usuario.nombres,
          email: usuario.email,
          rol: usuario.rol,
          especialidad: usuario.especialidad || null,
          edad: usuario.edad || null,
          telefono: usuario.telefono || null,
          pacienteId: usuario.pacienteId || null,
          cedula: usuario.cedula || null,
          informacionProfesional: usuario.informacionProfesional || null,
          direccionConsultorio: usuario.direccionConsultorio || null

        })
      ).pipe(
        catchError(err => {
          console.error('Error saving user details:', err);
          return throwError(err);
        })
      );
    }),
    catchError(err => {
      console.error('Error during registration:', err);
      return throwError(err);
    })
  );
}
///////////////////////////////////////////////////////////////////////
     //METODO PARA OBTENER LA INFORMACION COMPLETA DEL USUARIO //
      getUsuario(): UsuarioModel {
        return {
          email: this.getStoredUserName(),
          nombres: this.getStoredName(),
          id: this.getStoredUserUid(),
          password: '', 
          rol: '', 
          especialidad: null, 
          edad: null,
          direccionConsultorio: null,
          informacionProfesional: null 
        } as UsuarioModel;
      }


 ///////////////////////////////////////////////////////////////////////
     //METODO PARA OBTENER A TODOS LOS MEDICOS REGISTRADOS //

     obtenerMedicos(): Observable<UsuarioModel[]> {
      return this.db.list<UsuarioModel>('/usuarios', ref => ref.orderByChild('rol').equalTo('medico')).valueChanges().pipe(
        catchError(err => {
          console.error('Error al obtener médicos:', err);
          return throwError(err);
        })
      );
    }
    

/////////////////////////////////////////////////////////////////////
        //LOGIN ACTUAL RECONOCE EL ROL DEL USUARIO QUE INGRESA//
      login2(usuario: UsuarioModel): Observable<UsuarioModel> {
        const auth = {
          ...usuario,
          returnSecureToken: true
        };
        
        return this.http.post(`${this.url}:signInWithPassword?key=${this.apykey2}`, auth).pipe(
          switchMap((resp: any) => {
            this.userPassword = usuario.password;
            this.almacenarToken(resp['idToken']);
            this.almacenarUserName(usuario.email);
            this.almacenarUid(resp['localId']);
            this.cargarUsuarioActual2();
            this.emailUsuario.next(usuario.email);
            this.usuarioId.next(resp['localId']);
            this.loggedIn.next(true);
            
            return this.db.object<UsuarioModel>(`/usuarios/${resp['localId']}`).valueChanges().pipe(
              take(1),
              map(user => {
                this.usuarioActual2.next(user);
                return user;
              })
            );
          }),catchError(err => {
            console.error('Error during login:', err);
            return throwError(err);
          })
        );
      }

/////////////////////////////////////////////////////////////////////
              //METODO CERRAR SESION//

    cerrarCesion(){
        this.userPassword = null;
        this.removeItem('token');
        this.removeItem('userName');
        localStorage.removeItem('cedulaPaciente');
        localStorage.removeItem('userUid')
        localStorage.removeItem('email');
        this.emailUsuario.next(null);
        this.loggedIn.next(false);
        this.usuarioId.next('');
        this.afAuth.signOut().then(() => {
        this.usuarioActual2.next(null);
        this.router.navigate(['/inicio']);
        });
      
      }

 /////////////////////////////////////////////////////////////////////
              //METODO PARA CAMBIAR LA CLAVE DE USUARIO//

      recuperarContrasena(email: string) {
        const requestPayload = {
          requestType: "PASSWORD_RESET",
          email: email
        };
        return this.http.post(`${this.url}:sendOobCode?key=${this.apykey2}`, requestPayload)
          .pipe(
            map(resp => {
              return resp;
            })
          );
      }


/////////////////////////////////////////////////////////////////////
          //MTODOS PARA OBTENER VALORES DEL LOCAL STORAGE//

        hasToken(): boolean {
          return !!this.getItem('token');}
        getStoredUserName(): string {
          return this.getItem('userName') || '';}

        getStoredName(): string {
            return this.getItem('nombres') || '';}
        getStoredUserUid(): string {
          return this.getItem('userUid') || '';}

      
      almacenarToken(idToken:string){
        this.userToken = idToken
        this.setItem('token', idToken);
      }
      
      obtenerToken(){
        if(localStorage.getItem('token')){
          this.userToken = this.getItem('token')
        }else{
          this.userToken = '';
        }
        return this.userToken;
      }

      almacenarName(nombre: string) {
        this.setItem('nombres', nombre);
      }

      obtenerName() {
        const nameStorage = localStorage.getItem('nombres');
        if (nameStorage) {
          this.emailUsuario.next(nameStorage);
        }
      }
      almacenarUserName(email: string) {
        this.setItem('userName', email);
      }

      obtenerUserName() {
        const emailStorage = localStorage.getItem('userName');
        if (emailStorage) {
          this.emailUsuario.next(emailStorage);
        }
      }

      almacenarEmail(email: string) {
        this.setItem('email', email);
      }

      obtenerEmail() {
        const emailStorage = localStorage.getItem('email');
        if (emailStorage) {
          this.emailUsuario.next(emailStorage);
        }
      }

      almacenarUid(Uid: string) {
        this.setItem('userUid', Uid);
      }

      obtenerUid() {
        const uidStorage = localStorage.getItem('userUid');
        if (uidStorage) {
          this.usuarioId.next(uidStorage);
        }
      }
      almacenarCedula(user: UsuarioModel): void {
        localStorage.setItem('cedulaPaciente', user.cedula.toString());

      }

      autenticado():boolean{
        if(this.getItem('token')){
          this.valorBoolean = true;
          this.loggedIn.next(true);
          return true;
        }else{
          this.valorBoolean = false;
          this.loggedIn.next(false);
          return false;
        }
      }

            setItem(key: string, value: string) {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem(key, value);
                }
              }

            getItem(key: string): string | null {
                if (typeof localStorage !== 'undefined') {
                  return localStorage.getItem(key);
                }
                return null;
              }

            removeItem(key: string) {
                if (typeof localStorage !== 'undefined') {
                  localStorage.removeItem(key);
                }
              }

// datos configuracion del usuario //
      
//METODO PARA OBTENER LOS DATOS DEL USUARIO ACTUAL CON EL UID DE FIREBASE//

getUsuarioActual(): Observable<UsuarioModel> {
  const uid = this.getStoredUserUid();
  return this.db.object<UsuarioModel>(`/usuarios/${uid}`).valueChanges().pipe(
    map((usuario: UsuarioModel) => {

      return usuario;
    }),
    catchError(err => {
      console.error('Error al obtener el usuario Actual:', err);
      return of(null);
    })
  );
}


//METODO PARA ACTUALIZAR LOS DATOS DEL USUARIO ACTUAL CON EL UID DE FIREBASE//
actualizarUsuario(usuario: UsuarioModel): Observable<any> {
  const uid = usuario.id; 

  return from(this.db.object(`/usuarios/${uid}`).update({
    nombres: usuario.nombres,
    telefono: usuario.telefono,
    especialidad: usuario.especialidad,
    cedula: usuario.cedula,
    edad: usuario.edad,
    direccionConsultorio: usuario.direccionConsultorio,
    informacionProfesional: usuario.informacionProfesional,
    
    
  })).pipe(
    tap(() => {
      //console.log('datos actualizados');
    }),
    catchError(err => {
      console.error(err);
      return throwError(err);
    })
  );
}

getUsuarioCedula(uid: string) {
  return this.db.object(`/usuarios/${uid}`).valueChanges().pipe(
    map((usuario: UsuarioModel) => usuario.cedula)
  );
}

getUsuarioByEmail(email: string): Observable<UsuarioModel> {
  return this.db.list<UsuarioModel>('/usuarios', ref => ref.orderByChild('email').equalTo(email))
    .valueChanges()
    .pipe(
      map(usuarios => usuarios[0])
    );
}

subirFotoPerfil(file: File, userId: string): Observable<void> {
  const filePath = `usuarios/${userId}/profilePicture`;
  const fileRef = this.storage.ref(filePath);
  const uploadTask = this.storage.upload(filePath, file);

  return uploadTask.snapshotChanges().pipe(
    switchMap(() => fileRef.getDownloadURL()),
    switchMap((url: string) => {
      // Guarda la URL en la base de datos del usuario
      return this.db.object(`/usuarios/${userId}`).update({ fotoUrl: url });
    })
  );
}
      
      

 
}
