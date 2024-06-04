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
    private emailUsuario = new BehaviorSubject<string>(this.getStoredUserName());
    private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    private usuarioId = new BehaviorSubject<string>(this.getStoredUserUid());
    private editarSubject = new BehaviorSubject<boolean>(false);
    private registradorSubject = new BehaviorSubject<string>(null);
    editar$ = this.editarSubject.asObservable();
    registrador$ = this.registradorSubject.asObservable();

        setRegistrador(value: string) {
          this.registradorSubject.next(value);
          }

        setEditar(value: boolean) {
          this.editarSubject.next(value);
          }

    get usuarioActual(){
      return this.emailUsuario.asObservable();}
    get usuarioLocalId(){
      return this.usuarioId.asObservable();}
    get isLoggedIn(){
      return this.loggedIn.asObservable();}

     


    constructor(private http :HttpClient) { }
    ngOnInit(): void {}

    registrar(usuario:UsuarioModel){
        const auth = {
          ...usuario,
          returnSecureToken: true
        }
        return this.http.post(`${this.url}:signUp?key=${this.apykey}`, auth)
        .pipe(

          map( resp => {
            this.almacenarToken(resp['idToken']);
            this.almacenarUid(resp['localId']);
            this.almacenarUserName(usuario.email);
            this.emailUsuario.next(usuario.email);
            this.usuarioId.next(resp['localId']);
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
            this.almacenarUid(resp['localId']);
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
      
      }

        hasToken(): boolean {
          return !!this.getItem('token');}
        getStoredUserName(): string {
          return this.getItem('userName') || '';}
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

      
      

 }

