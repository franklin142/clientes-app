import { HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bufferToggle } from 'rxjs/operators';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from "./modal.service";
@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente | null = new Cliente;
  titluloForm: String = "Actualizar foto";
  foto!: File | null;
  progreso: number = 0;

  constructor(
    public clienteService: ClienteService, //para conectar con los datos del servicio
    public facturaService: FacturaService,
    //private activatedRoute: ActivatedRoute //Para detectar cuando cambia el id del usuario en la url
    public modalService: ModalService,
    public authService: AuthService

  ) { }

  ngOnInit(): void {
    /*
    //Para manejar la vista desde una ruta, cuando se hace desde el modal se comenta esta funcionalidad
    this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +(params.get("id") || "0");
      this.clienteService.getClienteById(id).subscribe(cliente => {
        this.cliente = cliente as Cliente;
      });
    });
    */

  }
  seleccionarFoto(target: EventTarget | null) {
    const element: HTMLInputElement = (target as HTMLInputElement);
    let type: string = '';
    this.foto = element.files ? element.files[0] : this.foto;
    console.log(this.foto);
    this.progreso = 0;
    //validamos si el archivo fue seleccionado y luego si el tipo 
    //de archivo es image, si se desea validar tipos de datos espeficos
    //utilizar image/jpg o image/png
    if (this.foto) {
      type = this.foto.type;
    }
    if (this.foto && !type.includes('image')) {
      Swal.fire('Alerta', 'El archivo debe ser una imagen', 'warning');
      this.foto = null;
      return;
    }
  }
  //subiendo foto manejando barra de progreso
  subirFoto() {
    if (this.foto && this.cliente?.id) {
      this.clienteService.uploadFoto(this.foto, this.cliente ? this.cliente.id : 0)
        .subscribe((event) => {
          //preguntamos si el tipo de evento es un HttpEventType.UploadProgress
          //evaluacion triple === evalua por valor y tipo de dato
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / (event.total || 1)) * 100) - 1;
          } else if (event.type === HttpEventType.Response) {
            //el ultimo evento retornado será el que contenga la respuesta completa del server 
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.progreso++;
            const message = response.message || 'Fotografía subida exitosamente';
            Swal.fire('Hecho', message, 'success');
            this.modalService.notificarUpload.emit(this.cliente);
          }

        });
    } else {
      Swal.fire('Alerta', 'No ha seleccionado ningún archivo', 'warning')
    }
  }
  /*
   //subiendo foto sin manejar barra de progreso
    subirFoto(){
    if(this.foto){
      this.clienteService.uploadFoto(this.foto,this.cliente.id)
      .subscribe(cliente=>{
        this.cliente = cliente;
      });
    }else{
      Swal.fire('Alerta','No ha seleccionado ningún archivo','warning')
    }
  } 
   */
  eliminarFactura(factura: Factura) {
    Swal.fire({
      title: 'Confirmar',
      text: `Esta seguro que desea eliminar la factura con folio #${factura.id}?`,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showDenyButton: true,
      icon: 'question'
    }).then(r => {
      if (r.isConfirmed) {
        this.facturaService.deleteFacturaById(factura.id).subscribe(Response => {
          if (this.cliente && this.cliente.facturas) {
            this.cliente.facturas = this.cliente.facturas.filter(a => a != factura);
            Swal.fire('Hecho','Factura eliminada correctamente','success');
          }
        });
      }
  });
}
cerrarModal() {
  this.cliente = null;
  this.foto = null;
  this.progreso = 0;
  this.modalService.closeModal();
}
}
