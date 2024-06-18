import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UsuarioModel } from '../components/models/usuario.model';

import { BehaviorSubject, Observable, catchError, 
         from, map, of, switchMap, take, tap, throwError } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PacienteService } from './paciente.service';


@Injectable({
  providedIn: 'root'
})

export class UsuarioServicesService implements OnInit {
  
    apykey2 = 'AIzaSyABv3KzkWITNxeRKkyba_oqDfHGRYexHo0';
    url = 'https://identitytoolkit.googleapis.com/v1/accounts';
    crearUsuario = ':signUp?key=';
    iniciarSesion = ':signInWithPassword?key=[API_KEY]';
    userToken:string;
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
                private pacienteService: PacienteService) {
                
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
     //METODO PARA CREAR UN USUARIO NORMAL EN EL AUTHENTICATION DE FIREBASE//
    registrar2(usuario:UsuarioModel){
        const auth = {
          ...usuario,
          returnSecureToken: true
        }
        return this.http.post(`${this.url}:signUp?key=${this.apykey2}`, auth)
        .pipe(

          map( resp => {
            this.almacenarToken(resp['idToken']);
            this.almacenarUid(resp['localId']);
            this.almacenarUserName(usuario.email);
            this.almacenarName(usuario.nombres);
            this.emailUsuario.next(usuario.email);
            this.usuarioId.next(resp['localId']);
            this.loggedIn.next(true);
            return resp;
            
          })

        )
      };


   ///////////////////////////////////////////////////////////////////////
  //METODO PARA CREAR UN USUARIO EN EL REALTIME DATABASE CON EL MISMO UID QUE SE AUTENTICA//
     registrar(usuario: UsuarioModel): Observable<any> {
        
        const authData = {
          email: usuario.email,
          password: usuario.password,
          returnSecureToken: true
        };
    
        return this.http.post(`${this.url}:signUp?key=${this.apykey2}`, authData).pipe(
          switchMap(resp => {
            this.almacenarToken(resp['idToken']);
            this.almacenarUid(resp['localId']);
            this.almacenarUserName(usuario.email);
            this.almacenarName(usuario.nombres);
            this.cargarUsuarioActual2();
            this.emailUsuario.next(usuario.email);
            this.usuarioId.next(resp['localId']);
            this.loggedIn.next(true);
    
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
                pacienteId: usuario.pacienteId || null                
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
          pacienteId: usuario.pacienteId || null
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
          edad: null 
        } as UsuarioModel;
      }
    
///////////////////////////////////////////////////////////////////////
                  //LOGIN ANTERIOR //
    login(usuario:UsuarioModel): Observable<any> {
        const auth={
          ...usuario,
          returnSecureToken: true
        };
        return this.http.post(`${this.url}:signInWithPassword?key=${this.apykey2}`, auth)
        .pipe(
        
          map( resp => {
            this.almacenarToken(resp['idToken']);
            this.almacenarUserName(usuario.email);
            this.almacenarUid(resp['localId']);
            this.cargarUsuarioActual2();
            this.emailUsuario.next(usuario.email);
            this.usuarioId.next(resp['localId']);
            this.loggedIn.next(true);
            return resp;
          })

        )
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
        
        this.removeItem('token');
        this.removeItem('userName');
        localStorage.removeItem('userUid')
        localStorage.removeItem('email');
        this.emailUsuario.next(null);
        this.loggedIn.next(false);
        this.usuarioId.next('');
        this.afAuth.signOut().then(() => {
          this.usuarioActual2.next(null);
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
      
//metodos para obtener y actualizar datos del usuario actual//

getUsuarioActual(): Observable<UsuarioModel> {
  const uid = this.getStoredUserUid();
  return this.db.object<UsuarioModel>(`/usuarios/${uid}`).valueChanges().pipe(
    map((usuario: UsuarioModel) => {
      //console.log(usuario)
      return usuario;
    }),
    catchError(err => {
      console.error('Error fetching user data:', err);
      return of(null);
    })
  );
}


actualizarUsuario(usuario: UsuarioModel): Observable<any> {
  const uid = usuario.id; 

  return from(this.db.object(`/usuarios/${uid}`).update({
    nombres: usuario.nombres,
    telefono: usuario.telefono,
    especialidad: usuario.especialidad,
    
  })).pipe(
    tap(() => {
      console.log('datos actualizados');
    }),
    catchError(err => {
      console.error(err);
      return throwError(err);
    })
  );
}

}

      
      

 

