import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente';
import {ClienteService} from './cliente.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  constructor(private clienteService:ClienteService, private router:Router) {
  }


  ngOnInit() {
    this.clienteService.getClientes().subscribe(
       clientes => this.clientes = clientes

   );
  }
  delete(cliente:Cliente):void {
    swal.fire({
      title: 'Confirmar',
      text: `Esta seguro que desea eliminar el cliente ${cliente.nombre} ${cliente.apellido}?`,
      showConfirmButton:true,
      confirmButtonText:'Si',
      showDenyButton:true,
      icon: 'question'
    }).then(r =>{
      if(r.isConfirmed){
        this.clienteService.delete(cliente.id).subscribe(
            response => {
            //  this.router.navigate(['/clientes']);
              this.clientes = this.clientes.filter(a=>a!=cliente);
              swal.fire('Operación realizada',`Cliente ${cliente.nombre} eliminado correctamente`,'success');
            }
        );
      }
    });

  }
}
