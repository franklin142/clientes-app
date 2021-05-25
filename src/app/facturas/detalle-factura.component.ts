import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from './models/factura';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {
  factura : Factura= new Factura();
  titulo:string = "Detalle de fatura"
  constructor(
    private facturaService:FacturaService,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let id:number = parseInt(params.get("id")||'0');
      this.facturaService.getFacturaById(id).subscribe(response => {
        this.factura = response as Factura
        console.log(this.factura);
      });
    });
  }

}
