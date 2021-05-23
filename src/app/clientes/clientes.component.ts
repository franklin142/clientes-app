import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { map, tap } from 'rxjs/operators';//tap sirve para modificar los datos antes de ser retornados o despues de retornarlos del service
import { ModalService } from "./detalle/modal.service";
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  clienteSeleccionado:Cliente | null = null;
  paginator:any = "";
  constructor(
    private clienteService: ClienteService,
    private modalService:ModalService,
    public authService:AuthService,
   // private router: Router, //descomentar esta linea cuando se desee manejar rutas en los links
    private activatedRoute: ActivatedRoute//sirve para poder obtener una variable o ver los cambios de la url

  ) {
  }


  ngOnInit() {
    /* obtener datos del servicio sin paginador
    this.clienteService.getClientes().pipe(
      tap(clientes=>{
        return clientes.map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente; 
        });
      })
    ).subscribe(
      //Aqui los clientes ya vienen formateados 
      //del tap anterior y de los operadores map en el service
       clientes => this.clientes = clientes
   );
   */
  //lo que hace esta funcion es estar pendiente del cambio de la url
  //y evitar que se recargue el componente para mostrar los datos
  //es util para el rendimiento del navegador
  this.activatedRoute.paramMap.subscribe(
    params =>{
      let page:number = parseInt(params.get('page')||"0");
      this.clienteService.getClientes(page).pipe(
        tap((response: any) => {
          return (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            return cliente;
          });
        })
      ).subscribe(
        (response: any) => {
          this.clientes = response.content as Cliente[];
          this.paginator = response;
        }
      );
    }
  );
  // subscribe() percibe los cambios emitidos en modalService 
  // mediante el evento get notificarUpload() llamado desde otro compente
  // el cual es un modal 
  this.modalService.notificarUpload.subscribe(cliente=>{
    // recorremos el arreglo de clientes con map() para 
    // asignarle la nueva foto 
    this.clientes = this.clientes.map(clienteOriginal=>{
      if(clienteOriginal.id==cliente.id){
        clienteOriginal.foto= cliente.foto;
      }
      return clienteOriginal;
    })
  });
  }
  delete(cliente: Cliente): void {
    swal.fire({
      title: 'Confirmar',
      text: `Esta seguro que desea eliminar el cliente ${cliente.nombre} ${cliente.apellido}?`,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showDenyButton: true,
      icon: 'question'
    }).then(r => {
      if (r.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            //  this.router.navigate(['/clientes']);
            this.clientes = this.clientes.filter(a => a != cliente);
            swal.fire('Operación realizada', `Cliente ${cliente.nombre} eliminado correctamente`, 'success');
          }
        );
      }
    });

  }
  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.openModal();
  
  }
}
