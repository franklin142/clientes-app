import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService} from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';//Activated route sirve para poder obtener variables de la url
import  Swal  from 'sweetalert2';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  public cliente:Cliente = new Cliente();
  public titluloForm:string = 'Registrar nuevo Cliente';
  constructor(private clienteService:ClienteService,
    private router:Router,
    private activatedRoute: ActivatedRoute
  ) { }
  public cargarCliente():void{
    this.activatedRoute.params.subscribe(params => {
        let id : number = params['id'];
        if(id){
          this.clienteService.getClienteById(id).subscribe(
            cliente => this.cliente = cliente
          );
        }
    });
  }
  public create():void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
         response => {
           this.router.navigate(['/clientes']);
           Swal.fire('Operación realizada',`El cliente ${response.cliente.nombre} ha sido registrado exitosamente. `,'success');
       }

    );
  }
  public update():void {
    console.log(this.cliente);
    this.clienteService.update(this.cliente).subscribe(
         response => {
           this.router.navigate(['/clientes']);
           Swal.fire('Operación realizada',`El cliente ${response.nombre} ha sido actualizado exitosamente. `,'success');
       }

    );
  }
  ngOnInit() {
    this.cargarCliente();
  }

}
