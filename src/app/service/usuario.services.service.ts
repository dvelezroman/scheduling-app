import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../components/models/usuario.model';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioServicesService {
apykey = 'AIzaSyD865HzIS-rxI3S6_K_mUAxMi-ipxDs7z0';
url = 'https://identitytoolkit.googleapis.com/v1/accounts';
crearUsuario = ':signUp?key=';
iniciarSesion = ':signInWithPassword?key=[API_KEY]';
userToken:string;
constructor(private http :HttpClient) { }


  registrar(usuario:UsuarioModel){
    const auth = {
      ...usuario,
      returnSecureToken: true
    }
    return this.http.post(`${this.url}:signUp?key=${this.apykey}`, auth)
    .pipe(

      map( resp => {
        this.almacenarToken(resp['idToken']);
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
        return resp;
      })

    )
  }

  cerrarCesion(){
    localStorage.removeItem('token');
  }

  
  almacenarToken(idToken:string){
    localStorage.setItem('token', idToken);
  }
  
  
  obtenerToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token')
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }
  
  
  autenticado():boolean{
    return this.userToken.length > 2;
  }
}
