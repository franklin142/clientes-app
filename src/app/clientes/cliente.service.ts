import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
//importa el json estatico escrito en typescript
//import {CLIENTES} from './clientes.json';
//permite manejar pedidos asincronos al api rest o procesos que tarden tiempo
import { Observable, throwError } from 'rxjs';
// es quien permite extraer el resultado de la peticion una vez termine
//import { of} from 'rxjs/observable/of';
// permite conectarse a las api rest
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
// permite mapear una respuesta de API Rest al tipo de dato que se necesita del lado del cliente
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';
//import { DatePipe, formatDate, registerLocaleData } from '@angular/common';
@Injectable()
export class ClienteService {
  urlEndPointCliente: string = 'http://localhost:8081/api/clientes';
  public httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(
    public http: HttpClient,
    public router: Router) { }
  /* para obtener un listado sin paginacion
getClientes(): Observable<Cliente[]> {
  //return of(CLIENTES);// retornar lista desde un json estatico de typescript
  //return this.http.get<Cliente[]>(this.urlFindAll);// es necesario convertir la respuesta al tipo del objeto <Cliente[]>
  return this.http.get(this.urlEndPointCliente).pipe(
    map(response => {// formateamos los valores desde el observable

      let clientes = response as Cliente[];
      return clientes.map(cliente =>{
        cliente.email = cliente.email.toLowerCase();
        //utilizando formDate de angular, se puede usar cualquiera de las dos
        //cliente.createdAt = formatDate(cliente.createdAt,'dd-MM-yyyy','en-US');
        //utilizando pipe en la fecha
        //let datePipe = new DatePipe('es');
        //cliente.createdAt = datePipe.transform(cliente.createdAt,'EEEE dd, MMMM yyyy') || '';
        return cliente; //retorna un arreglo de Clientes el cual puede ser tomado por un tap debajo de esta funcion
      });//para cambiar los valores internos del array
    }),
    tap(response=>{//Response ya es de tipo Cliente[] gracias a la funcion map anterior
      response.forEach(cliente=>{
        console.log(cliente);
      });
    })
  );
};*/
  //para obtener un listado con paginacion
  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);// retornar lista desde un json estatico de typescript
    //return this.http.get<Cliente[]>(this.urlFindAll);// es necesario convertir la respuesta al tipo del objeto <Cliente[]>
    return this.http.get(this.urlEndPointCliente + '/page/' + page).pipe(
      map((response: any) => {// canvertimos el response a tipo any ya que por defecto es object, lo que impide que almacene todda la respuesta
        (response.content as Cliente[]).map(cliente => {
          cliente.email = cliente.email.toLowerCase();
          return cliente;
        });//para cambiar los valores internos del array
        return response;
      }),
      tap((response: any) => {//Response ya es de tipo Cliente[] gracias a la funcion map anterior
        (response.content as Cliente[]).forEach(cliente => {
        });
      })
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
  create(cliente: Cliente): Observable<Cliente> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    //Este endpint nos devuelve un json con el en cliente y un mensaje de éxito
    //por este motivo se retorna un response de tipo de dato any
    return this.http.post(this.urlEndPointCliente, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);// de observable  
        }
        swal.fire('Error de servidor al crear', e.error.message, 'error');
        return throwError(e);// de observable
      })
    );
  }
  update(cliente: Cliente): Observable<Cliente> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    const url: any = `${this.urlEndPointCliente}/${cliente.id}`;
    return this.http.put<Cliente>(url, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error de servidor al actualizar', e.error.message, 'error');
        return throwError(e);// de observable
      })
    );
  };
  delete(id: number): Observable<any> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    //Este endpoint nos devuelve un json con el en cliente y un mensaje de éxito
    //por este motivo se retorna un tipo de dato any
    const url: any = `${this.urlEndPointCliente}/${id}`;
    return this.http.delete<any>(url, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error de servidor al eliminar', e.error.message, 'error');
        return throwError(e);// de observable
      })
    );
  };
  uploadFoto(archivo: File, id: number): Observable<HttpEvent<{}>> {
    //Requiere enviar la url del endpoint, el objeto y las httpHeaders necesarias para autenticarse en el servidor
    const url: any = `${this.urlEndPointCliente}/upload`;
    let form: FormData = new FormData();
    form.append('id', `${id}`);
    form.append('archivo', archivo);
    const req = new HttpRequest('POST', url, form, {
      reportProgress: true
    });

    //enviar formData manejando progreso
    return this.http.request(req);

    /* 
    //enviar formData sin manejar progreso
    return this.http.post(url, form).pipe(
      map((response:any) =>{
        const message = response.message||'Fotografía subida exitosamente';
        swal.fire('Hecho',message,'success');
        return response.cliente as Cliente;
      }),  
      catchError(e => {
          swal.fire('Error de servidor al actualizar', e.error.message, 'error');
          return throwError(e);// de observable
        })
      );*/
  };
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPointCliente + '/regiones')
  };
};
