import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Este ModalService se crea con ng g s clientes/detalle/modal
 * y sirve para controlar los estados del modal y poder abrir y cerrarlo
 * el codigo de este archivo no es autogenerado por lo que replicar este
 * metodo de trabajar implica adaptar los metodos
 */
export class ModalService {
  modal:boolean = false;
  // para indicar que es privado y diferente se escribe un _ al 
  // principio del nombre quedando de la siguiente manera
  private _notificarUpload = new EventEmitter<any>(); 
  //nos permite emitir eventos desde afuera llamando
  // this.modalService.emit(this.cliente);
  get notificarUpload():EventEmitter<any>{
    return this._notificarUpload;
  };
  constructor() { }
  openModal(){
    this.modal=true;
  }
  closeModal(){
    this.modal=false;
  }
}
