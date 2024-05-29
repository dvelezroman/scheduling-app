import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, Output } from '@angular/core';
import { UsuarioModel } from '../components/models/usuario.model';
import { map } from 'rxjs';
import { EventEmitter } from 'stream';


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
  



constructor(private http :HttpClient) { 

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
    this.userToken = idToken
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
    if(localStorage.getItem('token')){
      this.valorBoolean = true;
      return true;
    }else{
      this.valorBoolean = false;
      return false;
    }
  }


}
