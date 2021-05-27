import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  urlEndPointFacturas: string = 'http://localhost:8081/api/facturas';
  constructor(
    private http:HttpClient,
    private router:Router
  ) { }
  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.urlEndPointFacturas);
  };
  getFacturaById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndPointFacturas}/${id}`).pipe(
      // pipe es de httpClient y sirve tambien para manejo de errores
      // se pueden agregar varios operadores como catchError y map entre otros separandolos por comas
      map(response=>{
        let factura = response as Factura;
        factura.total = factura.total;
        return factura; 
      }),
      catchError(e => {// de rxjs/operators y sirve manejar un error producido en el servidor 
        if (e.status != 401 && e.error.message) {
          Swal.fire('Error de servidor al obtener', e.error.message, 'error');
          this.router.navigate(['/clientes']);
        }
        return throwError(e);// de rsjx/observable y sirve para retornar a otras instancias el error capturado

      })
    );
  };
  deleteFacturaById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPointFacturas}/${id}`).pipe(
      catchError(e => {// de rxjs/operators y sirve manejar un error producido en el servidor 
        if (e.status != 401 && e.error.message) {
          Swal.fire('Error de servidor al elimina...r', e.error.message, 'error');
          this.router.navigate(['/clientes']);
        }
        return throwError(e);// de rsjx/observable y sirve para retornar a otras instancias el error capturado
      })
    );
  }
  filtarProductos(nombre:string):Observable<Producto[]>{
    const url = `${this.urlEndPointFacturas}/filtrar-productos/${nombre}`;
    return this.http.get<Producto[]>(url);
  }
  createFactura(factura:Factura): Observable<Factura> {
    return this.http.post<Factura>(this.urlEndPointFacturas, factura);
  }
}
