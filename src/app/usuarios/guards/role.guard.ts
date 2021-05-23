import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    public authService:AuthService,
    public router:Router
  ){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let role:string = route.data['role'] as string;
      
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }
      // Data contiene un arreglo de variables que vienen desde
      // la configuracion de las rutas
      
      if(this.authService.hasRole(role)){
        return true
      }else{
        this.router.navigate(['/clientes']);
        Swal.fire("Permisos insuficientes","Hola no estas autorizado para este recurso","warning");
      }
    return false;
  }
  
}
