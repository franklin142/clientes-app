import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService} from './cliente.service';
//Activated route sirve para poder obtener variables de la url
import { Router, ActivatedRoute } from '@angular/router';
import  Swal  from 'sweetalert2';
import { Region } from './region';
import { Factura } from '../facturas/models/factura';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public regiones:Region[] = [];
  public titluloForm: string = 'Registrar nuevo Cliente';
  errors:String[]=[];
  
  constructor(private clienteService:ClienteService,
    private router:Router,
    private activatedRoute: ActivatedRoute//sirve para poder obtener una variable o ver los cambios de la url
    ) { }
    ngOnInit() {
      this.cargarCliente();
      this.clienteService.getRegiones().subscribe(regiones =>{
        this.regiones = regiones;
      });
    }

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
    this.clienteService.create(this.cliente).subscribe(
         response => {
           this.router.navigate(['/clientes']);
           Swal.fire('Operación realizada',`El cliente ${response.nombre} ha sido registrado exitosamente. `,'success');
       },
       err=>{
         this.errors = err.error.errors as String[];
       }

    );
  }
  public update():void {
    // Importante establecer a coleccion vacia todas las referencias a otras
    // clases para evitar que spring las intente insertar nuevamente en el backend
    this.cliente.facturas = [];
    this.clienteService.update(this.cliente).subscribe(
         response => {
           this.router.navigate(['/clientes']);
           Swal.fire('Operación realizada',`El cliente ${response.nombre} ha sido actualizado exitosamente. `,'success');
       }

    );
  }
  public compareWith(region1:Region,region2:Region):boolean{
    // Si se trata de la opcion agregar nuevo cliente, tanto la region 1
    // como la region 2 son undefined, lo que indica que debemos seleccionar
    // la opcion ---Seleccione una region--- del select, para lograrlo retornamos true.
    if(region1==undefined && region2==undefined){
      return true;
    }
    // Si la condicion anterior no se cumple significa que el usuario esta editando un cliente
    // entonces se debe evaluar si son iguales las coincidencias para marcar el que tenga 
    // asignado en la base de datos
    return region1 == null || region2 == null ? false : region1.id === region2.id;
  }
}
