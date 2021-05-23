
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Observable,throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

/** Este interceptor es para el response unicamente*/

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    public authService:AuthService,
    public router:Router
  ){}
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      
    return next.handle(req).pipe(
      // captura el error que venga de cualquier peticion http por lo cual 
      // es util para centralizar el manejo de errores definitivo y ahorrar
      // un buen fragmento de codigo en cada peticion http en los services
      catchError(error=>{
        // captura error de autenticacion, usuario no identificado
        if( error.status==401){
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        } 
        // captura error de falta de credenciales, usuario no autorizado
        if( error.status==403 ){
          this.router.navigate(['/clientes']);
          Swal.fire("Permisos insuficientes","Hola no estas autorizado para este recurso","warning");
        }
        return throwError(error);
      })

    );
  }
}