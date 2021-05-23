
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public authService:AuthService
  ){}
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      
      const token = this.authService.token;
      if(token && token.length>0){
        const authReq = req.clone({
          headers: req.headers.set('Authorization','Bearer '+token)
        });
        // Si existe el token es de vital importancia enviar el req modificado
        // de lo contrario no tendria efecto alguno en la cabecera de la peticion
        return next.handle(authReq);
      }
    return next.handle(req);
  }
}