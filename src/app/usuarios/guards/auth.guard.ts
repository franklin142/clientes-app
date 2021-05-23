import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService:AuthService,
    public router:Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.isAuthenticated()){
        //validamos que el token no haya expirado, de lo contrario cerramos sesion
        if(this.isTokenExpired()){
          this.authService.logout();
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
  }
  isTokenExpired():boolean{
    const token = this.authService.token;
    const payload = this.authService.obtenerDatosToken(token);

    //convertimos la fecha actual a segundos
    const now = new Date().getTime()/1000;
    if(payload.exp < now){
      return true;
    }else{
      return false;
    }


  }
  
}
