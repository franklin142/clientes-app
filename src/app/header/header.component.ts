import{Component} from '@angular/core' ;
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
@Component({
  selector:'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent{
  title: string = 'App Angular';
  constructor(
    //lo hacemos publico para poder acceder a él desde la vista html
    public authService:AuthService,
    public router:Router
  ){}
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
