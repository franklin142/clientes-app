import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ClockService } from '../services/clock.service';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  titulo: string = 'Login';
  usuario: Usuario = new Usuario();

  constructor(
    public authService:AuthService,
    public clock:ClockService,
    public router:Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()){
      this.router.navigate(['/clientes']);
      const username =this.authService.usuario.username;
      Swal.fire("Info",`Hola ${username}! ya iniciaste sesión`,"info");
    }
  }
  login():void{
    this.authService.login(this.usuario).subscribe(response=>{
      // Los token traen 3 secciones separadas por un punto, 
      // de los cuales el primero indica el algoritmo de codificacion
      // el segundo indica el payload o datos que pueden ser decodificados
      // y utilizados en nuestro codigo. Y por ultimo la clave con la que 
      // fue firmado el token. En nuestros caso vamos a extraer el payload

      this.authService.guardarToken(response.access_token);
      this.authService.guardarUsuario(response.access_token);
      // obtenemos los valores de los getters generados en authService,
      // notese que a pesar de ser metodos aqui se manejan como propiedades
      // gracias a que utilizamos propiedades private con el mismo nombre
      // y angular es capaz de entenderlo.
      let usuario = this.authService.usuario;
      let msg =`${this.clock.getSaludo()} ${usuario.nombre}`;
      msg += ` esperamos que te diviertas el dia de hoy! Recuerda que puedes `;
      msg += ` contactarnos si tienes alguna inquietud`;

      Swal.fire('Bienvenido',msg,'success');
      this.router.navigate(['/clientes/page/0']);

    },
    //Manejamos el error que puede ocurrir en el subscribe
    error =>{
      //controlamos el error 400 que significa credenciales invalidas de forma generica
      if(error.status==400){
        let msg = 'Credenciales erroneas, comuniquese con';
        msg+= 'nosotros si ha olvidado sus datos de usuario';
        Swal.fire('Opps!',msg,'error');
      }
    }
    );
  }
}
