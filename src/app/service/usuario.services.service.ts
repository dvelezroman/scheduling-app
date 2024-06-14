import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnInit } from '@angular/core';
import { UsuarioModel } from '../components/models/usuario.model';
import { BehaviorSubject, Observable, catchError, from, map, of, switchMap, tap, throwError } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})

export class UsuarioServicesService implements OnInit {
  
    apykey2 = 'AIzaSyABv3KzkWITNxeRKkyba_oqDfHGRYexHo0';
   // apykey = 'AIzaSyD865HzIS-rxI3S6_K_mUAxMi-ipxDs7z0';
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
                private afAuth : AngularFireAuth
    ) {
      this.cargarUsuarioActual2();  
    }

      //este es la nueva función para tener el usuario actual por medio del uid que se almacena en local storage //

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
  
//este es la nueva funcion para tener el usuario actual hasta aqui //

    ngOnInit(): void {}



//funcion para registrar normal usuario//
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


      //funcion para registrar dependiendo si es medico o un paciente//
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
                telefono: usuario.telefono || null                
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

      
      

 

