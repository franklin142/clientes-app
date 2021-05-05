import { Injectable } from '@angular/core';
import {Cliente} from './cliente';
//import {CLIENTES} from './clientes.json';//importa el json estatico escrito en typescript
import { Observable, throwError } from 'rxjs';//permite manejar pedidos asincronos al api rest o procesos que tarden tiempo
//import { of} from 'rxjs/observable/of';// es quien permite extraer el resultado de la peticion una vez termine
import { HttpClient, HttpHeaders } from '@angular/common/http'; // permite conectarse a las api rest
import { map, catchError } from 'rxjs/operators';// permite mapear una respuesta de API Rest al tipo de dato que se necesita del lado del cliente
import swal from 'sweetalert2';
@Injectable()
export class ClienteService {
  urlEndPointCliente : string = 'http://localhost:8081/api/clientes';
  public httpHeaders : HttpHeaders = new HttpHeaders({'Content-Type':'application/json'});//contiene el header content-type
  constructor(private http: HttpClient) { }
  getClientes() : Observable<Cliente[]> {
    //return of(CLIENTES);// retornar lista desde un json estatico de typescript
    //return this.http.get<Cliente[]>(this.urlFindAll);// es necesario convertir la respuesta al tipo del objeto <Cliente[]>
    return this.http.get(this.urlEndPointCliente).pipe(
      map(response => response as Cliente[])
    );
  };
  getClienteById(id : number) : Observable<Cliente> {
    //return of(CLIENTES);// retornar lista desde un json estatico de typescript
    //return this.http.get<Cliente[]>(this.urlFindAll);// es necesario convertir la respuesta al tipo del objeto <Cliente[]>
    return this.http.get<Cliente>(`${this.urlEndPointCliente}/${id}`).pipe(
      catchError(e => {
        swal.fire('Error de servidor',e.error.message,'error');
        return throwError(e);
      })
    );
  };
  create(cliente:Cliente) : Observable<Cliente> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    return this.http.post<Cliente>(this.urlEndPointCliente,cliente,{headers:this.httpHeaders}).pipe(
      map(response => response as Cliente)
    );
  }
  update(cliente:Cliente) : Observable<Cliente> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    return this.http.put<Cliente>(`${this.urlEndPointCliente}/${cliente.id}`,cliente, {headers:this.httpHeaders});
  };
  delete(id:number) : Observable<Cliente> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    return this.http.delete<Cliente>(`${this.urlEndPointCliente}/${id}`,{headers:this.httpHeaders});
  };
  };
