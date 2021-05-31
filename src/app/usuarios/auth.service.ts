import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = URL_BACKEND+'/oauth/token';
 // Son private y sirven para poder generar metodos public get 
  private _usuario: Usuario = new Usuario();
  private _token: string ='';
 // Se genera el metodo get que servirá para obtener los datos 
 // desde cada peticion que sea necesaria.
 // para generar estos metodos deben ser con el mismo nombre de
 // la propiedad private definida previamente pero estos deben 
 // quedar sin el guion bajo que caracteriza las propiedades private.
  public get usuario():Usuario {
    if(this._usuario.id){
      return this._usuario;
    }else if(!this._usuario.id && sessionStorage.getItem('usuario')){
      // Es importante setear el valor encontrado en el sesionStorage
      // ya que este debe estar dispobible ante cualquier situacion de error
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')||"") as Usuario;
      return this._usuario;
    }
    // Si llegamos hasta aqui es porque el usuario no ha iniciado sesion
    return new Usuario();
  }
  public get token():string {
    if(this._token){
      return this._token;
    }else if(!this._token && sessionStorage.getItem('token')){
      // Es importante setear el valor encontrado en el sesionStorage
      // ya que este debe estar dispobible ante cualquier situacion de error
      this._token =  sessionStorage.getItem('token')||'';
      return this._token;
    }
    // Si llegamos hasta aqui es porque el usuario no ha iniciado sesion
    return '';
  }
  constructor(
    public http:HttpClient
    ) { }
  login(usuario:Usuario):Observable<any>{
    //Se debe enviar el nombre y clave de la app encriptados al backend 
    const credentials = btoa("angularapp"+":"+"apisecretkey123");
    //Genera un arreglo de HttpHeaders
    const httpHeaders:HttpHeaders = new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization':'Basic ' + credentials
    });

    //Genera una cadena de variables en formato URL
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.password);
    //params debe ir convertido en string
    return this.http.post<any>(this.url, params.toString(), {headers:httpHeaders});
  }
  logout(){    
    //elimina del sessionStorage las variables una por una
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    // limpia totalmente el sessionStorage
    sessionStorage.clear();
    // limpiamos tambien las propiedades llenas en el service 
    // de acceso rapido
    this._token = '';
    this._usuario = new Usuario();
  }
  guardarUsuario(token:string){
    const payload = this.obtenerDatosToken(token);
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.roles = payload.authorities;
    this._usuario.username = payload.user_name;
    this._usuario.email = payload.email;
    // sessionStorage almacena datos para la sesion actual, 
    // si se desea guardar permanentemente alguna variable 
    // entonces se debe utilizar localStorage.
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));

  }
  guardarToken(token:string){
    // sessionStorage almacena datos para la sesion actual, 
    // si se desea guardar permanentemente alguna variable 
    // entonces se debe utilizar localStorage.
    this._token = token;
    sessionStorage.setItem('token',this._token);
  }
  obtenerDatosToken(token:string){
    if(token){
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    }else{
      return null;
    }
  }
  //Determina si esta logeado o no el usuario
  isAuthenticated():boolean{
    const token = this.token;
    const payload = this.obtenerDatosToken(token);
    if(payload && payload.user_name && payload.user_name.length>0){
      return true;
    }    
    return false;
  }
  //valida si el usuario tiene un role definido
  hasRole(role:string){
    if(this.usuario.roles.includes(role)){
      return true;
    }else{
      return false;
    }
  }

}
