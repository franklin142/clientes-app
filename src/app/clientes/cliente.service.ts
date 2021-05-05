import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
//import {CLIENTES} from './clientes.json';//importa el json estatico escrito en typescript
import { Observable, throwError } from 'rxjs';//permite manejar pedidos asincronos al api rest o procesos que tarden tiempo
//import { of} from 'rxjs/observable/of';// es quien permite extraer el resultado de la peticion una vez termine
import { HttpClient, HttpHeaders } from '@angular/common/http'; // permite conectarse a las api rest
import { map, catchError } from 'rxjs/operators';// permite mapear una respuesta de API Rest al tipo de dato que se necesita del lado del cliente
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {
  urlEndPointCliente: string = 'http://localhost:8081/api/clientes';
  public httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });//contiene el header content-type
  constructor(
    public http: HttpClient,
    public router: Router) { }
  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);// retornar lista desde un json estatico de typescript
    //return this.http.get<Cliente[]>(this.urlFindAll);// es necesario convertir la respuesta al tipo del objeto <Cliente[]>
    return this.http.get(this.urlEndPointCliente).pipe(
      map(response => response as Cliente[])
    );
  };
  getClienteById(id: number): Observable<Cliente> {
    //return of(CLIENTES);// retornar lista desde un json estatico de typescript
    //return this.http.get<Cliente[]>(this.urlFindAll);// es necesario convertir la respuesta al tipo del objeto <Cliente[]>
    return this.http.get<Cliente>(`${this.urlEndPointCliente}/${id}`).pipe(
      // pipe es de httpClient y sirve tambien para manejo de errores
      // se pueden agregar varios operadores como catchError y map entre otros separandolos por comas
      catchError(e => {// de rxjs/operators y sirve manejar un error producido en el servidor 
        swal.fire('Error de servidor obtener', e.error.message, 'error');
        this.router.navigate(['/clientes']);
        return throwError(e);// de rsjx/observable y sirve para retornar a otras instancias el error capturado
      })
    );
  };
  create(cliente: Cliente): Observable<any> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    //Este endpint nos devuelve un json con el en cliente y un mensaje de éxito
    //por este motivo se retorna un tipo de dato any
    return this.http.post<any>(this.urlEndPointCliente, cliente, { headers: this.httpHeaders }).pipe(
      map(response => response as Cliente),
      catchError(e => {
        swal.fire('Error de servidor al crear', e.error.message, 'error');
        return throwError(e);// de observable
      })
    );
  }
  update(cliente: Cliente): Observable<Cliente> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    const url:any = `${this.urlEndPointCliente}/${cliente.id}`;
    return this.http.put<Cliente>(url, cliente,{ headers: this.httpHeaders }).pipe(
        catchError(e => {
          swal.fire('Error de servidor al actualizar', e.error.message, 'error');
          return throwError(e);// de observable
        })
      );
  };
  delete(id: number): Observable<any> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    //Este endpint nos devuelve un json con el en cliente y un mensaje de éxito
    //por este motivo se retorna un tipo de dato any
    const url:any = `${this.urlEndPointCliente}/${id}`;
    return this.http.delete<any>(url, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error de servidor al eliminar', e.error.message, 'error');
        return throwError(e);// de observable
      })
    );
  };
};
