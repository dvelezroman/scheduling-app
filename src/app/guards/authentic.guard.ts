import {  Router } from '@angular/router';
import { Inject } from '@angular/core';


export const AuthGuard = () => {

 const ruta = Inject (Router)
    if(localStorage.getItem('token')){
      return true;
    }else{
      ruta.navigate(['/noAuth']);
      return false;
    }

}
