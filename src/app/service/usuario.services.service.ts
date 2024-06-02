import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UsuarioModel } from '../components/models/usuario.model';
import { BehaviorSubject, map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UsuarioServicesService implements OnInit {
apykey = 'AIzaSyD865HzIS-rxI3S6_K_mUAxMi-ipxDs7z0';
url = 'https://identitytoolkit.googleapis.com/v1/accounts';
crearUsuario = ':signUp?key=';
iniciarSesion = ':signInWithPassword?key=[API_KEY]';
userToken:string;
valorBoolean:boolean = false;
nombreUsuario:string;
 emailUsuario = new BehaviorSubject<string>(this.getStoredUserName());
 loggedIn = new BehaviorSubject<boolean>(this.hasToken());


constructor(private http :HttpClient) { 

}
get usuarioActual(){
  return this.emailUsuario.asObservable();
  
}
get isLoggedIn(){
  return this.loggedIn.asObservable();
}
ngOnInit(): void {

}

  registrar(usuario:UsuarioModel){
    const auth = {
      ...usuario,
      returnSecureToken: true
    }
    return this.http.post(`${this.url}:signUp?key=${this.apykey}`, auth)
    .pipe(

      map( resp => {
        this.almacenarToken(resp['idToken']);
        this.almacenarUserName(usuario.email);
        this.emailUsuario.next(usuario.email);
        this.loggedIn.next(true);
        return resp;
      })

    )
  };

  
  login(usuario:UsuarioModel){
    const auth={
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(`${this.url}:signInWithPassword?key=${this.apykey}`, auth)
    .pipe(

      map( resp => {
        this.almacenarToken(resp['idToken']);
        this.almacenarUserName(usuario.email);

        this.emailUsuario.next(usuario.email);
        this.loggedIn.next(true);
        console.log(resp)
        return resp;
      })

    )
  }

  cerrarCesion(){
    this.removeItem('token');
    this.removeItem('userName');
    localStorage.removeItem('email');
    this.emailUsuario.next('');
    this.loggedIn.next(false);
  }

  hasToken(): boolean {
    return !!this.getItem('token');
  }

  getStoredUserName(): string {
    return this.getItem('userName') || '';
  }

  
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

//metodos que configura el localstorage undefined//

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

  
  

}

