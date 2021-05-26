import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {
  titulo:string='Nueva Factura';
  factura:Factura = new Factura();
  autoComplete = new FormControl();
  productos: string[] = ['One', 'Two', 'Three'];
  productosFiltrados!: Observable<Producto[]>;
  constructor(
    public clienteService:ClienteService,
    public facturaService:FacturaService,
    public activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
      let clienteId:number = parseInt(params.get('clienteId')||"0");
      this.clienteService.getClienteById(clienteId)
      .subscribe(cliente =>this.factura.cliente = cliente);
    });
    // Necesario para que el autocomplete de productos funcione 
    this.productosFiltrados = this.autoComplete.valueChanges
    .pipe(
      // se mapea para cambiar de objeto a string cuando
      // se esta escribiendo o cuando se selecciona
     map(value => typeof value ==='string' ? value: value.nombre), 
     // aplana el Observable<Observable<Producto[]>> a Observable<Producto[]>
     mergeMap(value => value ? this._filter(value):[])
    );
  }

 // Necesario para que el autocomplete de productos funcione 
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtarProductos(value);

  }

  mostrarNombre(producto?:Producto):string {
    return producto ? producto.nombre:'';
  }
  seleccionarProducto(event:MatAutocompleteSelectedEvent){
    let itemFactura = new ItemFactura();
    let productoSelected = event.option.value as Producto;
    
    console.log(productoSelected);

    itemFactura.producto = productoSelected;

    this.factura.items.push(itemFactura);
    this.autoComplete.setValue('');

    // Establecemos el foco en el control de seleccion de producto
    event.option.focus();
    // Deseleccionamos el producto para poder volver a seleccionar otro
    event.option.deselect();
  }

  removerItem(item:ItemFactura){
    this.factura.items = this.factura.items.filter(a=>a != item);
  }
  actualizaCantidad(id:number, event:any):void{
    let cantidad:number = event.target.value as number;
    
    this.factura.items = this.factura.items.map((item:ItemFactura) =>{
      if(id==item.producto.id){
        item.cantidad = cantidad;
      }
      console.log(item.id+ ' '+ id);
      
      return item;
    }); 
  }
}
